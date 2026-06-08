# Integrações biométricas oficiais

Este projeto é um web app estático. Ele não consegue ler diretamente Apple Health/HealthKit pelo navegador e não pode acessar Garmin Connect sem aprovação oficial. O app foi evoluído para ter uma central biométrica pronta para receber dados legalmente, com importação local em JSON e contratos de métricas.

## Apple Health / HealthKit

Para sincronização real com Apple Health, é necessário criar um app iOS nativo ou um bridge iOS que:

1. ative a capability HealthKit no Xcode;
2. solicite permissão explícita da usuária para cada tipo de dado;
3. leia métricas como passos, sono, frequência cardíaca, HRV, energia ativa e peso;
4. envie somente os dados autorizados para este app ou mantenha tudo localmente.

Referência oficial: https://developer.apple.com/documentation/healthkit/

## Garmin Connect Health API

Para sincronização real com Garmin, é necessário:

1. solicitar acesso ao Garmin Connect Developer Program;
2. obter aprovação para o Health API;
3. configurar OAuth e ambiente de avaliação;
4. consumir endpoints aprovados para atividades, sono, passos, HRV, stress e calorias.

Referência oficial: https://developer.garmin.com/gc-developer-program/health-api/

## Formato de importação local

Enquanto as credenciais oficiais não estiverem disponíveis, use o painel de importação local com JSON:

```json
{
  "sleepHours": 7.8,
  "restingHeartRate": 62,
  "hrvMs": 52,
  "steps": 10300,
  "activeMinutes": 48,
  "caloriesConsumed": 1450,
  "proteinG": 122,
  "stressLevel": 2,
  "menstrualPhase": "não informado"
}
```

## Observação legal e científica

O app não usa Sci-Hub nem cópias não autorizadas de artigos pagos. A biblioteca científica prioriza PubMed, PubMed Central, BMJ e documentação oficial disponível legalmente.
