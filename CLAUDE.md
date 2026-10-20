# CLAUDE.md

Instrucoes de projeto para o Claude Code neste repositorio (`moonvives/ok`).

## Estado atual do repositorio

Este repositorio **ainda nao tem codigo de aplicacao**. Em 2026-10-20 ele
continha apenas o commit inicial (`Initialize repository`), um `.gitkeep`, e a
configuracao do Claude Code descrita abaixo.

Consequencia pratica, e a regra mais importante deste arquivo:

> **Nao invente comandos que nao existem.** Nao ha `npm test`, `make build`,
> `pytest` nem linter configurado. Se precisar de um comando de verificacao,
> confirme primeiro que ele existe; se nao existir, diga isso em vez de
> executar algo que falha.

Quando o projeto ganhar codigo, preencha a secao **Verificacao** abaixo. Ela
existe vazia de proposito: e ali que as proximas sessoes vao procurar.

## Linguagem

A documentacao e as mensagens deste repositorio estao em portugues.
Identificadores tecnicos (nomes de chaves, comandos, caminhos) permanecem em
sua forma original.

## Branches

- Desenvolva em branches `claude/<descricao>`. A branch desta configuracao e
  `claude/claude-rc-yhz1nj`.
- **Nunca** faca push direto para `main`. O `settings.json` nega as grafias
  mais obvias (`git push origin main*`), mas isso e uma rede de seguranca,
  nao uma garantia: a responsabilidade e de quem executa.
- Nao reescreva historico de branch de outra pessoa (sem `rebase`, `amend` ou
  `--force` ali). Em branch propria, siga a convencao do repositorio. Por isso
  `git rebase`, `git commit --amend` e `git push --force-with-lease` estao em
  `ask`: sao legitimos, mas pedem uma confirmacao consciente.
- Pull requests abrem como **draft**.

## Verificacao

<!-- Preencha quando houver codigo. Formato sugerido, um comando por linha:
     - instalar dependencias : <comando>
     - rodar testes          : <comando>
     - lint / formatacao     : <comando>
     - typecheck             : <comando>
     Rode estes comandos ANTES de qualquer push. Um push que quebra o CI custa
     um ciclo de revisao e a confianca de quem revisa. -->

Nada a verificar ainda: nao existe codigo, nem toolchain, nem CI configurado
neste repositorio. Nao presuma o contrario.

## Configuracao do Claude Code neste repositorio

| Caminho | Versionado | Papel |
| --- | --- | --- |
| `CLAUDE.md` | sim | Este arquivo: instrucoes lidas em toda sessao. |
| `.claude/settings.json` | sim | Permissoes e hooks compartilhados pelo time. |
| `.claude/settings.local.json` | **nao** (gitignored) | Overrides pessoais. |
| `.claude/hooks/session-start.sh` | sim | Hook de `SessionStart`. |
| `.claude/README.md` | sim | Explica cada decisao da configuracao. |

Leia `.claude/README.md` antes de alterar permissoes ou hooks: ele registra o
porque de cada regra, que e a parte que o JSON nao consegue expressar.

### Precedencia de settings

A ordem de carga e `user -> project -> local`, e a posterior sobrepoe a
anterior. Ou seja: `.claude/settings.local.json` vence
`.claude/settings.json`, que vence `~/.claude/settings.json`. Para desativar
localmente algo que o projeto liga, use o arquivo `local`.

## Convencoes de commit

- Mensagens no imperativo, descrevendo o efeito da mudanca.
- Um commit por mudanca coerente; nao misture configuracao com codigo.
- Nao inclua identificadores de modelo em mensagens de commit, corpos de PR,
  comentarios de codigo ou qualquer artefato versionado.
