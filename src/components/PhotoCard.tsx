import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressPhoto } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

interface Props {
  photo: ProgressPhoto;
}

export function PhotoCard({ photo }: Props) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {photo.uri ? (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>📸</Text>
        </View>
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>📸</Text>
          <Text style={styles.placeholderText}>Photo</Text>
        </View>
      )}
      <Text style={styles.label}>{photo.label || formatDate(photo.date)}</Text>
      <Text style={styles.date}>{formatDate(photo.date)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    width: 110,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEmoji: {
    fontSize: 28,
  },
  placeholderText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
