import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MomentumScore } from '../types';
import { Colors, FontSize, Spacing } from '../utils/theme';

interface Props {
  score: MomentumScore;
}

export function MomentumMeter({ score }: Props) {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score.total / 100) * circumference;

  const getColor = () => {
    if (score.total >= 70) return Colors.success;
    if (score.total >= 40) return Colors.accentWarm;
    return Colors.danger;
  };

  const getLabel = () => {
    if (score.total >= 80) return 'On Fire';
    if (score.total >= 60) return 'Strong';
    if (score.total >= 40) return 'Building';
    if (score.total >= 20) return 'Starting';
    return 'Begin';
  };

  return (
    <View style={styles.container}>
      <View style={styles.meterContainer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.cardBorder}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${progress} ${circumference - progress}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.scoreOverlay}>
          <Text style={[styles.scoreText, { color: getColor() }]}>
            {score.total}
          </Text>
          <Text style={styles.labelText}>{getLabel()}</Text>
        </View>
      </View>
      <View style={styles.breakdown}>
        <BreakdownItem label="Consistency" value={score.consistency} />
        <BreakdownItem label="Check-ins" value={score.checkins} />
        <BreakdownItem label="Recovery" value={score.recovery} />
        <BreakdownItem label="Engagement" value={score.engagement} />
      </View>
    </View>
  );
}

function BreakdownItem({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.breakdownItem}>
      <View style={styles.miniBar}>
        <View
          style={[
            styles.miniBarFill,
            {
              width: `${value}%`,
              backgroundColor:
                value >= 70
                  ? Colors.success
                  : value >= 40
                  ? Colors.accentWarm
                  : Colors.danger,
            },
          ]}
        />
      </View>
      <Text style={styles.breakdownLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  meterContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  scoreOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: FontSize.hero,
    fontWeight: '800',
  },
  labelText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.sm,
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
  },
  miniBar: {
    height: 4,
    width: '100%',
    backgroundColor: Colors.cardBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  breakdownLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
