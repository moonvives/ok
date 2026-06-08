import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseMetricJson, normalizeMetricPayload, connectionLabel } from '../src/integrations.js';
import { lovableHandoff, refinementBacklog } from '../src/personalization.js';

import {
  buildTodayPlan,
  calorieTargetForDay,
  currentPhaseForWeek,
  detectPlateau,
  saraOnlyMode,
  workoutLibrary
} from '../src/personalization.js';
import {
  adherenceScore,
  bmi,
  dailyRecommendation,
  estimatedWeeksToGoal,
  kgToLose,
  macroTargets,
  readinessScore,
  recoveryDefaults,
  researchLibrary,
  strainScore,
  weeklyMilestones
} from '../src/plan.js';

describe('personalized plan calculations', () => {
  it('calculates BMI and weight gap for the InBody profile', () => {
    assert.equal(bmi().toFixed(1), '27.3');
    assert.equal(kgToLose(), 19.3);
  });

  it('sets a realistic timeline and final milestone at goal weight', () => {
    assert.equal(estimatedWeeksToGoal(), 33);
    const milestones = weeklyMilestones();
    assert.equal(milestones.at(-1).weight, 54);
  });

  it('keeps calorie and protein targets in disciplined but plausible ranges', () => {
    const macros = macroTargets();
    assert.equal(macros.calories, 1450);
    assert.ok(macros.protein >= 105);
    assert.ok(macros.carbs > 90);
  });

  it('computes daily adherence percentage', () => {
    assert.equal(adherenceScore({ a: true, b: false, c: true, note: 'ignored' }), 67);
  });

  it('scores readiness and strain from wearable-like metrics', () => {
    assert.equal(readinessScore(recoveryDefaults), 83);
    assert.equal(strainScore(recoveryDefaults), 14.4);
    assert.match(dailyRecommendation({ ...recoveryDefaults, sleepHours: 4.5, hrvMs: 22, proteinG: 50, restingHeartRate: 76, stressLevel: 5 }).action, /Recuperação ativa/);
  });

  it('includes expanded legal research sources instead of unauthorized article access', () => {
    const labels = researchLibrary.map((source) => source.label).join(' ');
    assert.match(labels, /PubMed/);
    assert.match(labels, /Apple Developer/);
    assert.match(labels, /Garmin Developers/);
  });
});

describe('integration payload helpers', () => {
  it('normalizes JSON metrics from Apple Health or Garmin bridge payloads', () => {
    const metrics = parseMetricJson('{"sleepHours":"7.8","steps":"10300","unknown":"ignored"}');
    assert.deepEqual(metrics, { sleepHours: 7.8, steps: 10300 });
  });

  it('normalizes arrays and labels official integration states', () => {
    assert.deepEqual(normalizeMetricPayload({ proteinG: '122', menstrualPhase: 'lútea' }), { proteinG: 122, menstrualPhase: 'lútea' });
    assert.equal(parseMetricJson('[{"steps":9000},{"steps":10000}]').at(-1).steps, 10000);
    assert.equal(connectionLabel('approval-required'), 'Requer aprovação oficial');
  });
});

describe('Sara-only personalization engine', () => {
  it('locks the plan to Sara and exposes non-negotiable safety rules', () => {
    assert.equal(saraOnlyMode.owner, 'Sara Ruth');
    assert.ok(saraOnlyMode.nonNegotiables.some((rule) => rule.includes('1350 kcal')));
  });

  it('selects the correct phase across the full cut and maintenance', () => {
    assert.equal(currentPhaseForWeek(2).id, 'foundation');
    assert.equal(currentPhaseForWeek(10).id, 'fat-loss');
    assert.equal(currentPhaseForWeek(18).id, 'diet-break');
    assert.equal(currentPhaseForWeek(26).id, 'final-cut');
    assert.equal(currentPhaseForWeek(40).id, 'maintenance');
  });

  it('adapts daily calories without unsafe extremes', () => {
    assert.equal(calorieTargetForDay({ cyclePhase: 'lútea', trainingDay: true }), 1600);
    assert.equal(calorieTargetForDay({ metrics: { sleepHours: 3, hrvMs: 15, restingHeartRate: 82, stressLevel: 5, proteinG: 40 }, trainingDay: false }), 1400);
  });

  it('detects plateaus from recent weight logs and generates today plan', () => {
    const plateau = detectPlateau([{ weight: 72.9 }, { weight: 73.0 }, { weight: 73.1 }]);
    assert.equal(plateau.plateau, true);
    const today = buildTodayPlan({ dayName: 'Segunda', logs: [{ weight: 72.9 }, { weight: 73.0 }, { weight: 73.1 }] });
    assert.equal(today.workout.length, workoutLibrary.Segunda.length);
    assert.match(today.priority, /treino|recuperação/);
  });
});

describe('Lovable handoff package', () => {
  it('points to the Lovable prompt and premium refinement backlog', () => {
    assert.equal(lovableHandoff.promptFile, 'lovable/prompt.md');
    assert.ok(refinementBacklog.length >= 4);
    assert.ok(refinementBacklog.some((item) => item.area.includes('Produto Lovable')));
  });
});
