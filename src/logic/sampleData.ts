import {
  UserProfile,
  CheckIn,
  WeighIn,
  ProgressPhoto,
  WorkoutTemplate,
  WorkoutSession,
  LoggedSet,
} from '../types';

// Helper to generate dates relative to today
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── User ──────────────────────────────────────────
export const SAMPLE_USER: UserProfile = {
  id: 'user-1',
  name: 'Alex',
  currentPhase: 'Strength',
  phaseWeek: 4,
  createdAt: daysAgoISO(28),
};

// ── Workout Templates ─────────────────────────────
export const SAMPLE_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tmpl-upper',
    name: 'Upper Body',
    targetMuscles: ['chest', 'back', 'shoulders', 'arms'],
    estimatedMinutes: 40,
    exercises: [
      { id: 'ex-1', name: 'Bench Press', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 120 },
      { id: 'ex-2', name: 'Barbell Row', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 120 },
      { id: 'ex-3', name: 'Overhead Press', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
      { id: 'ex-4', name: 'Dumbbell Curl', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
      { id: 'ex-5', name: 'Tricep Pushdown', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl-lower',
    name: 'Lower Body',
    targetMuscles: ['quads', 'hamstrings', 'glutes', 'calves'],
    estimatedMinutes: 45,
    exercises: [
      { id: 'ex-6', name: 'Squat', sets: 4, repsMin: 5, repsMax: 7, restSeconds: 150 },
      { id: 'ex-7', name: 'Romanian Deadlift', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
      { id: 'ex-8', name: 'Leg Press', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
      { id: 'ex-9', name: 'Walking Lunge', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
      { id: 'ex-10', name: 'Calf Raise', sets: 4, repsMin: 12, repsMax: 15, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl-push-core',
    name: 'Push + Core',
    targetMuscles: ['chest', 'shoulders', 'triceps', 'core'],
    estimatedMinutes: 35,
    exercises: [
      { id: 'ex-11', name: 'Incline Dumbbell Press', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 90 },
      { id: 'ex-12', name: 'Lateral Raise', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
      { id: 'ex-13', name: 'Dips', sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90 },
      { id: 'ex-14', name: 'Plank Hold', sets: 3, repsMin: 45, repsMax: 60, restSeconds: 60 },
      { id: 'ex-15', name: 'Cable Crunch', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl-pull-core',
    name: 'Pull + Core',
    targetMuscles: ['back', 'biceps', 'rear delts', 'core'],
    estimatedMinutes: 35,
    exercises: [
      { id: 'ex-16', name: 'Pull-ups', sets: 4, repsMin: 6, repsMax: 10, restSeconds: 120 },
      { id: 'ex-17', name: 'Cable Row', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 90 },
      { id: 'ex-18', name: 'Face Pull', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
      { id: 'ex-19', name: 'Hammer Curl', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
      { id: 'ex-20', name: 'Hanging Leg Raise', sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl-full',
    name: 'Full Body',
    targetMuscles: ['full body'],
    estimatedMinutes: 50,
    exercises: [
      { id: 'ex-21', name: 'Deadlift', sets: 3, repsMin: 5, repsMax: 6, restSeconds: 180 },
      { id: 'ex-22', name: 'Bench Press', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
      { id: 'ex-23', name: 'Front Squat', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
      { id: 'ex-24', name: 'Chin-ups', sets: 3, repsMin: 6, repsMax: 10, restSeconds: 90 },
      { id: 'ex-25', name: 'Farmer Carry', sets: 3, repsMin: 30, repsMax: 40, restSeconds: 90 },
    ],
  },
];

// ── Check-Ins ─────────────────────────────────────
export const SAMPLE_CHECKINS: CheckIn[] = [
  { id: 'ci-1', date: daysAgo(0), energy: 4, mood: 'good', soreness: ['legs'], intent: 'train', createdAt: daysAgoISO(0) },
  { id: 'ci-2', date: daysAgo(1), energy: 3, mood: 'okay', soreness: ['shoulders'], intent: 'train', createdAt: daysAgoISO(1) },
  { id: 'ci-3', date: daysAgo(2), energy: 5, mood: 'great', soreness: [], intent: 'train', createdAt: daysAgoISO(2) },
  { id: 'ci-4', date: daysAgo(3), energy: 2, mood: 'low', soreness: ['legs', 'back'], intent: 'rest', createdAt: daysAgoISO(3) },
  { id: 'ci-5', date: daysAgo(4), energy: 4, mood: 'good', soreness: [], intent: 'train', createdAt: daysAgoISO(4) },
  { id: 'ci-6', date: daysAgo(5), energy: 3, mood: 'okay', soreness: ['chest'], intent: 'train', createdAt: daysAgoISO(5) },
  { id: 'ci-7', date: daysAgo(6), energy: 4, mood: 'good', soreness: [], intent: 'train', createdAt: daysAgoISO(6) },
];

// ── Weigh-Ins ─────────────────────────────────────
export const SAMPLE_WEIGHINS: WeighIn[] = [
  { id: 'w-1', date: daysAgo(13), weight: 182.4, createdAt: daysAgoISO(13) },
  { id: 'w-2', date: daysAgo(11), weight: 181.8, createdAt: daysAgoISO(11) },
  { id: 'w-3', date: daysAgo(9), weight: 182.1, createdAt: daysAgoISO(9) },
  { id: 'w-4', date: daysAgo(7), weight: 181.2, createdAt: daysAgoISO(7) },
  { id: 'w-5', date: daysAgo(5), weight: 180.9, createdAt: daysAgoISO(5) },
  { id: 'w-6', date: daysAgo(3), weight: 181.0, createdAt: daysAgoISO(3) },
  { id: 'w-7', date: daysAgo(1), weight: 180.5, createdAt: daysAgoISO(1) },
  { id: 'w-8', date: daysAgo(0), weight: 180.2, createdAt: daysAgoISO(0) },
];

// ── Progress Photos (placeholder URIs) ────────────
export const SAMPLE_PHOTOS: ProgressPhoto[] = [
  { id: 'p-1', date: daysAgo(28), uri: '', label: 'Day 1', createdAt: daysAgoISO(28) },
  { id: 'p-2', date: daysAgo(14), uri: '', label: 'Week 2', createdAt: daysAgoISO(14) },
  { id: 'p-3', date: daysAgo(0), uri: '', label: 'Week 4', createdAt: daysAgoISO(0) },
];

// ── Workout Sessions ──────────────────────────────
function makeSets(exercises: { name: string; sets: number }[]): LoggedSet[] {
  const allSets: LoggedSet[] = [];
  let setCounter = 0;
  for (const ex of exercises) {
    for (let s = 1; s <= ex.sets; s++) {
      allSets.push({
        id: `set-${++setCounter}`,
        exerciseName: ex.name,
        setNumber: s,
        weight: Math.round(100 + Math.random() * 80),
        reps: Math.round(6 + Math.random() * 6),
        rpe: Math.round(6 + Math.random() * 3),
      });
    }
  }
  return allSets;
}

export const SAMPLE_SESSIONS: WorkoutSession[] = [
  {
    id: 'sess-1',
    templateId: 'tmpl-upper',
    templateName: 'Upper Body',
    date: daysAgo(1),
    startedAt: daysAgoISO(1),
    completedAt: daysAgoISO(1),
    sets: makeSets([
      { name: 'Bench Press', sets: 4 },
      { name: 'Barbell Row', sets: 4 },
      { name: 'Overhead Press', sets: 3 },
    ]),
  },
  {
    id: 'sess-2',
    templateId: 'tmpl-lower',
    templateName: 'Lower Body',
    date: daysAgo(3),
    startedAt: daysAgoISO(3),
    completedAt: daysAgoISO(3),
    sets: makeSets([
      { name: 'Squat', sets: 4 },
      { name: 'Romanian Deadlift', sets: 4 },
      { name: 'Leg Press', sets: 3 },
    ]),
  },
  {
    id: 'sess-3',
    templateId: 'tmpl-push-core',
    templateName: 'Push + Core',
    date: daysAgo(5),
    startedAt: daysAgoISO(5),
    completedAt: daysAgoISO(5),
    sets: makeSets([
      { name: 'Incline Dumbbell Press', sets: 4 },
      { name: 'Lateral Raise', sets: 3 },
      { name: 'Dips', sets: 3 },
    ]),
  },
  {
    id: 'sess-4',
    templateId: 'tmpl-pull-core',
    templateName: 'Pull + Core',
    date: daysAgo(7),
    startedAt: daysAgoISO(7),
    completedAt: daysAgoISO(7),
    sets: makeSets([
      { name: 'Pull-ups', sets: 4 },
      { name: 'Cable Row', sets: 4 },
      { name: 'Face Pull', sets: 3 },
    ]),
  },
  {
    id: 'sess-5',
    templateId: 'tmpl-full',
    templateName: 'Full Body',
    date: daysAgo(9),
    startedAt: daysAgoISO(9),
    completedAt: daysAgoISO(9),
    sets: makeSets([
      { name: 'Deadlift', sets: 3 },
      { name: 'Bench Press', sets: 3 },
      { name: 'Front Squat', sets: 3 },
    ]),
  },
  {
    id: 'sess-6',
    templateId: 'tmpl-upper',
    templateName: 'Upper Body',
    date: daysAgo(11),
    startedAt: daysAgoISO(11),
    completedAt: daysAgoISO(11),
    sets: makeSets([
      { name: 'Bench Press', sets: 4 },
      { name: 'Barbell Row', sets: 4 },
    ]),
  },
];

// ── Weight Trend Helpers ──────────────────────────
export function calculateMovingAverage(weighIns: WeighIn[], window = 3): { date: string; weight: number; movingAverage: number }[] {
  return weighIns.map((w, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = weighIns.slice(start, i + 1);
    const avg = slice.reduce((sum, x) => sum + x.weight, 0) / slice.length;
    return {
      date: w.date,
      weight: w.weight,
      movingAverage: Math.round(avg * 10) / 10,
    };
  });
}
