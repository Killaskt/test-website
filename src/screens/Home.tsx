import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/useUserStore';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { useProgressStore } from '../store/useProgressStore';
import { calculateMomentum } from '../logic/momentum';
import { detectDrift } from '../logic/drift';
import { buildTodayPlan } from '../logic/todayPlan';
import { generateInsights, getTopInsight } from '../logic/insights';
import { MomentumMeter } from '../components/MomentumMeter';
import { TodayAnchor } from '../components/TodayAnchor';
import { ProgressStrip } from '../components/ProgressStrip';
import { InsightCard } from '../components/InsightCard';
import { Colors, FontSize, Spacing } from '../utils/theme';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { profile, checkins } = useUserStore();
  const { sessions, startSession } = useWorkoutStore();
  const { photos, weighIns, getWeightTrend, getLatestWeight } =
    useProgressStore();

  const momentum = useMemo(
    () => calculateMomentum(sessions, checkins),
    [sessions, checkins]
  );

  const drift = useMemo(
    () => detectDrift(sessions, checkins),
    [sessions, checkins]
  );

  const todayPlan = useMemo(
    () => buildTodayPlan(checkins, sessions),
    [checkins, sessions]
  );

  const insights = useMemo(
    () => generateInsights(momentum, drift, sessions, checkins, weighIns),
    [momentum, drift, sessions, checkins, weighIns]
  );

  const topInsight = getTopInsight(insights);
  const weightTrend = getWeightTrend();
  const latestWeight = getLatestWeight();
  const completedWorkouts = sessions.filter((s) => s.completedAt).length;

  const handleStartWorkout = () => {
    if (todayPlan.workout) {
      startSession(todayPlan.workout);
      navigation.navigate('WorkoutTab', { screen: 'LogWorkout' });
    }
  };

  const handleCheckin = () => {
    navigation.navigate('CheckIn');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.phase}>
              {profile.currentPhase} Phase — Week {profile.phaseWeek}
            </Text>
            <Text style={styles.greeting}>
              Hey {profile.name}
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>
              🔥 {momentum.checkins >= 70 ? '7+' : Math.round(momentum.checkins / 14)}
            </Text>
          </View>
        </View>

        {/* Drift Banner */}
        {drift.level !== 'none' && (
          <View
            style={[
              styles.driftBanner,
              drift.level === 'high' && styles.driftHigh,
              drift.level === 'moderate' && styles.driftModerate,
            ]}
          >
            <Text style={styles.driftText}>{drift.message}</Text>
          </View>
        )}

        {/* Momentum Meter */}
        <MomentumMeter score={momentum} />

        {/* Today Anchor */}
        <View style={styles.section}>
          <TodayAnchor plan={todayPlan} onStart={handleStartWorkout} />
        </View>

        {/* Progress Strip */}
        <View style={styles.section}>
          <ProgressStrip
            photos={photos}
            weightTrend={weightTrend}
            latestWeight={latestWeight}
            completedWorkouts={completedWorkouts}
          />
        </View>

        {/* Top Insight */}
        {topInsight && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insight</Text>
            <InsightCard insight={topInsight} />
          </View>
        )}

        {/* Additional Insights */}
        {insights.length > 1 && (
          <View style={styles.section}>
            {insights.slice(1, 3).map((insight) => (
              <View key={insight.id} style={styles.insightSpacing}>
                <InsightCard insight={insight} />
              </View>
            ))}
          </View>
        )}

        {/* Log Today Button */}
        <TouchableOpacity style={styles.logButton} onPress={handleCheckin}>
          <Text style={styles.logButtonText}>Log Today</Text>
          <Text style={styles.logButtonSub}>30-second check-in</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  phase: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primaryLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  streakBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  streakText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  driftBanner: {
    backgroundColor: Colors.accentWarm + '20',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentWarm,
  },
  driftHigh: {
    backgroundColor: Colors.danger + '20',
    borderLeftColor: Colors.danger,
  },
  driftModerate: {
    backgroundColor: Colors.accentWarm + '20',
    borderLeftColor: Colors.accentWarm,
  },
  driftText: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  insightSpacing: {
    marginTop: Spacing.sm,
  },
  logButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
  },
  logButtonSub: {
    fontSize: FontSize.xs,
    color: Colors.white + 'AA',
    marginTop: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});
