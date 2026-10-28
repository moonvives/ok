"""Gera as tabelas de Medicina no SiSU (2020-2025) a partir do repositório
público gabekanegae/sisu-data (licença MIT).

Uso:
    python3 scripts/build_sisu_medicina.py CAMINHO/sisu-data/data

Entradas manuais (neste repositório):
    data/manual/regras_pcd_proprias.csv   regra de escola de cada vaga PcD própria
    data/manual/ufs_valores_oficiais.csv  notas oficiais da UFS usadas na validação

Saídas (data/gerado/):
    sisu_medicina_modalidades_2020_2025.csv  uma linha por oferta x modalidade
    sisu_medicina_resumo_2020_2025.csv       uma linha por oferta, com os cortes PcD
    sisu_medicina_pcd_propria_2020_2025.csv  só as vagas PcD criadas pela instituição
    validacao_ufs.csv                        comparação com as listas oficiais da UFS
"""

import csv
import os
import re
import sys
from collections import defaultdict

ANOS = range(2020, 2026)
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANUAL = os.path.join(RAIZ, 'data', 'manual')
GERADO = os.path.join(RAIZ, 'data', 'gerado')

# Colunas fixas de grades.csv, na ordem em que src/data/grades.py as grava.
COLUNAS_OFERTA = [
    'codigo_oferta', 'curso', 'grau', 'turno', 'vagas_totais_oferta',
    'campus', 'municipio', 'uf', 'ies_nome', 'ies_sigla',
    'peso_cn', 'peso_ch', 'peso_lc', 'peso_mt', 'peso_red',
    'min_cn', 'min_ch', 'min_lc', 'min_mt', 'min_red', 'media_minima',
]

ACEITA_PRIVADA_TEXTO = (
    'qualquer que seja a sua procedência',
    'qualquer percurso escolar',
    'independente da escola',
    'independentemente da origem escolar',
    'independente do tipo de administração',
    'privada ou pública',
    'pública ou privada',
    'privadas ou públicas',
    'públicas ou privadas',
)
EXIGE_PUBLICA_TEXTO = ('escola pública', 'escolas públicas', 'escola publica', 'rede pública')


def numero(texto):
    """Converte '541.83' ou '.00' em float; devolve None para vazio ou zero."""
    texto = (texto or '').strip()
    if not texto:
        return None
    valor = float(texto)
    return valor if valor > 0 else None


def fmt(valor):
    return '' if valor is None else f'{valor:.2f}'


def classificar(texto):
    """Devolve (tipo, ppi) para o texto de uma modalidade do SiSU."""
    t = texto.lower()
    if t.startswith('ampla concorr'):
        return 'AC', False
    # A UFS chamou a mesma vaga de "necessidades educacionais especiais" em 2021 e 2022.
    pcd = 'defici' in t or 'necessidades educacionais especiais' in t
    ppi = 'pretos' in t or 'indígenas' in t
    # A vaga PcD própria da UFRN cita a Lei 12.711 só para proibir o acúmulo com as cotas.
    if pcd and escola_pelo_texto(texto) == 'sim':
        return 'PCD_PROPRIA', ppi
    # Algumas instituições descrevem as cotas da Lei 12.711 só pelo código (L1, L2...).
    if '12.711' in t or re.search(r'\(l\d{1,2}\)', t):
        if not pcd:
            return 'LEI_OUTRA', ppi
        renda_livre = 'independentemente da renda' in t
        return ('LEI_PCD_LI' if renda_livre else 'LEI_PCD_LB'), ppi
    return ('PCD_PROPRIA' if pcd else 'OUTRA_PROPRIA'), ppi


def escola_pelo_texto(texto):
    t = texto.lower()
    if any(k in t for k in ACEITA_PRIVADA_TEXTO):
        return 'sim'
    if any(k in t for k in EXIGE_PUBLICA_TEXTO):
        return 'nao'
    return None


def carregar_regras():
    regras = defaultdict(list)
    with open(os.path.join(MANUAL, 'regras_pcd_proprias.csv'), encoding='utf-8') as f:
        for r in csv.DictReader(f):
            regras[r['ies_sigla']].append(r)
    return regras


def regra_para(regras, sigla, ano):
    for r in regras.get(sigla, []):
        if int(r['ano_inicio']) <= ano <= int(r['ano_fim']):
            return r
    return None


