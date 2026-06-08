import './styles.css';
import { connectionLabel, integrationSources, parseMetricJson } from './integrations.js';
import {
  buildTodayPlan,
  crisisProtocols,
  dailySchedule,
  phasePlan,
  recipeMatrix,
  saraOnlyMode,
  swapRules,
  workoutLibrary,
  refinementBacklog,
  lovableHandoff
} from './personalization.js';
import {
  adherenceScore,
  bmi,
  estimatedWeeksToGoal,
  dailyRecommendation,
  evidenceNotes,
  kgToLose,
  macroTargets,
  meals,
  profile,
  readinessScore,
  recoveryDefaults,
  researchLibrary,
  strainScore,
  trainingWeek,
  weeklyMilestones
} from './plan.js';

const macros = macroTargets();
const milestones = weeklyMilestones();
const totalLoss = kgToLose();
const targetBmi = bmi(profile.targetWeightKg).toFixed(1);
const progressToTarget = Math.round(((profile.currentWeightKg - kgToLose()) / profile.currentWeightKg) * 100);
const strictRules = [
  ['Calorias diárias', `${macros.calories} kcal, com margem máxima de +100 kcal`],
  ['Proteína', `${macros.protein} g/dia para preservar massa magra`],
  ['Carboidratos', `${macros.carbs} g/dia, priorizando arroz, feijão, aveia, frutas e tubérculos`],
  ['Gorduras', `${macros.fat} g/dia, sem frituras no ciclo de corte`],
  ['Água', `${macros.waterLiters} L/dia + 500 ml em treino intenso`],
  ['Pesagem', '1 vez por semana, domingo ao acordar; não punir oscilações diárias'],
  ['Sono', '7–9 horas; sem tela nos 30 min antes de dormir'],
  ['Refeição livre', '1 refeição planejada por semana, sem virar “dia livre”']
];
const dailyChecks = [
  ['calories', 'Fiquei dentro da meta calórica'],
  ['protein', 'Bati a proteína do dia'],
  ['water', 'Bebi a meta de água'],
  ['steps', 'Completei 8–10 mil passos ou cardio'],
  ['strength', 'Fiz treino de força quando previsto'],
  ['sleep', 'Dormirei pelo menos 7 horas'],
  ['noSugar', 'Não comi açúcar/fritura fora do planejado']
];
const syncedMetrics = loadSyncedMetrics();
const recommendation = dailyRecommendation(syncedMetrics);
const todayPlan = buildTodayPlan({ metrics: syncedMetrics });

