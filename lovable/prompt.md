# Prompt Lovable — Sara Fit 54, versão extremamente refinada

Cole este prompt no Lovable para gerar uma versão hospedada, responsiva e com cara de produto premium.

## Objetivo

Crie um aplicativo privado chamado **Sara Fit 54** para uso exclusivo de Sara Ruth. O app deve funcionar como um coach pessoal extremamente disciplinado de emagrecimento saudável, composição corporal, rotina alimentar, treino, recuperação e biometria. A experiência deve parecer uma mistura premium de Bevel, WHOOP, Oura e um planner nutricional clínico, mas em português do Brasil e com tom firme, humano e direto.

## Perfil fixo da usuária

- Nome: Sara Ruth
- Sexo: feminino
- Idade: 23 anos
- Altura: 164 cm
- Peso atual: 73,3 kg
- Meta: 54 kg
- Gordura corporal: 44,0%
- Massa de gordura: 32,2 kg
- Massa muscular esquelética: 22,1 kg
- Relação cintura-quadril: 0,94
- Gordura visceral: nível 17
- Taxa metabólica basal: 1257 kcal
- Ingestão recomendada InBody: 1797 kcal
- Data do exame InBody: 03/01/2025

## Posicionamento

O app é local-first/private-first. Só Sara usa. Não criar fluxo público genérico. Não vender como diagnóstico médico. O app deve ter avisos claros para procurar nutricionista/médico se houver tontura, compulsão, amenorreia, dor no peito, fadiga severa ou perda de peso acelerada demais.

## Estética

- Visual premium, feminino adulto, sério e sofisticado.
- Nada infantil, nada genérico de academia.
- Paleta: creme quente, vinho/terracota, grafite, verde de sucesso e dourado discreto.
- Cards grandes com bordas arredondadas, sombras suaves e hierarquia forte.
- Dashboard inicial com readiness, strain, peso atual, meta, perda restante e ação do dia.
- Deve funcionar perfeitamente no iPad Pro 12.9 e Safari.

## Telas obrigatórias

1. **Dashboard de hoje**
   - Readiness, strain, sono, HRV, passos, proteína e calorias.
   - Ação do dia: treino forte, execução normal ou recuperação ativa.
   - Plano gerado do dia com calorias, proteína, prioridade e checagem de platô.

2. **Corpo e meta 54 kg**
   - Diagnóstico InBody traduzido em ação.
   - IMC atual e IMC na meta.
   - Perda total necessária.
   - Linha do tempo de 33 semanas com checkpoints.
   - Indicadores de risco: gordura visceral, cintura-quadril e gordura corporal.

3. **Nutrição rígida**
   - Meta base: 1450 kcal/dia.
   - Proteína: 105–130 g/dia, padrão 121 g.
   - Gordura: 45 g/dia.
   - Carboidratos calculados automaticamente.
   - Fibra: 28 g+.
   - Água: 2,4 L+.
   - Cardápio por blocos: café, lanche manhã, almoço, lanche tarde, jantar, ceia opcional.
   - Trocas equivalentes sem bagunçar macros.
   - Receitas de emergência e anti-compulsão.

4. **Treino e progressão**
   - Semana com 3 treinos de força, 2 cardios e 1 atividade prazerosa.
   - Treinos detalhados de segunda, quarta e sexta.
   - Campo para marcar carga, séries concluídas e percepção de esforço.
   - Regra: preservar massa magra é prioridade, cardio não substitui força por mais de 7 dias.

5. **Rotina operacional**
   - Timeline do dia: acordar, café, lanches, almoço, treino, jantar, preparação e sono.
   - Checklist diário de execução.
   - Pontuação de aderência.

6. **Protocolos anti-desvio**
   - Vontade intensa de doce.
   - TPM/fase lútea com fome alta.
   - Restaurante.
   - Platô de 14 dias.
   - Dia de sono ruim.
   - Falha no plano.

7. **Biometria estilo Bevel/WHOOP/Oura**
   - Importação local de JSON com sleepHours, restingHeartRate, hrvMs, steps, activeMinutes, caloriesConsumed, proteinG, stressLevel, menstrualPhase.
   - Readiness calculado por sono, HRV, FC repouso, stress e proteína.
   - Strain calculado por passos e minutos ativos.
   - Recomendação adaptativa.

8. **Apple Health e Garmin**
   - Mostrar cards de integração preparada.
   - Apple Health: explicar que precisa de app iOS/HealthKit e permissão da usuária.
   - Garmin: explicar que precisa Garmin Health API, OAuth e aprovação.
   - Não fingir acesso real se não houver credenciais.

9. **Biblioteca científica legal**
   - Links para CDC, NIH/NIDDK, PubMed, PMC, BMJ, ACSM, Apple Developer e Garmin Developers.
   - Não usar Sci-Hub nem cópias não autorizadas de artigos pagos.

## Regras de cálculo

- IMC = peso / altura².
- Perda necessária = peso atual - 54.
- Ritmo alvo = 0,6 kg/semana.
- Prazo estimado = ceil(perda necessária / 0,6).
- Calorias base = 1450 kcal.
- Proteína = clamp(peso * 1,65, 105, 130).
- Gordura = 45 g.
- Carboidratos = (calorias - proteína*4 - gordura*9) / 4.
- Readiness:
  - sono até 35 pontos;
  - HRV até 25;
  - FC repouso até 15;
  - stress até 10;
  - proteína até 15.
- Strain = passos/1000 até 12 + minutos ativos/8 até 8, máximo 20.
- Se readiness < 55: recuperação ativa.
- Se readiness > 78 e strain < 14: treino forte.
- Caso contrário: execução normal.

## Fases

1. Fundação metabólica, semanas 1–4, 1450 kcal.
2. Perda consistente, semanas 5–16, 1400–1500 kcal.
3. Pausa estratégica, semanas 17–18, 1600–1750 kcal.
4. Acabamento até 54 kg, semanas 19–33, 1400–1500 kcal.
5. Manutenção reversa após 54 kg, +80 a +120 kcal a cada 10–14 dias.

## Persistência

Se não usar backend, salvar em localStorage. Se usar Supabase, criar tabelas privadas por usuário e não expor dados publicamente.

## Entrega esperada

Gerar app completo, responsivo, refinado, com navegação por seções, cards premium, dados fixos da Sara, importação JSON, registros de peso, checklist, gráficos simples de evolução e modo offline-friendly.
