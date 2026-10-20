#!/usr/bin/env bash
#
# Hook de SessionStart: injeta um retrato curto e factual do repositorio no
# contexto do Claude no inicio de cada sessao (startup, resume, clear, compact).
#
# Contrato de hooks do Claude Code:
#   stdin  -> JSON do evento (nao usado aqui)
#   stdout -> um objeto JSON; hookSpecificOutput.additionalContext vai pro modelo
#   exit   -> SEMPRE 0. Um hook que falha nunca deve bloquear uma sessao.
#
# Regras de ouro deste script:
#   1. Rapido: roda antes do primeiro prompt. Nada de rede, nada de install.
#   2. Sem efeito colateral: so le o repositorio, nunca escreve nele.
#   3. Honesto: relata o que existe, nao o que deveria existir.

set -uo pipefail

# Ancora na raiz do projeto, nunca no diretorio de onde a sessao chamou. A
# ordem importa: a variavel do Claude Code primeiro, depois a localizacao
# deste proprio script (.claude/hooks/ -> raiz), e so por ultimo o git do cwd.
# Sem isso, uma chamada feita de outro diretorio relataria o repositorio
# errado em silencio.
if [ -n "${CLAUDE_PROJECT_DIR:-}" ] && [ -d "$CLAUDE_PROJECT_DIR" ]; then
  repo_root="$CLAUDE_PROJECT_DIR"
else
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)" || script_dir=""
  if [ -n "$script_dir" ] && [ -d "$script_dir/../.." ]; then
    repo_root="$(cd "$script_dir/../.." && pwd)"
  else
    repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || repo_root="$PWD"
  fi
fi
cd "$repo_root" 2>/dev/null || exit 0

# Se o destino nao for um repositorio git, nao ha retrato a dar: sai em
# silencio e com sucesso, sem poluir a sessao com erros do git.
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Converte stdin em uma string JSON (com as aspas). Tres niveis de degradacao
# para que o hook funcione em qualquer maquina, nao so nas que tem jq.
json_string() {
  if command -v jq >/dev/null 2>&1; then
    jq -Rs .
  elif command -v python3 >/dev/null 2>&1; then
    python3 -I -c 'import json,sys; sys.stdout.write(json.dumps(sys.stdin.read()))'
  else
    sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\t/\\t/g' -e 's/\r//g' \
      | awk 'BEGIN { ORS = ""; print "\"" } { print (NR > 1 ? "\\n" : "") $0 } END { print "\"" }'
  fi
}

# ---------------------------------------------------------------- fatos do git
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" || branch="(nenhum)"
head_line="$(git log -1 --format='%h %s' 2>/dev/null)" || head_line="(sem commits)"
remote="$(git config --get remote.origin.url 2>/dev/null)" || remote="(sem remote)"
# origin/HEAD nem sempre existe em clones rasos ou feitos por CI, entao cai
# para os nomes convencionais antes de desistir.
default_branch="$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null)"
default_branch="${default_branch#origin/}"
if [ -z "$default_branch" ]; then
  for candidate in main master; do
    if git show-ref --verify --quiet "refs/remotes/origin/$candidate" 2>/dev/null; then
      default_branch="$candidate (inferido: origin/HEAD nao esta definido)"
      break
    fi
  done
fi
[ -n "$default_branch" ] || default_branch="(indeterminado)"

dirty_count="$(git status --porcelain 2>/dev/null | grep -c '' || true)"
tracked_count="$(git ls-files 2>/dev/null | grep -c '' || true)"

if [ "${dirty_count:-0}" -eq 0 ]; then
  tree_state="limpa"
else
  tree_state="$dirty_count arquivo(s) modificado(s) ou nao rastreado(s)"
fi

# ------------------------------------------------------------------ toolchain
# Detecta, nao executa. Quando houver codigo, a secao "Verificacao" do
# CLAUDE.md passa a valer e este bloco relata os comandos reais do projeto.
toolchain=""
add_tool() { toolchain="${toolchain:+$toolchain, }$1"; }

[ -f package.json ]     && add_tool "Node (package.json)"
[ -f pnpm-lock.yaml ]   && add_tool "pnpm"
[ -f yarn.lock ]        && add_tool "yarn"
[ -f pyproject.toml ]   && add_tool "Python (pyproject.toml)"
[ -f requirements.txt ] && add_tool "Python (requirements.txt)"
[ -f go.mod ]           && add_tool "Go (go.mod)"
[ -f Cargo.toml ]       && add_tool "Rust (Cargo.toml)"
[ -f Makefile ]         && add_tool "Make (Makefile)"
[ -n "$toolchain" ] || toolchain="nenhuma detectada"

# Scripts de npm, quando existirem, sao a fonte mais confiavel de como
# testar e lintar o projeto.
npm_scripts=""
if [ -f package.json ] && command -v jq >/dev/null 2>&1; then
  npm_scripts="$(jq -r '(.scripts // {}) | keys | join(", ")' package.json 2>/dev/null || true)"
fi

# -------------------------------------------------------------------- contexto
context="Retrato do repositorio (hook SessionStart, .claude/hooks/session-start.sh):

  remote           : $remote
  branch atual     : $branch
  branch default   : $default_branch
  HEAD             : $head_line
  arvore de trabalho: $tree_state
  arquivos rastreados: ${tracked_count:-0}
  toolchain        : $toolchain"

if [ -n "$npm_scripts" ]; then
  context="$context
  npm scripts      : $npm_scripts"
fi

if [ "${tracked_count:-0}" -le 2 ]; then
  context="$context

Este repositorio ainda nao tem codigo de aplicacao: so a configuracao do Claude
Code. Nao invente comandos de build, test ou lint que nao existem. Leia o
CLAUDE.md antes de assumir convencoes."
fi

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":%s}}\n' \
  "$(printf '%s' "$context" | json_string)"

exit 0
