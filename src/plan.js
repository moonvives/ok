export const profile = {
  name: 'Sara Ruth',
  heightCm: 164,
  age: 23,
  sex: 'Feminino',
  currentWeightKg: 73.3,
  targetWeightKg: 54,
  bodyFatPercent: 44,
  fatMassKg: 32.2,
  skeletalMuscleKg: 22.1,
  waistHipRatio: 0.94,
  visceralFatLevel: 17,
  bmrKcal: 1257,
  inbodyRecommendedKcal: 1797,
  inbodyDate: '03/01/2025'
};

export const evidenceNotes = [
  'Ritmo seguro: priorize perda gradual de 0,45 a 0,9 kg por semana; o app usa meta média de 0,6 kg/semana.',
  'Exercício: combine déficit calórico com atividade física; o alvo mínimo semanal é 150 minutos moderados + 2 treinos de força.',
  'Proteína e treino de força são tratados como prioridade para preservar massa magra durante o déficit calórico.',
  'Sci-Hub e cópias não autorizadas de artigos pagos não são usados: a base científica abaixo prioriza PubMed, PMC, BMJ e fontes oficiais acessíveis legalmente.',
  'Segurança: o app não substitui nutricionista ou médico, especialmente com gordura visceral elevada, alterações menstruais, tontura, compulsão ou histórico clínico.'
];

export const researchLibrary = [
  {
    label: 'CDC — emagrecimento gradual e manutenção',
    url: 'https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html',
    takeaway: 'Perda gradual melhora a chance de manutenção e reduz decisões extremas.'
  },
  {
    label: 'CDC — atividade física e controle de peso',
    url: 'https://www.cdc.gov/healthy-weight-growth/physical-activity/index.html',
    takeaway: 'Atividade física deve caminhar junto com alimentação para controle de peso.'
  },
  {
    label: 'NIH/NIDDK — Body Weight Planner',
    url: 'https://www.niddk.nih.gov/bwp',
    takeaway: 'Planejamento de peso precisa considerar adaptação metabólica e evolução real.'
  },
  {
    label: 'PubMed — exercício e gordura visceral em sobrepeso/obesidade',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38031812/',
    takeaway: 'Aeróbio vigoroso e HIIT aparecem com alta probabilidade de reduzir gordura visceral quando bem tolerados.'
  },
  {
    label: 'PubMed — exercício, restrição calórica e gordura visceral',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36669870/',
    takeaway: 'Há relação dose-resposta entre exercício e redução de gordura visceral em adultos com sobrepeso/obesidade.'
  },
  {
    label: 'PubMed — treino resistido em sobrepeso/obesidade',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35191588/',
    takeaway: 'Treino resistido ajuda a aumentar ou preservar massa magra em intervenções de perda de peso.'
  },
  {
    label: 'PubMed — whey protein e composição corporal em mulheres',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29688559/',
    takeaway: 'Suplementação proteica pode apoiar mudanças de composição corporal quando combinada com dieta e treino.'
  },

  {
    label: 'PubMed — proteína elevada para preservar massa em sobrepeso/obesidade',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39002131/',
    takeaway: 'Meta-análise reforça proteína adequada durante perda de peso para reduzir risco de perda de massa magra.'
  },
  {
    label: 'PubMed — intervenções nutricionais e exercício em sobrepeso/obesidade',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39278737/',
    takeaway: 'Intervenções com proteína alta e exercício tendem a ser mais promissoras que restrição energética isolada.'
  },
  {
    label: 'PMC — ingestão energética ao longo do ciclo menstrual',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10251302/',
    takeaway: 'Fome e ingestão podem variar por fase do ciclo; o app permite ajuste controlado em fase lútea/TPM.'
  },
  {
    label: 'PMC — ciclo menstrual e ingestão energética, revisão sistemática',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11819481/',
    takeaway: 'A personalização feminina deve considerar ciclo, fome e adesão, sem transformar isso em licença para abandonar o plano.'
  },
  {
    label: 'ACSM — diretrizes atualizadas de treino resistido',
    url: 'https://acsm.org/resistance-training-guidelines-update-2026/',
    takeaway: 'Progressão de treino resistido é parte central para força, massa magra e saúde.'
  },
  {
    label: 'BMJ Open Sport & Exercise Medicine — resistência durante dieta',
    url: 'https://bmjopensem.bmj.com/content/11/3/e002363',
    takeaway: 'Evidência recente reforça treino resistido como parte de estratégias de perda de peso com saúde cardiometabólica.'
  },
  {
    label: 'PMC — validação de Apple Watch, Garmin, Oura e WHOOP',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9412437/',
    takeaway: 'Wearables são úteis para tendências de sono/FC/HRV, mas não devem ser tratados como diagnóstico.'
  },
  {
    label: 'PubMed — validação de wearables contra polissonografia',
    url: 'https://pubmed.ncbi.nlm.nih.gov/40303381/',
    takeaway: 'Dados de sono de dispositivos de consumo devem ser usados como sinais de tendência, não como exame clínico.'
  },
  {
    label: 'Apple Developer — HealthKit',
    url: 'https://developer.apple.com/documentation/healthkit/',
    takeaway: 'Acesso ao Apple Health exige app iOS com HealthKit e permissão explícita da usuária.'
  },
  {
    label: 'Garmin Developers — Health API',
    url: 'https://developer.garmin.com/gc-developer-program/health-api/',
    takeaway: 'Acesso oficial ao Garmin Connect Health API exige aprovação e ambiente de avaliação.'
  }
];