function render() {
  document.querySelector('#app').innerHTML = `
    <div class="app-shell">
      <section class="hero">
        <div class="hero-card">
          <span class="badge">Plano individualizado • InBody ${profile.inbodyDate}</span>
          <h1>Sara Fit 54</h1>
          <p class="lead">Aplicativo privado e feito só para ${profile.name}: sair de ${profile.currentWeightKg} kg rumo a ${profile.targetWeightKg} kg com execução diária, controle biométrico, protocolos anti-desvio, treino progressivo e ajustes por sono, HRV, ciclo e aderência.</p>
          <div class="hero-actions">
            <button class="cta" data-scroll="checklist">Registrar meu dia</button>
            <button class="cta secondary" data-scroll="meals">Ver cardápio disciplinado</button>
            <button class="cta secondary" data-scroll="sara-core">Modo só Sara</button>
          </div>
        </div>
        <aside class="stats-card">
          <div class="stat"><span>Peso atual</span><strong>${profile.currentWeightKg} kg</strong></div>
          <div class="stat"><span>Meta saudável</span><strong>${profile.targetWeightKg} kg</strong></div>
          <div class="stat"><span>Perda total</span><strong>${totalLoss} kg</strong></div>
          <div class="stat"><span>Prazo estimado</span><strong>${estimatedWeeksToGoal()} sem.</strong></div>
          <div class="stat"><span>Readiness</span><strong id="hero-readiness">${recommendation.readiness}%</strong></div>
        </aside>
      </section>

      <main>

        <section class="grid" id="sara-core">
          <article class="panel span-7">
            <h2>Modo só Sara: contrato privado</h2>
            <p class="lead">${saraOnlyMode.dataPolicy}</p>
            <div class="rule-grid">${saraOnlyMode.nonNegotiables.map((rule) => `<div class="rule-pill">${rule}</div>`).join('')}</div>
          </article>
          <article class="panel span-5">
            <h2>Plano de hoje gerado</h2>
            ${metric('Calorias alvo', `${todayPlan.targetCalories} kcal`)}
            ${metric('Proteína alvo', `${todayPlan.protein} g`)}
            ${metric('Readiness / strain', `${todayPlan.readiness}% / ${todayPlan.strain}`)}
            ${metric('Prioridade', todayPlan.priority)}
            ${metric('Checagem de platô', todayPlan.plateau.reason)}
          </article>
        </section>

        <section class="grid">
          <article class="panel span-7">
            <h2>Diagnóstico corporal traduzido em ação</h2>
            ${metric('Altura / idade / sexo', `${profile.heightCm} cm • ${profile.age} anos • ${profile.sex}`)}
            ${metric('IMC atual → IMC na meta', `${bmi().toFixed(1)} → ${targetBmi}`)}
            ${metric('Gordura corporal', `${profile.bodyFatPercent}% (${profile.fatMassKg} kg)`)}
            ${metric('Massa muscular esquelética', `${profile.skeletalMuscleKg} kg — prioridade: preservar e subir gradualmente`)}
            ${metric('Gordura visceral', `nível ${profile.visceralFatLevel} — exige constância em cardio, sono e déficit`)}
            ${metric('TMB InBody', `${profile.bmrKcal} kcal; plano inicia em ${macros.calories} kcal/dia`)}
            <div class="progress-wrap" aria-label="Progresso até a meta"><div class="progress-bar" style="--progress: ${progressToTarget}%"></div></div>
          </article>
          <article class="panel span-5">
            <h2>Regras inegociáveis</h2>
            ${strictRules.map(([label, value]) => `<div class="rule-row"><span>${label}</span><strong>${value}</strong></div>`).join('')}
          </article>
        </section>

        <section class="grid">
          <article class="panel span-4">
            <h2>Macros do corte</h2>
            ${metric('Calorias', `${macros.calories} kcal/dia`)}
            ${metric('Proteína', `${macros.protein} g`)}
            ${metric('Carboidratos', `${macros.carbs} g`)}
            ${metric('Gorduras', `${macros.fat} g`)}
            ${metric('Fibras', `${macros.fiber} g+`)}
          </article>
          <article class="panel span-8">
            <h2>Linha do tempo até 54 kg</h2>
            <p class="lead">Meta média: 0,6 kg/semana. Se houver fome intensa, queda de ciclo menstrual, tontura, compulsão ou perda acelerada demais, ajuste com profissional.</p>
            <div class="log-list">${milestones.slice(0, 10).map((m) => `<div class="log-entry"><strong>Semana ${m.week}</strong><span>${m.weight} kg</span></div>`).join('')}</div>
          </article>
        </section>


        <section class="panel span-12">
          <h2>Estratégia extrema em fases, sem improviso</h2>
          <div class="phase-grid">${phasePlan.map(phaseCard).join('')}</div>
        </section>

        <section class="grid">
          <article class="panel span-5">
            <h2>Rotina operacional do dia</h2>
            <div class="timeline">${dailySchedule.map(([time, action]) => `<div class="time-block"><strong>${time}</strong><span>${action}</span></div>`).join('')}</div>
          </article>
          <article class="panel span-7">
            <h2>Protocolos para não sair do plano</h2>
            <div class="protocol-grid">${crisisProtocols.map(protocolCard).join('')}</div>
          </article>
        </section>

        <section class="panel span-12" id="meals">
          <h2>Cardápio disciplinado por blocos</h2>
          <div class="meals">${meals.map(mealCard).join('')}</div>
        </section>


        <section class="grid">
          <article class="panel span-7">
            <h2>Receitas e gatilhos de uso</h2>
            <div class="recipe-grid">${recipeMatrix.map(recipeCard).join('')}</div>
          </article>
          <article class="panel span-5">
            <h2>Trocas equivalentes sem bagunçar macros</h2>
            ${swapRules.map(([base, swap]) => `<div class="rule-row"><span>${base}</span><strong>${swap}</strong></div>`).join('')}
          </article>
        </section>

        <section class="panel span-12">
          <h2>Treino semanal para emagrecer preservando músculo</h2>
          <div class="training-grid">${trainingWeek.map(trainingCard).join('')}</div>
        </section>


        <section class="panel span-12">
          <h2>Treinos detalhados com progressão</h2>
          <div class="workout-detail-grid">${Object.entries(workoutLibrary).map(workoutDetailCard).join('')}</div>
        </section>


        <section class="grid">
          <article class="panel span-7">
            <h2>Entrega Lovable refinada</h2>
            <p class="lead">${lovableHandoff.instruction}</p>
            ${metric('Prompt principal', lovableHandoff.promptFile)}
            ${metric('Design system', lovableHandoff.designFile)}
            ${metric('Modelo de dados', lovableHandoff.dataModelFile)}
            ${metric('Supabase opcional', lovableHandoff.optionalSupabaseFile)}
          </article>
          <article class="panel span-5">
            <h2>Backlog premium imediato</h2>
            <div class="protocol-grid compact">${refinementBacklog.map(backlogCard).join('')}</div>
          </article>
        </section>

        <section class="grid" id="sync">
          <article class="panel span-7">
            <h2>Central biométrica estilo Bevel, WHOOP e Oura</h2>
            <p class="lead">O app usa sono, HRV, frequência cardíaca de repouso, passos, minutos ativos, estresse e proteína para estimar prontidão, carga e ação do dia. A sincronização real com Apple Health e Garmin exige APIs oficiais, permissões e bridges nativos; aqui já existe o painel, o contrato de dados e a importação local segura.</p>
            <div class="score-grid">
              <div class="score-card"><span>Readiness</span><strong id="readiness-score">${readinessScore(syncedMetrics)}%</strong></div>
              <div class="score-card"><span>Strain</span><strong id="strain-score">${strainScore(syncedMetrics)}</strong></div>
              <div class="score-card"><span>Passos</span><strong id="steps-score">${syncedMetrics.steps}</strong></div>
            </div>
            <div class="alert neutral" id="daily-action">${recommendation.action}</div>
          </article>
          <article class="panel span-5">
            <h2>Sincronização e permissões</h2>
            <div class="integrations">${integrationSources.map(integrationCard).join('')}</div>
          </article>
          <article class="panel span-12">
            <h2>Importar métricas de wearable</h2>
            <p class="lead">Cole um JSON local, sem servidor, no formato abaixo. Exemplo: {"sleepHours":7.8,"restingHeartRate":62,"hrvMs":52,"steps":10300,"activeMinutes":48,"proteinG":122,"stressLevel":2}</p>
            <form class="import-form" id="metric-import">
              <textarea name="payload" rows="5" placeholder='{"sleepHours":7.8,"restingHeartRate":62,"hrvMs":52,"steps":10300,"activeMinutes":48,"proteinG":122,"stressLevel":2}'></textarea>
              <button class="cta" type="submit">Sincronizar localmente</button>
            </form>
            <div class="log-list" id="sync-log"></div>
          </article>
        </section>

        <section class="grid">
          <article class="panel span-5" id="checklist">
            <h2>Checklist diário</h2>
            <p class="score" id="score">0%</p>
            <div class="checklist">${dailyChecks.map(([id, label]) => `<label class="check-item"><input type="checkbox" data-check="${id}"> ${label}</label>`).join('')}</div>
          </article>
          <article class="panel span-7">
            <h2>Registro de peso e aderência</h2>
            <form class="form" id="log-form">
              <label>Data <input type="date" name="date" required></label>
              <label>Peso (kg) <input type="number" name="weight" step="0.1" min="45" max="90" required></label>
              <button class="cta" type="submit">Salvar</button>
            </form>
            <div class="log-list" id="logs"></div>
          </article>
        </section>

        <section class="grid">
          <article class="panel span-7">
            <h2>Lista de compras da fase 1</h2>
            <ul>
              <li>Proteínas: ovos, frango, peixe, patinho, iogurte grego natural, atum, tofu.</li>
              <li>Carboidratos controlados: arroz integral, feijão, batata-doce, aveia, quinoa, frutas.</li>
              <li>Volume e micronutrientes: folhas, brócolis, abobrinha, cenoura, tomate, pepino.</li>
              <li>Gorduras medidas: azeite, chia, abacate, castanhas em porção pequena.</li>
            </ul>
          </article>
          <article class="panel span-5">
            <h2>Base de segurança</h2>
            <div class="alert">${evidenceNotes.join(' ')}</div>
            <ul class="source-list">${researchLibrary.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a><small>${source.takeaway}</small></li>`).join('')}</ul>
          </article>
        </section>
      </main>
      <footer class="footer">Plano educacional personalizado por dados informados. Consulte nutricionista/médico para prescrição clínica, exames e ajustes finos.</footer>
    </div>`;
  bindInteractions();
}

function metric(label, value) {
  return `<div class="metric-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function mealCard(meal) {
  return `<article class="meal-card"><h3>${meal.label}</h3><p class="target">${meal.target}</p><ul>${meal.options.map((option) => `<li>${option}</li>`).join('')}</ul></article>`;
}

