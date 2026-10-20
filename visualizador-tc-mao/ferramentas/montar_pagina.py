"""Monta a página publicada a partir do index.html do visualizador.

Uso: python3 montar_pagina.py index.html SITE --titulo "Nome do exame" [--laudo "DD/MM/AAAA, HH:MM"]

SITE/index.html                 conteúdo da página (o envelope <!doctype><html><head><body> entra na
                                publicação): título, metas do exame e o visualizador
SITE/offline/visualizador.html  o visualizador completo, para uso sem internet
SITE/_teste.html                a mesma página dentro de um envelope igual ao da publicação (teste local)
Os dados vêm de empacotar_cd.py (SITE/exam/manifest.json e pacotes).
"""
import argparse, html, os, re

ap = argparse.ArgumentParser()
ap.add_argument("app"); ap.add_argument("site")
ap.add_argument("--titulo", required=True); ap.add_argument("--laudo", default="")
a = ap.parse_args()
src = open(a.app, encoding="utf-8").read()
assert src.startswith("<!DOCTYPE html>") and "<style>" in src, "index.html inesperado"
metas = ("<title>" + html.escape(a.titulo) + "</title>\n"
         '<meta name="exam-manifest" content="exam/manifest.json">\n'
         + ('<meta name="exam-report-due" content="' + html.escape(a.laudo) + '">\n' if a.laudo else "")
         + '<meta name="exam-offline-viewer" content="offline/visualizador.html">\n')
body = src[src.index("<style>"):].replace("</style>\n</head>\n<body>\n", "</style>\n", 1)
page = metas + re.sub(r"</body>\s*</html>\s*$", "", body)
for bad in ("<!DOCTYPE", "<html", "<head>", "</head>", "<body>", "</body>", "</html>"):
    assert bad not in page, "marcador de documento fora do lugar: " + bad
os.makedirs(os.path.join(a.site, "offline"), exist_ok=True)
open(os.path.join(a.site, "index.html"), "w", encoding="utf-8").write(page)
open(os.path.join(a.site, "offline", "visualizador.html"), "w", encoding="utf-8").write(src)
reset = (":root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}"
         "body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}")
open(os.path.join(a.site, "_teste.html"), "w", encoding="utf-8").write(
    '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">'
    "<style>" + reset + "</style></head><body>" + page + "</body></html>")
print("página:", len(page.encode()), "bytes")