def verificar_escola(tipo, texto, sigla, ano, regras):
    """Devolve (aceita_escola_privada, status, base, fonte)."""
    if tipo == 'AC':
        return 'sim', 'regra_geral', 'Ampla concorrência', ''
    if tipo.startswith('LEI_'):
        return 'nao', 'regra_geral', 'Lei 12.711/2012: ensino médio integralmente em escola pública', ''
    pelo_texto = escola_pelo_texto(texto)
    regra = regra_para(regras, sigla, ano)
    if pelo_texto is not None:
        fonte = regra['fonte_url'] if regra and regra['aceita_escola_privada'] == pelo_texto else ''
        return pelo_texto, 'verificado', 'Texto da modalidade no SiSU', fonte
    if regra:
        return (regra['aceita_escola_privada'], regra['status_verificacao'],
                regra['base'], regra['fonte_url'])
    if tipo == 'PCD_PROPRIA':
        return 'nao_verificado', 'nao_verificado', 'Texto da modalidade não menciona escola', ''
    return '', '', '', ''


def ler_ofertas(base, regras):
    linhas = []
    for ano in ANOS:
        caminho = os.path.join(base, str(ano), 'scraping', 'grades.csv')
        with open(caminho, encoding='utf-8') as f:
            for row in csv.reader(f, delimiter=';', quotechar='"'):
                if not row or row[1].strip().upper() != 'MEDICINA':
                    continue
                oferta = {c: row[i].strip() for i, c in enumerate(COLUNAS_OFERTA)}
                oferta['ano'] = ano
                resto = row[len(COLUNAS_OFERTA):]
                modalidades = []
                for i in range(0, len(resto) - 4, 5):
                    texto, vagas, corte, bonus, data = resto[i:i + 5]
                    tipo, ppi = classificar(texto)
                    if tipo == 'OUTRA_PROPRIA' and numero(bonus):
                        tipo = 'BONUS'
                    modalidades.append({
                        'tipo_modalidade': tipo,
                        'ppi': 'sim' if ppi else 'nao',
                        'modalidade_texto': ' '.join(texto.split()),
                        'vagas_modalidade': vagas.strip(),
                        'nota_corte': numero(corte),
                        'bonus_percentual': bonus.strip(),
                        'data_nota_corte': data.strip(),
                    })
                corte_ac = next((m['nota_corte'] for m in modalidades if m['tipo_modalidade'] == 'AC'), None)
                for m in modalidades:
                    aceita, status, base_v, fonte = verificar_escola(
                        m['tipo_modalidade'], m['modalidade_texto'], oferta['ies_sigla'], ano, regras)
                    dif = (m['nota_corte'] - corte_ac) if (m['nota_corte'] and corte_ac) else None
                    linhas.append({**oferta, **m,
                                   'nota_corte_ac': corte_ac,
                                   'diferenca_para_ac': dif,
                                   'aceita_escola_privada': aceita,
                                   'status_verificacao': status,
                                   'base_verificacao': base_v,
                                   'fonte_verificacao': fonte})
    return linhas


CAMPOS_MODALIDADES = (['ano'] + COLUNAS_OFERTA[:1] + ['ies_sigla', 'ies_nome', 'uf', 'municipio', 'campus',
                      'curso', 'grau', 'turno', 'vagas_totais_oferta'] + COLUNAS_OFERTA[10:] +
                      ['tipo_modalidade', 'ppi', 'modalidade_texto', 'vagas_modalidade', 'nota_corte',
                       'bonus_percentual', 'data_nota_corte', 'nota_corte_ac', 'diferenca_para_ac',
                       'aceita_escola_privada', 'status_verificacao', 'base_verificacao', 'fonte_verificacao'])


def gravar(nome, campos, linhas):
    caminho = os.path.join(GERADO, nome)
    with open(caminho, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=campos, extrasaction='ignore', lineterminator='\n')
        w.writeheader()
        for linha in linhas:
            w.writerow({k: (fmt(v) if isinstance(v, float) else v) for k, v in linha.items()})
    return caminho


def corte_lei(mods, tipo):
    """Corte da cota PcD da Lei 12.711; prefere a variante sem recorte PPI (2020-2023)."""
    candidatas = [m for m in mods if m['tipo_modalidade'] == tipo and m['nota_corte']]
    sem_ppi = [m for m in candidatas if m['ppi'] == 'nao']
    escolhidas = sem_ppi or candidatas
    return min((m['nota_corte'] for m in escolhidas), default=None)