function trainingCard(item) {
  return `<article class="training-card"><b>${item.day}</b><h3>${item.focus}</h3><p>${item.detail}</p></article>`;
}

function phaseCard(phase) {
  return `<article class="phase-card"><b>${phase.weeks}</b><h3>${phase.title}</h3><p>${phase.focus}</p><span>${phase.calories}</span><small>${phase.successMetric}</small></article>`;
}

function protocolCard(protocol) {
  return `<article class="protocol-card"><h3>${protocol.trigger}</h3><p>${protocol.action}</p><small>Proibido: ${protocol.forbidden}</small></article>`;
}

function recipeCard(recipe) {
  return `<article class="recipe-card"><h3>${recipe.name}</h3><b>${recipe.kcal} kcal • ${recipe.protein} g proteína</b><ul>${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}</ul><small>${recipe.useWhen}</small></article>`;
}

function workoutDetailCard([day, exercises]) {
  return `<article class="workout-detail"><h3>${day}</h3>${exercises.map(([name, dose]) => `<div class="log-entry"><strong>${name}</strong><span>${dose}</span></div>`).join('')}</article>`;
}

function backlogCard(item) {
  return `<article class="protocol-card"><h3>${item.area}</h3><b>${item.priority}</b><p>${item.item}</p></article>`;
}

