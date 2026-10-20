# Configuracao do Claude Code

Este diretorio configura como o Claude Code opera neste repositorio. O JSON diz
*o que* esta configurado; este arquivo registra *por que*, que e a parte que o
JSON nao consegue expressar e a que se perde primeiro.

## Arquivos

| Arquivo | Versionado | Papel |
| --- | --- | --- |
| `settings.json` | sim | Permissoes e hooks do time. |
| `settings.local.json` | **nao** | Overrides pessoais (ver `.gitignore`). |
| `hooks/session-start.sh` | sim | Injeta o estado do repositorio no inicio da sessao. |

Ordem de carga: `~/.claude/settings.json` -> `.claude/settings.json` ->
`.claude/settings.local.json`. A posterior sobrepoe a anterior.

## Permissoes

### Por que a lista `allow` enumera subcomandos em vez de usar `git *`

A sintaxe de regras e de **prefixo**. `Bash(git *)` casa com `git`,
`git status` **e tambem** `git push --force`. Uma regra assim, pensada como
"liberar leitura do git", na pratica libera escrita e reescrita de historico.

Por isso a lista enumera um por um os subcomandos que apenas leem: `status`,
`log`, `diff`, `show`, `rev-parse`, `ls-files`, `blame`, `shortlog`,
`describe`, `show-ref`, `symbolic-ref`, `stash list`, `tag -l`.

Tres observacoes sobre casos que parecem leitura e nao sao:

- `git remote` esta liberado apenas como `-v` e `show *`, porque
  `git remote add` **escreve** na configuracao local.
- `git branch` nao esta liberado em bloco: `-d` e `-D` apagam refs e estao em
  `deny`.
- `git fetch` esta liberado. Ele usa rede, mas nao altera a arvore de trabalho
  nem branches locais, e o fluxo de trabalho depende dele.

### Por que `find` e `grep` nao estao na lista

Dois motivos. `find` aceita `-delete` e `-exec`, que a sintaxe de prefixo nao
consegue excluir de forma confiavel. E as ferramentas dedicadas `Glob` e
`Grep` cobrem o mesmo uso com melhor integracao. `rg` esta liberado porque
nao tem modo de escrita; `sed` so na forma `-n`, que nao grava.

### Por que `Read` nao esta liberado em bloco

Liberar `Read` sem restricao de caminho ampliaria a leitura para **fora** do
diretorio de trabalho. Essa e uma decisao que nao cabe a um arquivo de
projeto versionado tomar por todo mundo. O comportamento padrao do Claude
Code para leituras dentro do projeto ja e suficiente; o que esta aqui sao
apenas as **negacoes** de segredos.

### A lista `deny`

Cobre tres categorias:

1. **Destrutivo**: `sudo`, `rm -rf`, `git reset --hard`, `git clean`,
   `git filter-branch`, `git update-ref -d`, `git branch -d/-D`.
2. **Push indevido**: `--force`, `-f`, e as grafias obvias de push direto para
   `main`/`master`.
3. **Vazamento de segredo**: leitura de `.env`, `*.pem`, `*.key`, chaves SSH,
   `~/.ssh`, `~/.aws`, `.npmrc`. Mais `env` e `printenv`, que despejariam
   variaveis de ambiente inteiras no transcript da sessao.

`deny` tem precedencia sobre `allow`, que e o que permite liberar
`Bash(git status *)` e ainda assim barrar casos especificos.

Limite honesto desta lista: ela barra **grafias**, nao **intencoes**. Existem
outras formas de escrever um comando destrutivo. Isto e uma rede de seguranca
contra acidente, nao um limite de seguranca contra determinacao.

### A lista `ask`

`git rebase`, `git commit --amend` e `git push --force-with-lease` sao
legitimos em branch propria e proibidos em branch de outra pessoa. Nenhuma
regra consegue distinguir os dois casos, entao eles pedem confirmacao
explicita em vez de serem liberados ou negados.

### `defaultMode` foi deixado de fora

De proposito. Impor um modo de permissao a todo mundo que clona o repositorio
e uma decisao de pessoa, nao de projeto. Quem quiser, define em
`settings.local.json`.

## O hook de `SessionStart`

`hooks/session-start.sh` roda no inicio de cada sessao e injeta um retrato
factual do repositorio no contexto: remote, branch atual, branch default,
HEAD, estado da arvore, numero de arquivos rastreados e toolchain detectada.
Quando ha `package.json`, lista tambem os scripts de npm disponiveis.

Ele **detecta, nao executa**. Nao roda testes nem instala dependencias: o hook
corre antes do primeiro prompt, e o custo apareceria em toda sessao. Quando o
projeto tiver codigo, o lugar de registrar os comandos de verificacao e a
secao **Verificacao** do `CLAUDE.md`.

### Garantias do script

- **Sai sempre com 0.** Um hook que falha nunca deve bloquear uma sessao.
- **Ancora na raiz do projeto**, na ordem `CLAUDE_PROJECT_DIR` -> localizacao
  do proprio script -> `git` do diretorio atual. Sem isso, uma chamada feita
  de dentro de outro repositorio git relataria o repositorio errado em
  silencio, que e o pior modo de falhar: sem erro e com dado falso.
- **Sai limpo em nao-repositorio**: sem saida e sem ruido de `fatal:` do git.
- **Degrada em tres niveis** para serializar JSON: `jq`, senao `python3`,
  senao `sed`/`awk`. Os tres caminhos foram verificados com um `PATH` reduzido.
- **Sem efeito colateral**: apenas le.

### Testar o hook sem iniciar uma sessao

```sh
echo '{}' | bash .claude/hooks/session-start.sh | jq -r '.hookSpecificOutput.additionalContext'
```

Para validar a forma do JSON e o encaixe no schema:

```sh
jq -e . .claude/settings.json
jq -e '.hooks.SessionStart[].hooks[] | select(.type == "command") | .command' .claude/settings.json
```

### Se o hook nao disparar

Alterar `settings.json` durante uma sessao pode nao recarregar a configuracao:
o Claude Code so observa diretorios que ja tinham arquivo de settings quando a
sessao comecou. Como `.claude/` foi criado agora, **esta primeira ativacao
exige abrir `/hooks` uma vez ou reiniciar a sessao**. Isso nao pode ser feito
de dentro da sessao. Depois disso, passa a recarregar normalmente.

Para revisar ou desativar hooks mais tarde, use `/hooks`. Sucesso silencioso e
invisivel por design: a interface so mostra "Ran N hooks" quando um hook falha
ou demora.