export const meals = [
  {
    id: 'cafe',
    label: 'Café da manhã',
    target: '300–340 kcal | 25–32 g proteína',
    options: [
      '2 ovos + 1 fatia de pão integral + 1 fruta pequena + café sem açúcar',
      'Iogurte grego natural + 25 g aveia + morangos + 10 g chia',
      'Omelete com 2 ovos, tomate e espinafre + 1 tangerina'
    ]
  },
  {
    id: 'lanche1',
    label: 'Lanche da manhã',
    target: '120–170 kcal | 10–18 g proteína',
    options: [
      '1 whey/ proteína em água ou 170 g iogurte natural',
      '1 maçã + 10 g pasta de amendoim',
      'Queijo cottage + pepino ou cenoura'
    ]
  },
  {
    id: 'almoco',
    label: 'Almoço',
    target: '420–480 kcal | 35–45 g proteína',
    options: [
      '120 g frango grelhado + 80 g arroz integral + feijão + salada grande',
      '120 g peixe + batata-doce + legumes + 1 fio pequeno de azeite',
      'Patinho moído magro + quinoa + brócolis + salada crua'
    ]
  },
  {
    id: 'lanche2',
    label: 'Lanche da tarde',
    target: '150–220 kcal | 15–25 g proteína',
    options: [
      'Iogurte proteico + fruta vermelha',
      '2 ovos cozidos + chá sem açúcar',
      'Atum em água + torrada integral'
    ]
  },
  {
    id: 'jantar',
    label: 'Jantar',
    target: '360–430 kcal | 35–45 g proteína',
    options: [
      '120 g frango/peixe + legumes salteados + salada + 60 g carboidrato cozido',
      'Omelete de claras e 1 ovo + salada + abóbora cozida',
      'Tofu ou frango desfiado + legumes + feijão em porção controlada'
    ]
  },
  {
    id: 'ceia',
    label: 'Ceia opcional',
    target: '0–120 kcal | use só se houver fome real',
    options: [
      'Chá + gelatina sem açúcar',
      '100 g iogurte natural',
      'Caseína/proteína leve em água'
    ]
  }
];

