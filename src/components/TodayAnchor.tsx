import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TodayPlan } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

interface Props {
  plan: TodayPlan;
  onStart: () => void;
}

export function TodayAnchor({ plan, onStart }: Props) {
  if (plan.isRestDay) {
    return (
      <View style={[styles.container, styles.restContainer]}>
        <View style={styles.restBadge}>
          <Text style={styles.restBadgeText}>REST DAY</Text>
        </View>
        <Text style={styles.restTitle}>Recovery Day</Text>
        <Text style={styles.restSubtitle}>{plan.suggestion}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>TODAY</Text>
          <Text style={styles.title}>
            {plan.workout?.name || 'Workout'}
          </Text>
          <Text style={styles.subtitle}>
            {plan.estimatedMinutes} min • {plan.workout?.exercises.length || 0} exercises
          </Text>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
      </View>
      {plan.workout && (
        <View style={styles.exercisePreview}>
          {plan.workout.exercises.slice(0, 3).map((ex, i) => (
            <Text key={ex.id} style={styles.exerciseText}>
              {ex.name} — {ex.sets}×{ex.repsMin}-{ex.repsMax}
            </Text>
          ))}
          {plan.workout.exercises.length > 3 && (
            <Text style={styles.moreText}>
              +{plan.workout.exercises.length - 3} more
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  restContainer: {
    borderColor: Colors.accent,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  startButtonText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSize.md,
    letterSpacing: 1,
  },
  exercisePreview: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  exerciseText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  moreText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  restBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  restBadgeText: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: FontSize.xs,
    letterSpacing: 2,
  },
  restTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  restSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
