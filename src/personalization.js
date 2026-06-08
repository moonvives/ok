import { macroTargets, profile, recoveryDefaults, readinessScore, strainScore } from './plan.js';

export const saraOnlyMode = {
  owner: profile.name,
  privacy: 'single-user-local-first',
  dataPolicy: 'Sem login, sem nuvem e sem compartilhamento: checklist, peso e métricas ficam no localStorage deste navegador.',
  nonNegotiables: [
    'Não reduzir abaixo de 1350 kcal sem nutricionista.',
    'Não trocar treino de força por apenas cardio por mais de 7 dias.',
    'Não compensar deslize com jejum extremo no dia seguinte.',
    'Não pesar mais de 2 vezes por semana para evitar punição por retenção hídrica.',
    'Não ignorar tontura, amenorreia, compulsão, dor no peito ou falta de ar.'
  ]
};

export const phasePlan = [
  {
    id: 'foundation',
    title: 'Fase 1: fundação metabólica',
    weeks: '1–4',
    calories: '1450 kcal',
    focus: 'regular horários, bater proteína, treinar força sem falhar e retirar beliscos líquidos/calóricos.',
    successMetric: 'aderência semanal acima de 80% antes de apertar o déficit.'
  },
  {
    id: 'fat-loss',
    title: 'Fase 2: perda de gordura consistente',
    weeks: '5–16',
    calories: '1400–1500 kcal conforme readiness e ciclo',
    focus: 'redução de gordura visceral com 3 forças, 2 cardios e passos diários.',
    successMetric: 'média de 0,45–0,75 kg por semana sem queda relevante de força.'
  },
  {
    id: 'diet-break',
    title: 'Fase 3: pausa estratégica',
    weeks: '17–18',
    calories: '1600–1750 kcal com comida limpa',
    focus: 'reduzir fadiga, estabilizar fome, sono e treino sem abandonar disciplina.',
    successMetric: 'peso estável, sem compulsão, força e sono melhores.'
  },
  {
    id: 'final-cut',
    title: 'Fase 4: acabamento até 54 kg',
    weeks: '19–33',
    calories: '1400–1500 kcal, ajuste semanal por tendência',
    focus: 'perder o restante com precisão, proteína alta e treino progressivo.',
    successMetric: 'chegar a 54 kg com rotina sustentável e massa magra preservada.'
  },
  {
    id: 'maintenance',
    title: 'Fase 5: manutenção reversa',
    weeks: 'após 54 kg',
    calories: '+80 a +120 kcal a cada 10–14 dias',
    focus: 'aumentar calorias sem recuperar gordura rapidamente.',
    successMetric: 'manter 54–56 kg por 90 dias.'
  }
];

export const dailySchedule = [
  ['06:30', 'Acordar, água, luz natural e registrar sono/FC/HRV se houver wearable.'],
  ['07:00', 'Café da manhã com proteína antes de qualquer tarefa longa.'],
  ['10:30', 'Lanche planejado ou chá se não houver fome real.'],
  ['12:30', 'Almoço com prato base: proteína, legumes, carboidrato medido e gordura medida.'],
  ['15:30', 'Lanche proteico para blindar compulsão no fim da tarde.'],
  ['18:30', 'Treino ou caminhada; se readiness baixo, recuperação ativa.'],
  ['20:00', 'Jantar leve, alto em proteína e volume vegetal.'],
  ['21:30', 'Preparar comida/roupa do dia seguinte e desligar telas fortes.'],
  ['22:30', 'Sono: prioridade estética, metabólica e de controle de fome.']
];

export const recipeMatrix = [
  {
    name: 'Bowl anti-compulsão de frango',
    kcal: 455,
    protein: 43,
    ingredients: ['120 g frango', '80 g arroz integral', '70 g feijão', 'salada grande', '5 g azeite'],
    useWhen: 'almoço padrão de treino ou dia de muita fome.'
  },
  {
    name: 'Jantar seco de peixe e legumes',
    kcal: 385,
    protein: 39,
    ingredients: ['130 g tilápia ou salmão magro', 'abobrinha', 'brócolis', '60 g batata', 'limão'],
    useWhen: 'noite com necessidade de déficit mais limpo.'
  },
  {
    name: 'Creme proteico doce controlado',
    kcal: 210,
    protein: 25,
    ingredients: ['170 g iogurte grego', '10 g chia', 'morango', 'canela'],
    useWhen: 'vontade de doce sem sair do plano.'
  },
  {
    name: 'Omelete de emergência',
    kcal: 330,
    protein: 31,
    ingredients: ['2 ovos', '120 g claras', 'tomate', 'espinafre', '1 fruta pequena'],
    useWhen: 'dia corrido sem marmita.'
  }
];

