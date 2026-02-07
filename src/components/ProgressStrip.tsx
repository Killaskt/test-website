import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';
import { PhotoCard } from './PhotoCard';
import { TrendChart } from './TrendChart';
import { ProgressPhoto } from '../types';

interface Props {
  photos: ProgressPhoto[];
  weightTrend: { date: string; weight: number; movingAverage: number }[];
  latestWeight: number | null;
  completedWorkouts: number;
}

export function ProgressStrip({
  photos,
  weightTrend,
  latestWeight,
  completedWorkouts,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Weight Trend Card */}
        <View style={styles.trendCard}>
          <Text style={styles.cardLabel}>WEIGHT</Text>
          <TrendChart data={weightTrend} />
          {latestWeight && (
            <Text style={styles.statValue}>
              {latestWeight} <Text style={styles.statUnit}>lbs</Text>
            </Text>
          )}
        </View>

        {/* Strength Card */}
        <View style={styles.trendCard}>
          <Text style={styles.cardLabel}>STRENGTH</Text>
          <View style={styles.strengthContent}>
            <Text style={styles.bigStat}>{completedWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts{'\n'}Completed</Text>
          </View>
        </View>

        {/* Progress Photos */}
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingRight: Spacing.md,
    gap: Spacing.md,
  },
  trendCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: 160,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  statUnit: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  strengthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  bigStat: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
