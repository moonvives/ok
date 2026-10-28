# Medicina e vagas para pessoas com deficiência (PcD): banco de dados

Notas de corte de **todos os cursos de Medicina do SiSU de 2020 a 2025** (523 ofertas e 3.935 linhas de modalidade), mais as regras de vaga PcD de cada instituição. O foco é responder a uma pergunta: **onde existe vaga PcD de Medicina para quem estudou em escola particular, e quanto ela costuma exigir?**

Também traz os processos de 2026 e 2027 que conferi um a um, a leitura do Edital UFPI 06/2026 e uma tabela de decisões judiciais com o grau de verificação de cada uma.

Atualizado em 28/10/2026.

## Resposta curta

As cotas PcD da Lei 12.711/2012 (LB_PCD e LI_PCD) exigem **todo o ensino médio em escola pública**. Quem estudou em escola particular só pode usar vagas PcD **criadas pela própria instituição**. No SiSU 2025 havia 12 ofertas de Medicina com esse tipo de vaga:

| Instituição | Cidade | Vagas PcD próprias | Corte PcD 2025 | Corte da ampla concorrência | Diferença | Regra "aceita escola particular" |
|---|---|---|---|---|---|---|
| UEMS | Campo Grande (MS) | 1 | **815,50** | 818,14 | -2,64 | provável (verificada no edital 2026) |
| UFSC | Florianópolis (SC) | 2 | **800,96** | 820,60 | -19,64 | verificada |
| UFSC | Araranguá (SC) | 2 | **794,09** | 808,00 | -13,91 | verificada |
| FURG | Rio Grande (RS) | 4 | **789,82** | 800,86 | -11,04 | provável |
| UFSC | Curitibanos (SC) | 2 | **788,60** | sem dado | — | verificada |
| UFS | Aracaju (SE) | 1 | **785,79** | 789,39 | -3,60 | verificada |
| UFRB | Santo Antônio de Jesus (BA) | 1 | **782,46** | 787,06 | -4,60 | verificada |
| UERN | Mossoró (RN) | 4 | **779,68** | 788,66 | -8,98 | provável (verificada no edital 2026) |
| UNIPAMPA | Uruguaiana (RS) | 2 | **777,74** | 789,90 | -12,16 | verificada |
| UFRN | Natal (RN) | 1 | **775,22** | 783,96 | -8,74 | verificada |
| UFRN | Caicó (RN) | 1 | **772,78** | 779,52 | -6,74 | verificada |
| UFS | Lagarto (SE) | 1 | **767,31** | 785,03 | -17,72 | verificada |

O que a tabela mostra:
- **A vaga PcD aberta a escola particular fica de 3 a 20 pontos abaixo da ampla concorrência**, e não no nível das cotas PcD de escola pública. Em 2025, nas 73 ofertas com os dois cortes, a cota PcD de escola pública sem limite de renda ficou em mediana **54 pontos** abaixo da ampla concorrência, e a de baixa renda, **85 pontos** abaixo. A vaga aberta a escola particular atrai candidatos que estudaram especificamente para Medicina.
- Cada instituição usa **pesos diferentes**. As notas não são comparáveis entre linhas: compare cada uma com a ampla concorrência da mesma oferta. Os pesos estão em `sisu_medicina_resumo_2020_2025.csv`.
- Em 2026 as notas subiram: na UFS, a vaga PcD fechou em 803,39 em Aracaju e 788,49 em Lagarto (`data/manual/notas_2026_complementares.csv`).

## Arquivos

| Arquivo | O que contém |
|---|---|
| `data/gerado/sisu_medicina_resumo_2020_2025.csv` | **Comece por aqui.** Uma linha por oferta de Medicina e ano: pesos, vagas, corte da ampla concorrência, cortes das cotas PcD da Lei 12.711, corte da vaga PcD própria e se ela aceita escola particular |
| `data/gerado/sisu_medicina_modalidades_2020_2025.csv` | Uma linha por oferta e modalidade, com o texto oficial de cada modalidade, vagas, nota de corte, bônus, notas mínimas e a classificação |
| `data/gerado/sisu_medicina_pcd_propria_2020_2025.csv` | Só as vagas PcD criadas pelas instituições (82 linhas) |
| `data/gerado/validacao_ufs.csv` | Comparação das notas do banco com as listas oficiais da UFS: **20 de 20 conferem** |
| `data/manual/regras_pcd_proprias.csv` | A regra de escola de cada vaga PcD própria, com a base e o link da fonte |
| `data/manual/notas_2026_complementares.csv` | Notas de 2026 (UFS, UFPI, UESPI e o Edital UFPI 06/2026), marcando o que é fonte oficial e o que é jornal |
| `data/manual/editais_pcd_medicina.csv` | Processos de 2026 e 2027 com vaga PcD em Medicina: situação das inscrições, datas, nota usada e se aceitam escola particular |
| `data/manual/jurisprudencia.csv` | 26 decisões e casos, com o status de verificação de cada um |
| `docs/ufpi_edital_06_2026.md` | Leitura completa do Edital UFPI 06/2026 e do seu resultado |
| `scripts/build_sisu_medicina.py` | Gera os arquivos de `data/gerado/` |
| `scripts/ufpi_resultado_06_2026.py` | Resume o resultado da UFPI sem nomes |