export const swapRules = [
  ['120 g frango', '120 g peixe, 110 g patinho magro, 2 ovos + 120 g claras ou 150 g tofu firme'],
  ['80 g arroz cozido', '100 g batata, 90 g mandioca, 80 g quinoa ou 1 pão integral pequeno'],
  ['feijão', 'lentilha, grão-de-bico medido ou ervilha'],
  ['sobremesa', 'iogurte proteico, gelatina sem açúcar ou fruta com canela'],
  ['fritura', 'air fryer, grelhado, assado ou cozido com azeite medido']
];

export const workoutLibrary = {
  Segunda: [
    ['Agachamento ou leg press', '4 séries de 8–10 repetições'],
    ['Stiff romeno', '3 séries de 8–10 repetições'],
    ['Cadeira extensora', '3 séries de 10–12 repetições'],
    ['Mesa flexora', '3 séries de 10–12 repetições'],
    ['Prancha', '3 séries de 35–45 segundos']
  ],
  Quarta: [
    ['Puxada alta', '4 séries de 8–10 repetições'],
    ['Remada baixa', '3 séries de 10–12 repetições'],
    ['Supino halter', '3 séries de 8–10 repetições'],
    ['Desenvolvimento ombro', '3 séries de 10 repetições'],
    ['Rosca + tríceps corda', '2 séries de 12–15 repetições cada']
  ],
  Sexta: [
    ['Hip thrust', '4 séries de 8–10 repetições'],
    ['Afundo ou passada', '3 séries de 10 repetições por perna'],
    ['Remada unilateral', '3 séries de 10 repetições'],
    ['Flexão inclinada', '3 séries até 2 repetições antes da falha'],
    ['Abdominal dead bug', '3 séries de 10 por lado']
  ]
};

export const crisisProtocols = [
  {
    trigger: 'Vontade intensa de doce',
    action: 'Beber água, esperar 10 minutos, comer creme proteico doce controlado e registrar no checklist.',
    forbidden: 'comprar doce grande ou transformar uma vontade em refeição livre.'
  },
  {
    trigger: 'TPM ou fase lútea com fome alta',
    action: 'Subir 80–120 kcal com carboidrato limpo, manter proteína e aumentar volume de legumes.',
    forbidden: 'zerar carboidrato ou usar culpa como estratégia.'
  },
  {
    trigger: 'Restaurante',
    action: 'Escolher proteína grelhada, legumes/salada, uma porção de carboidrato e molho separado.',
    forbidden: 'entrada frita, bebida calórica e sobremesa no mesmo evento.'
  },
  {
    trigger: 'Platô de 14 dias',
    action: 'Auditar porções, sono, passos e ciclo; ajustar apenas 80–100 kcal ou 1500 passos por 7 dias.',
    forbidden: 'cortar calorias agressivamente sem conferir aderência.'
  }
];

export function currentPhaseForWeek(week) {
  if (week <= 4) return phasePlan[0];
  if (week <= 16) return phasePlan[1];
  if (week <= 18) return phasePlan[2];
  if (week <= 33) return phasePlan[3];
  return phasePlan[4];
}

export function calorieTargetForDay({ metrics = recoveryDefaults, cyclePhase = 'não informado', trainingDay = true } = {}) {
  const base = macroTargets().calories;
  const readiness = readinessScore(metrics);
  const lutealBump = ['lútea', 'tpm', 'pré-menstrual'].includes(String(cyclePhase).toLowerCase()) ? 100 : 0;
  const trainingBump = trainingDay && readiness > 78 ? 50 : 0;
  const recoveryCut = readiness < 50 ? -50 : 0;
  return Math.min(1600, Math.max(1350, base + lutealBump + trainingBump + recoveryCut));
}

export function detectPlateau(logs = []) {
  const valid = logs
    .map((entry) => ({ ...entry, weight: Number(entry.weight) }))
    .filter((entry) => Number.isFinite(entry.weight))
    .slice(0, 4);
  if (valid.length < 3) return { plateau: false, reason: 'precisa de pelo menos 3 registros recentes.' };
  const newest = valid[0].weight;
  const oldest = valid[valid.length - 1].weight;
  const change = Number((oldest - newest).toFixed(1));
  return change < 0.3
    ? { plateau: true, reason: `queda de apenas ${change} kg nos registros recentes.` }
    : { plateau: false, reason: `queda recente de ${change} kg, continue executando.` };
}

export function buildTodayPlan({ dayName = 'Segunda', metrics = recoveryDefaults, cyclePhase = 'não informado', logs = [] } = {}) {
  const training = workoutLibrary[dayName] || [];
  const targetCalories = calorieTargetForDay({ metrics, cyclePhase, trainingDay: training.length > 0 });
  const plateau = detectPlateau(logs);
  const readiness = readinessScore(metrics);
  const strain = strainScore(metrics);
  return {
    dayName,
    targetCalories,
    protein: macroTargets().protein,
    readiness,
    strain,
    workout: training,
    phase: currentPhaseForWeek(1),
    plateau,
    priority: readiness < 55 ? 'recuperação e aderência alimentar' : training.length ? 'treino de força com progressão' : 'passos, mobilidade e preparo de refeições'
  };
}
