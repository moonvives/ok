# Sara Fit 54

Aplicativo web estático em português para acompanhar um plano disciplinado de emagrecimento saudável até 54 kg, usando os dados corporais informados no exame InBody.

## O que o app inclui

- Diagnóstico corporal individualizado com IMC, gordura corporal, gordura visceral, TMB e meta de peso.
- Plano alimentar rígido com calorias, macros, cardápio por blocos, lista de compras e regras inegociáveis.
- Treino semanal para perda de gordura com preservação de massa magra.
- Central biométrica inspirada em Bevel, WHOOP e Oura, com readiness, strain, recomendação diária e importação local de métricas.
- Área de sincronização preparada para Apple Health/HealthKit e Garmin Connect Health API, respeitando permissões oficiais.
- Checklist diário e registro de peso salvos no `localStorage` do navegador.
- Biblioteca científica com PubMed, PubMed Central, BMJ, CDC, NIH, Apple Developer e Garmin Developers.

## Executar

```bash
npm run start
```

Abra `http://localhost:5173`.

## Link para abrir

Depois de rodar `npm run start`, use:

- No mesmo computador: `http://localhost:5173`
- No iPad Pro/Safari: use o link com IP que aparece no terminal, por exemplo `http://192.168.0.23:5173`
- Se nenhum link abrir: rode `npm run offline` e envie o arquivo `dist/sara-fit-54-standalone.html` para o iPad.

O iPad precisa estar na mesma rede Wi-Fi do computador para abrir por IP. Se a rede bloquear, use o arquivo standalone. Veja `docs/access-ipad.md` para o passo a passo completo.

## Testar e gerar build

```bash
npm test
npm run build
```

## Lovable

Para fazer a versão hospedada no Lovable, use o pacote em `lovable/`:

- `lovable/prompt.md`: prompt completo para colar no Lovable.
- `lovable/design-system.md`: direção visual premium.
- `lovable/data-model.json`: dados fixos da Sara e chaves de métricas.
- `lovable/supabase-schema.sql`: schema opcional se quiser login/cloud; para uso exclusivo, localStorage continua suficiente.

## Integrações

Leia `docs/integrations.md` para detalhes sobre Apple Health, Garmin e o formato JSON de importação local. O app não usa Sci-Hub nem cópias não autorizadas de artigos pagos.