function integrationCard(source) {
  return `<article class="integration-card"><div><b>${source.name}</b><span>${connectionLabel(source.status)}</span></div><p>${source.summary}</p><small>${source.implementation}</small><a href="${source.officialUrl}" target="_blank" rel="noreferrer">Documentação oficial</a></article>`;
}

function loadSyncedMetrics() {
  return { ...recoveryDefaults, ...JSON.parse(localStorage.getItem('syncedMetrics') || '{}') };
}

function updateBiometricPanel(metrics) {
  const next = dailyRecommendation(metrics);
  document.querySelector('#hero-readiness').textContent = `${next.readiness}%`;
  document.querySelector('#readiness-score').textContent = `${next.readiness}%`;
  document.querySelector('#strain-score').textContent = strainScore(metrics);
  document.querySelector('#steps-score').textContent = metrics.steps;
  document.querySelector('#daily-action').textContent = next.action;
}

function renderSyncLog() {
  const metrics = loadSyncedMetrics();
  document.querySelector('#sync-log').innerHTML = Object.entries(metrics)
    .map(([key, value]) => `<div class="log-entry"><strong>${key}</strong><span>${value}</span></div>`)
    .join('');
}

function bindInteractions() {
  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => document.querySelector(`#${button.dataset.scroll}`).scrollIntoView({ behavior: 'smooth' }));
  });
  const savedChecks = JSON.parse(localStorage.getItem('dailyChecks') || '{}');
  const score = document.querySelector('#score');
  const updateScore = () => {
    const checks = {};
    document.querySelectorAll('[data-check]').forEach((input) => { checks[input.dataset.check] = input.checked; });
    localStorage.setItem('dailyChecks', JSON.stringify(checks));
    score.textContent = `${adherenceScore(checks)}%`;
  };
  document.querySelectorAll('[data-check]').forEach((input) => {
    input.checked = Boolean(savedChecks[input.dataset.check]);
    input.addEventListener('change', updateScore);
  });
  updateScore();

  const metricImport = document.querySelector('#metric-import');
  metricImport.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const imported = parseMetricJson(metricImport.elements.payload.value);
      const metrics = Array.isArray(imported) ? imported[imported.length - 1] : imported;
      localStorage.setItem('syncedMetrics', JSON.stringify({ ...loadSyncedMetrics(), ...metrics }));
      metricImport.reset();
      updateBiometricPanel(loadSyncedMetrics());
      renderSyncLog();
    } catch (error) {
      document.querySelector('#sync-log').innerHTML = `<div class="alert">JSON inválido: ${error.message}</div>`;
    }
  });
  renderSyncLog();

  const form = document.querySelector('#log-form');
  const dateInput = form.elements.date;
  dateInput.valueAsDate = new Date();
  const renderLogs = () => {
    const logs = JSON.parse(localStorage.getItem('weightLogs') || '[]');
    document.querySelector('#logs').innerHTML = logs.length
      ? logs.map((entry) => `<div class="log-entry"><strong>${entry.date}</strong><span>${entry.weight} kg • faltam ${kgToLose(Number(entry.weight), profile.targetWeightKg).toFixed(1)} kg</span></div>`).join('')
      : '<p class="lead">Nenhum registro ainda. Salve o peso semanal para ver evolução.</p>';
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const logs = JSON.parse(localStorage.getItem('weightLogs') || '[]');
    logs.unshift({ date: form.elements.date.value, weight: Number(form.elements.weight.value).toFixed(1) });
    localStorage.setItem('weightLogs', JSON.stringify(logs.slice(0, 20)));
    form.reset();
    dateInput.valueAsDate = new Date();
    renderLogs();
  });
  renderLogs();
}

render();
