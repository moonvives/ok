export const integrationSources = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    type: 'HealthKit',
    status: 'bridge-required',
    officialUrl: 'https://developer.apple.com/documentation/healthkit/',
    summary: 'Requer app iOS nativo com HealthKit, entitlement ativo e autorização granular da usuária.',
    permissions: ['passos', 'sono', 'frequência cardíaca', 'HRV', 'energia ativa', 'peso'],
    implementation: 'Este web app fica pronto para receber dados de um bridge iOS. Navegadores não têm acesso direto ao HealthKit.'
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    type: 'Garmin Health API',
    status: 'approval-required',
    officialUrl: 'https://developer.garmin.com/gc-developer-program/health-api/',
    summary: 'Requer aprovação no Garmin Connect Developer Program, OAuth e ambiente de avaliação antes de dados reais.',
    permissions: ['atividades', 'sono', 'Body Battery', 'stress', 'HRV', 'calorias', 'passos'],
    implementation: 'O app implementa importação local e estado de conexão; a sincronização real depende de credenciais Garmin aprovadas.'
  },
  {
    id: 'manual-import',
    name: 'Importação manual',
    type: 'JSON local',
    status: 'available',
    officialUrl: '#sync',
    summary: 'Permite carregar métricas diárias em JSON sem enviar dados para servidores.',
    permissions: ['sono', 'FC repouso', 'HRV', 'passos', 'minutos ativos', 'proteína'],
    implementation: 'Use para testar hoje e para conectar exports pessoais enquanto os bridges oficiais não existem.'
  }
];

export const acceptedMetricKeys = [
  'sleepHours',
  'restingHeartRate',
  'hrvMs',
  'steps',
  'activeMinutes',
  'caloriesConsumed',
  'proteinG',
  'stressLevel',
  'menstrualPhase'
];

export function normalizeMetricPayload(payload) {
  return acceptedMetricKeys.reduce((normalized, key) => {
    if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
      normalized[key] = numericWhenPossible(payload[key]);
    }
    return normalized;
  }, {});
}

export function parseMetricJson(rawText) {
  const parsed = JSON.parse(rawText);
  if (Array.isArray(parsed)) return parsed.map(normalizeMetricPayload);
  return normalizeMetricPayload(parsed);
}

export function connectionLabel(status) {
  const labels = {
    available: 'Disponível agora',
    'bridge-required': 'Requer bridge iOS',
    'approval-required': 'Requer aprovação oficial'
  };
  return labels[status] || 'Pendente';
}

function numericWhenPossible(value) {
  const number = Number(value);
  return Number.isFinite(number) && String(value).trim() !== '' ? number : value;
}
