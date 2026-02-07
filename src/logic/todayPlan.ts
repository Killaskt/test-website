import { CheckIn, TodayPlan, WorkoutTemplate, WorkoutSession } from '../types';
import { SAMPLE_TEMPLATES } from './sampleData';

const DAY_ROTATION: string[] = [
  'Upper Body', // Mon
  'Lower Body', // Tue
  'rest',       // Wed
  'Push + Core',// Thu
  'Pull + Core',// Fri
  'Full Body',  // Sat
  'rest',       // Sun
];

function getTemplateForDay(dayOfWeek: number): WorkoutTemplate | null {
  const label = DAY_ROTATION[dayOfWeek];
  if (label === 'rest') return null;
  return (
    SAMPLE_TEMPLATES.find((t) => t.name === label) || SAMPLE_TEMPLATES[0]
  );
}

export function buildTodayPlan(
  checkins: CheckIn[],
  sessions: WorkoutSession[]
): TodayPlan {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
  // Adjust: our rotation is Mon=0
  const rotationIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const todayCheckin = checkins.find(
    (c) => c.date === today.toISOString().split('T')[0]
  );

  // If user checked in and chose rest, respect it
  if (todayCheckin?.intent === 'rest') {
    return {
      workout: null,
      isRestDay: true,
      suggestion: 'Rest day — recover and come back stronger.',
      estimatedMinutes: 0,
    };
  }

  // If user checked in with low energy, suggest light
  if (todayCheckin?.intent === 'light' || (todayCheckin && todayCheckin.energy <= 2)) {
    const template = getTemplateForDay(rotationIndex);
    return {
      workout: template,
      isRestDay: false,
      suggestion: 'Light session today. Listen to your body.',
      estimatedMinutes: template ? Math.round(template.estimatedMinutes * 0.6) : 20,
    };
  }

  const template = getTemplateForDay(rotationIndex);

  if (!template) {
    return {
      workout: null,
      isRestDay: true,
      suggestion: 'Scheduled rest day. Recovery is part of the plan.',
      estimatedMinutes: 0,
    };
  }

  return {
    workout: template,
    isRestDay: false,
    suggestion: `${template.name} — ${template.estimatedMinutes} min`,
    estimatedMinutes: template.estimatedMinutes,
  };
}