### Colunas principais do resumo

| Coluna | Significado |
|---|---|
| `corte_ac` | Nota do último classificado na ampla concorrência, na chamada regular |
| `corte_lei_pcd_li` / `corte_lei_pcd_lb` | Cotas PcD da Lei 12.711 sem limite de renda e com renda baixa. **Exigem escola pública.** De 2020 a 2023 havia variantes PPI e não PPI; o banco usa a não PPI |
| `corte_pcd_propria` | Vaga PcD criada pela instituição |
| `pcd_propria_aceita_escola_privada` | `sim`, `provavel_sim`, `nao` ou `nao_verificado` |
| `pcd_propria_status` | `verificado` (texto oficial ou edital lido), `provavel` (regra lida em outro ano ou em página institucional) ou `nao_verificado` |

### Tipos de modalidade (`tipo_modalidade`)

| Tipo | Significado |
|---|---|
| `AC` | Ampla concorrência |
| `LEI_PCD_LI`, `LEI_PCD_LB` | Cotas PcD da Lei 12.711 (escola pública) |
| `LEI_OUTRA` | Demais cotas da Lei 12.711 |
| `PCD_PROPRIA` | Vaga PcD criada pela instituição |
| `BONUS` | Modalidade de bônus regional (o bônus aparece em `bonus_percentual`) |
| `OUTRA_PROPRIA` | Outras ações afirmativas próprias |

## Como os dados foram obtidos

1. **Fonte das notas de 2020 a 2025:** o repositório público [gabekanegae/sisu-data](https://github.com/gabekanegae/sisu-data) (licença MIT, commit `308fe33`). Ele reúne o que a API do SiSU publicou ao fim de cada chamada regular. Os dados abertos do MEC (dadosabertos.mec.gov.br e a API do SiSU) **recusaram o acesso desta sessão** (erro 403 e verificação anti-robô), por isso não foram usados.
2. **Validação:** conferi 20 notas do banco contra as listas oficiais de aprovados da UFS de 2023 a 2025 (ampla concorrência, vaga PcD própria e cotas PcD). **As 20 batem exatamente.**
3. **Classificação:** o script lê o texto oficial de cada modalidade. Uma vaga PcD é marcada como aberta a escola particular quando o texto diz isso ("qualquer que seja a sua procedência escolar", "oriundos de qualquer percurso escolar", "rede de ensino privada ou pública"). Quando o texto não diz, vale a regra de `data/manual/regras_pcd_proprias.csv`, lida no edital, na resolução ou na página da instituição.
4. **2026:** o repositório não tem 2026. As notas de 2026 vêm das listas oficiais da UFS, do resultado oficial do Edital UFPI 06/2026 e, para UFPI e UESPI no SiSU, de uma tabela do jornal O Tempo, marcada como fonte secundária.

## Limites

- **A nota de corte não é a nota do último aprovado depois da lista de espera.** É o corte da chamada regular. Na lista de espera a ampla concorrência costuma descer alguns pontos.
- **Bônus regional:** em várias instituições (por exemplo UFAC, UFMA, UFRN até 2024, UERN até 2024, UFPB, UNIVASF e UPE) o corte da ampla concorrência inclui o bônus de quem estudou na região. Nessas linhas a diferença para a vaga PcD parece maior do que é.
- **Regras "prováveis" precisam ser confirmadas** no termo de adesão de 2027, que sai em dezembro de 2026. Uma instituição pode mudar a regra de um ano para o outro.
- Nem toda vaga PcD própria tem a regra de escola confirmada: UFAC, UNIMONTES, UEMG, UEFS (2022-2023), UNEMAT (2020-2021) e UFRB (2020-2023) ficaram como `nao_verificado`.
- O banco cobre só Medicina no SiSU. Vestibulares próprios (UFSM, UEPA, UFPR, Unicamp, UEL, UERJ) estão em `editais_pcd_medicina.csv`, sem série histórica.
- A condição de deficiência é sempre analisada por banca ou perícia de cada instituição. Este banco não diz se alguém se enquadra.
- A tabela de jurisprudência é um levantamento de informação pública, **não é parecer jurídico**. Os casos marcados `nao_localizado` vieram de um texto de outra ferramenta e não devem ser citados sem o número completo e o inteiro teor.

## Privacidade

Nenhum arquivo deste repositório traz nome, CPF ou número de inscrição de candidatos. Listas oficiais com nomes foram lidas apenas para calcular notas agregadas.

## Como reproduzir

```bash
git clone https://github.com/gabekanegae/sisu-data.git   # use GIT_LFS_SKIP_SMUDGE=1 se não precisar dos arquivos grandes
python3 scripts/build_sisu_medicina.py sisu-data/data
```

O script usa só a biblioteca padrão do Python 3 e imprime a contagem por ano e o resultado da validação.

## Licença dos dados de terceiros

As notas de 2020 a 2025 derivam do repositório sisu-data, Copyright (c) 2022 Gabriel Kanegae, sob licença MIT (texto completo em `data/gerado/LICENSE-sisu-data.txt`). O próprio sisu-data avisa que os dados vêm de fontes oficiais do MEC mas não têm caráter oficial.