def resumir(linhas):
    por_oferta = defaultdict(list)
    for l in linhas:
        por_oferta[(l['ano'], l['codigo_oferta'])].append(l)
    resumo = []
    for (ano, _), mods in sorted(por_oferta.items(), key=lambda x: (x[0][0], x[1][0]['uf'], x[1][0]['ies_sigla'], x[1][0]['municipio'])):
        o = mods[0]
        ac = next((m for m in mods if m['tipo_modalidade'] == 'AC'), None)
        propria = [m for m in mods if m['tipo_modalidade'] == 'PCD_PROPRIA']
        p = min(propria, key=lambda m: m['nota_corte'] or 9999) if propria else None
        resumo.append({
            'ano': ano, 'ies_sigla': o['ies_sigla'], 'ies_nome': o['ies_nome'], 'uf': o['uf'],
            'municipio': o['municipio'], 'campus': o['campus'], 'turno': o['turno'],
            'codigo_oferta': o['codigo_oferta'], 'vagas_totais_oferta': o['vagas_totais_oferta'],
            'peso_cn': o['peso_cn'], 'peso_ch': o['peso_ch'], 'peso_lc': o['peso_lc'],
            'peso_mt': o['peso_mt'], 'peso_red': o['peso_red'],
            'vagas_ac': ac['vagas_modalidade'] if ac else '',
            'corte_ac': ac['nota_corte'] if ac else None,
            'corte_lei_pcd_li': corte_lei(mods, 'LEI_PCD_LI'),
            'corte_lei_pcd_lb': corte_lei(mods, 'LEI_PCD_LB'),
            'vagas_pcd_propria': sum(int(m['vagas_modalidade'] or 0) for m in propria) if propria else '',
            'corte_pcd_propria': p['nota_corte'] if p else None,
            'diferenca_pcd_propria_para_ac': p['diferenca_para_ac'] if p else None,
            'pcd_propria_aceita_escola_privada': p['aceita_escola_privada'] if p else '',
            'pcd_propria_status': p['status_verificacao'] if p else '',
            'pcd_propria_texto': p['modalidade_texto'] if p else '',
        })
    return resumo


CAMPOS_RESUMO = ['ano', 'ies_sigla', 'ies_nome', 'uf', 'municipio', 'campus', 'turno', 'codigo_oferta',
                 'vagas_totais_oferta', 'peso_cn', 'peso_ch', 'peso_lc', 'peso_mt', 'peso_red',
                 'vagas_ac', 'corte_ac', 'corte_lei_pcd_li', 'corte_lei_pcd_lb', 'vagas_pcd_propria',
                 'corte_pcd_propria', 'diferenca_pcd_propria_para_ac', 'pcd_propria_aceita_escola_privada',
                 'pcd_propria_status', 'pcd_propria_texto']


def validar(resumo):
    coluna = {'AC': 'corte_ac', 'PCD_PROPRIA': 'corte_pcd_propria',
              'LEI_PCD_LI': 'corte_lei_pcd_li', 'LEI_PCD_LB': 'corte_lei_pcd_lb'}
    indice = {(r['ano'], r['ies_sigla'], r['municipio']): r for r in resumo}
    saida = []
    with open(os.path.join(MANUAL, 'ufs_valores_oficiais.csv'), encoding='utf-8') as f:
        for v in csv.DictReader(f):
            r = indice.get((int(v['ano']), v['ies_sigla'], v['municipio']))
            dado = r[coluna[v['tipo']]] if r else None
            oficial = float(v['valor_oficial'])
            saida.append({**v, 'valor_sisu_data': dado,
                          'diferenca': (dado - oficial) if dado is not None else None,
                          'confere': 'sim' if dado is not None and abs(dado - oficial) < 0.005 else 'nao'})
    return saida


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    os.makedirs(GERADO, exist_ok=True)
    regras = carregar_regras()
    linhas = ler_ofertas(sys.argv[1], regras)
    resumo = resumir(linhas)
    validacao = validar(resumo)

    gravar('sisu_medicina_modalidades_2020_2025.csv', CAMPOS_MODALIDADES, linhas)
    gravar('sisu_medicina_resumo_2020_2025.csv', CAMPOS_RESUMO, resumo)
    gravar('sisu_medicina_pcd_propria_2020_2025.csv', CAMPOS_MODALIDADES,
           [l for l in linhas if l['tipo_modalidade'] == 'PCD_PROPRIA'])
    gravar('validacao_ufs.csv', ['ano', 'ies_sigla', 'municipio', 'tipo', 'valor_oficial',
                                 'valor_sisu_data', 'diferenca', 'confere', 'fonte_url'], validacao)

    for ano in ANOS:
        do_ano = [r for r in resumo if r['ano'] == ano]
        com_propria = [r for r in do_ano if r['corte_pcd_propria'] is not None or r['vagas_pcd_propria']]
        aceita = [r for r in com_propria if r['pcd_propria_aceita_escola_privada'] in ('sim', 'provavel_sim')]
        print(f'{ano}: {len(do_ano)} ofertas de Medicina; {len(com_propria)} com vaga PcD própria; '
              f'{len(aceita)} dessas aceitam (ou provavelmente aceitam) escola privada')
    ok = sum(v['confere'] == 'sim' for v in validacao)
    print(f'Validação UFS: {ok}/{len(validacao)} valores conferem com as listas oficiais')
    print(f'{len(linhas)} linhas de modalidade gravadas em {GERADO}')


if __name__ == '__main__':
    main()
