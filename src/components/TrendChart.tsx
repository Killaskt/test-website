import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Colors } from '../utils/theme';

interface DataPoint {
  date: string;
  weight: number;
  movingAverage: number;
}

interface Props {
  data: DataPoint[];
}

export function TrendChart({ data }: Props) {
  if (data.length < 2) return null;

  const width = 130;
  const height = 50;
  const padding = 4;

  const weights = data.map((d) => d.movingAverage);
  const min = Math.min(...weights) - 0.5;
  const max = Math.max(...weights) + 0.5;
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((d.movingAverage - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const rawPoints = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((d.weight - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Raw data points */}
        <Polyline
          points={rawPoints}
          fill="none"
          stroke={Colors.textMuted}
          strokeWidth={1}
          strokeDasharray="3,3"
        />
        {/* Moving average line */}
        <Polyline
          points={points}
          fill="none"
          stroke={Colors.accent}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