export const trainingWeek = [
  { day: 'Segunda', focus: 'Força A + caminhada', detail: 'Inferiores e core por 45 min + 25 min caminhada zona 2.' },
  { day: 'Terça', focus: 'Cardio disciplinado', detail: '40 min caminhada rápida, bike ou elíptico; finalize com mobilidade.' },
  { day: 'Quarta', focus: 'Força B', detail: 'Superiores, glúteos e postura por 50 min; 8–10 mil passos.' },
  { day: 'Quinta', focus: 'Cardio + recuperação', detail: '30 min moderado + alongamento; sono acima de 7 h.' },
  { day: 'Sexta', focus: 'Força C', detail: 'Treino completo com progressão de carga; proteína em todas as refeições.' },
  { day: 'Sábado', focus: 'Atividade prazerosa', detail: '60 min caminhada, dança, trilha ou natação sem compensar com comida.' },
  { day: 'Domingo', focus: 'Planejamento', detail: 'Preparar marmitas, pesar 1 vez, revisar aderência e ajustar compras.' }
];

export const recoveryDefaults = {
  sleepHours: 7.4,
  restingHeartRate: 64,
  hrvMs: 48,
  steps: 9200,
  activeMinutes: 42,
  caloriesConsumed: 1450,
  proteinG: 121,
  stressLevel: 2,
  menstrualPhase: 'não informado'
};

export function bmi(weightKg = profile.currentWeightKg, heightCm = profile.heightCm) {
  return weightKg / Math.pow(heightCm / 100, 2);
}

export function kgToLose(current = profile.currentWeightKg, target = profile.targetWeightKg) {
  return Math.max(0, Number((current - target).toFixed(1)));
}

export function estimatedWeeksToGoal(lossPerWeekKg = 0.6) {
  return Math.ceil(kgToLose() / lossPerWeekKg);
}

export function macroTargets(weightKg = profile.currentWeightKg) {
  const calories = 1450;
  const protein = Math.round(Math.min(130, Math.max(105, weightKg * 1.65)));
  const fat = 45;
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat, fiber: 28, waterLiters: 2.4 };
}

export function weeklyMilestones(startWeight = profile.currentWeightKg, targetWeight = profile.targetWeightKg, lossPerWeekKg = 0.6) {
  const weeks = Math.ceil((startWeight - targetWeight) / lossPerWeekKg);
  return Array.from({ length: weeks }, (_, index) => {
    const week = index + 1;
    return {
      week,
      weight: Math.max(targetWeight, Number((startWeight - week * lossPerWeekKg).toFixed(1)))
    };
  });
}

export function adherenceScore(checks) {
  const values = Object.values(checks).filter((value) => typeof value === 'boolean');
  if (!values.length) return 0;
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

export function readinessScore(metrics = recoveryDefaults) {
  const sleep = clamp((metrics.sleepHours / 8) * 35, 0, 35);
  const hrv = clamp((metrics.hrvMs / 55) * 25, 0, 25);
  const rhr = clamp(((75 - metrics.restingHeartRate) / 20) * 15, 0, 15);
  const stress = clamp(((5 - metrics.stressLevel) / 5) * 10, 0, 10);
  const nutrition = clamp((metrics.proteinG / macroTargets().protein) * 15, 0, 15);
  return Math.round(sleep + hrv + rhr + stress + nutrition);
}

export function strainScore(metrics = recoveryDefaults) {
  const stepScore = clamp(metrics.steps / 1000, 0, 12);
  const activeScore = clamp(metrics.activeMinutes / 8, 0, 8);
  return Number(Math.min(20, stepScore + activeScore).toFixed(1));
}

export function dailyRecommendation(metrics = recoveryDefaults) {
  const readiness = readinessScore(metrics);
  const strain = strainScore(metrics);
  if (readiness < 55) return { readiness, strain, action: 'Recuperação ativa: caminhada leve, sono cedo e sem HIIT hoje.' };
  if (readiness > 78 && strain < 14) return { readiness, strain, action: 'Dia bom para treino forte: força progressiva ou cardio vigoroso planejado.' };
  return { readiness, strain, action: 'Execução normal: cumpra treino, proteína, passos e déficit sem exageros.' };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
