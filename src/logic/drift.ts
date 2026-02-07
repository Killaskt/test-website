import { CheckIn, WorkoutSession } from '../types';

export type DriftLevel = 'none' | 'mild' | 'moderate' | 'high';

export interface DriftSignal {
  level: DriftLevel;
  daysSinceLastWorkout: number;
  daysSinceLastCheckin: number;
  message: string;
}

function daysBetween(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function detectDrift(
  sessions: WorkoutSession[],
  checkins: CheckIn[]
): DriftSignal {
  const completedSessions = sessions.filter((s) => s.completedAt);
  const lastWorkout = completedSessions.length > 0
    ? completedSessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
    : null;

  const lastCheckin = checkins.length > 0
    ? [...checkins].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
    : null;

  const daysSinceWorkout = lastWorkout ? daysBetween(lastWorkout.date) : 999;
  const daysSinceCheckin = lastCheckin ? daysBetween(lastCheckin.date) : 999;

  let level: DriftLevel = 'none';
  let message = '';

  if (daysSinceWorkout >= 5 || daysSinceCheckin >= 3) {
    level = 'high';
    message = "You've been away — let's start with a quick check-in.";
  } else if (daysSinceWorkout >= 3 || daysSinceCheckin >= 2) {
    level = 'moderate';
    message = 'A short session today keeps your streak alive.';
  } else if (daysSinceWorkout >= 2) {
    level = 'mild';
    message = 'Rest is good. Ready when you are.';
  } else {
    message = "You're on track. Keep it up!";
  }

  return {
    level,
    daysSinceLastWorkout: daysSinceWorkout,
    daysSinceLastCheckin: daysSinceCheckin,
    message,
  };
}
