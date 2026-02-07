import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Insight } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

interface Props {
  insight: Insight;
}

const TYPE_CONFIG: Record<Insight['type'], { icon: string; color: string }> = {
  progress: { icon: '📈', color: Colors.success },
  recovery: { icon: '💤', color: Colors.accent },
  consistency: { icon: '🔥', color: Colors.accentWarm },
  strength: { icon: '💪', color: Colors.primary },
  tip: { icon: '💡', color: Colors.primaryLight },
};

export function InsightCard({ insight }: Props) {
  const config = TYPE_CONFIG[insight.type];

  return (
    <View style={[styles.container, { borderLeftColor: config.color }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.typeLabel}>
          {insight.type.toUpperCase()}
        </Text>
        <Text style={styles.text}>{insight.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderLeftWidth: 3,
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  typeLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 20,
  },
});
