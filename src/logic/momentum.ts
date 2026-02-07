import { MomentumScore, CheckIn, WorkoutSession } from '../types';

const WEIGHTS = {
  consistency: 0.4,
  checkins: 0.25,
  recovery: 0.2,
  engagement: 0.15,
};

/**
 * Calculate consistency score based on workout frequency over the last 14 days.
 * Target: 4 workouts/week = 100
 */
function calcConsistency(sessions: WorkoutSession[]): number {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const recentSessions = sessions.filter(
    (s) => new Date(s.date) >= twoWeeksAgo && s.completedAt
  );
  const targetPerTwoWeeks = 8; // 4/week * 2
  return Math.min(100, (recentSessions.length / targetPerTwoWeeks) * 100);
}

/**
 * Calculate check-in score based on daily check-in streak.
 * 7+ day streak = 100
 */
function calcCheckins(checkins: CheckIn[]): number {
  if (checkins.length === 0) return 0;

  const sorted = [...checkins].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const checkinDate = sorted[i].date;
    const expectedDate = expected.toISOString().split('T')[0];

    if (checkinDate === expectedDate) {
      streak++;
    } else {
      break;
    }
  }

  return Math.min(100, (streak / 7) * 100);
}

/**
 * Calculate recovery score based on recent check-in energy and soreness.
 */
function calcRecovery(checkins: CheckIn[]): number {
  const recent = checkins.slice(-3);
  if (recent.length === 0) return 50; // neutral default

  const avgEnergy =
    recent.reduce((sum, c) => sum + c.energy, 0) / recent.length;
  const avgSoreness =
    recent.reduce((sum, c) => sum + c.soreness.length, 0) / recent.length;

  const energyScore = (avgEnergy / 5) * 100;
  const sorenessScore = Math.max(0, 100 - avgSoreness * 20);

  return (energyScore * 0.6 + sorenessScore * 0.4);
}

/**
 * Calculate engagement score based on recent app usage patterns.
 * For MVP: based on check-ins in last 7 days.
 */
function calcEngagement(checkins: CheckIn[], sessions: WorkoutSession[]): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentCheckins = checkins.filter(
    (c) => new Date(c.date) >= weekAgo
  ).length;
  const recentSessions = sessions.filter(
    (s) => new Date(s.date) >= weekAgo
  ).length;

  const checkinScore = Math.min(100, (recentCheckins / 7) * 100);
  const sessionScore = Math.min(100, (recentSessions / 4) * 100);

  return checkinScore * 0.5 + sessionScore * 0.5;
}

export function calculateMomentum(
  sessions: WorkoutSession[],
  checkins: CheckIn[]
): MomentumScore {
  const consistency = calcConsistency(sessions);
  const checkinsScore = calcCheckins(checkins);
  const recovery = calcRecovery(checkins);
  const engagement = calcEngagement(checkins, sessions);

  const total = Math.round(
    consistency * WEIGHTS.consistency +
    checkinsScore * WEIGHTS.checkins +
    recovery * WEIGHTS.recovery +
    engagement * WEIGHTS.engagement
  );

  return {
    total: Math.min(100, Math.max(0, total)),
    consistency: Math.round(consistency),
    checkins: Math.round(checkinsScore),
    recovery: Math.round(recovery),
    engagement: Math.round(engagement),
  };
}
