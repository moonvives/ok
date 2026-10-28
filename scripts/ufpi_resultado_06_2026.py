"""Resume o resultado final do Edital UFPI 06/2026 por curso e modalidade,
sem nomes: quantos aprovados, maior e menor EPC.

Uso:
    pdftotext -layout resultado_final.pdf resultado.txt
    python3 scripts/ufpi_resultado_06_2026.py resultado.txt

O PDF (com nomes de candidatos) não é guardado neste repositório. Fonte:
https://portalclubenews.com/wp-content/uploads/2026/07/cargos062026resultadofinal1_1.pdf
"""

import re
import sys
from collections import defaultdict

CURSO = re.compile(r'^(\d) - (BACHARELADO EM [^(]+)')
LINHA = re.compile(r'(\d{2}/\d{2}/\d{4})\s+(\d{3},\d{2})\s+(\d+)\s*([A-Z0-9\-]*)\s*$')


def main():
    curso = secao = None
    notas = defaultdict(list)
    with open(sys.argv[1], encoding='utf-8') as f:
        for linha in f:
            texto = linha.strip()
            m = CURSO.match(texto)
            if m:
                curso = m.group(2).strip()
                continue
            if texto.startswith('VAGAS '):
                secao = texto.split(' - ')[0].replace('VAGAS DA ', '').replace('VAGAS ', '')
                continue
            m = LINHA.search(linha)
            if m and curso and secao:
                notas[(curso, secao)].append(float(m.group(2).replace(',', '.')))
    print('curso,modalidade,aprovados,maior_epc,menor_epc')
    for (c, s), valores in notas.items():
        print(f'{c},{s},{len(valores)},{max(valores):.2f},{min(valores):.2f}')


if __name__ == '__main__':
    main()
