import { Insight, MomentumScore, WorkoutSession, CheckIn, WeighIn } from '../types';
import { DriftSignal } from './drift';

let insightId = 0;
function makeInsight(
  text: string,
  type: Insight['type'],
  priority: number
): Insight {
  return { id: `insight-${++insightId}`, text, type, priority };
}

export function generateInsights(
  momentum: MomentumScore,
  drift: DriftSignal,
  sessions: WorkoutSession[],
  checkins: CheckIn[],
  weighIns: WeighIn[]
): Insight[] {
  const insights: Insight[] = [];

  // Momentum-based insights
  if (momentum.total >= 80) {
    insights.push(
      makeInsight(
        "You're in the zone — momentum is high. Keep this up!",
        'consistency',
        3
      )
    );
  } else if (momentum.total >= 50) {
    insights.push(
      makeInsight(
        'Solid progress. One more workout this week pushes you higher.',
        'consistency',
        5
      )
    );
  } else if (momentum.total < 30) {
    insights.push(
      makeInsight(
        "Let's rebuild momentum. Start with a 20-minute session.",
        'consistency',
        8
      )
    );
  }

  // Recovery insights
  if (momentum.recovery < 40) {
    insights.push(
      makeInsight(
        'Your recovery signals are low. Consider extra sleep tonight.',
        'recovery',
        7
      )
    );
  }

  // Drift insights
  if (drift.level === 'high') {
    insights.push(
      makeInsight(drift.message, 'consistency', 9));
  } else if (drift.level === 'moderate') {
    insights.push(
      makeInsight(drift.message, 'consistency', 6));
  }

  // Strength insights
  const completedSessions = sessions.filter((s) => s.completedAt);
  if (completedSessions.length >= 5) {
    insights.push(
      makeInsight(
        `${completedSessions.length} workouts completed. You're building real consistency.`,
        'strength',
        4
      )
    );
  }

  // Weight trend insights
  if (weighIns.length >= 3) {
    const recent = weighIns.slice(-3);
    const trend = recent[recent.length - 1].weight - recent[0].weight;
    if (Math.abs(trend) > 0.5) {
      const direction = trend > 0 ? 'up' : 'down';
      insights.push(
        makeInsight(
          `Weight trending ${direction} ${Math.abs(trend).toFixed(1)} lbs over recent entries.`,
          'progress',
          5
        )
      );
    } else {
      insights.push(
        makeInsight(
          'Weight holding steady — consistent fueling.',
          'progress',
          3
        )
      );
    }
  }

  // Check-in streak
  if (momentum.checkins >= 70) {
    insights.push(
      makeInsight(
        'Check-in streak is strong. This consistency drives results.',
        'tip',
        2
      )
    );
  }

  // Sort by priority (highest first)
  return insights.sort((a, b) => b.priority - a.priority);
}

export function getTopInsight(insights: Insight[]): Insight | null {
  return insights.length > 0 ? insights[0] : null;
}
