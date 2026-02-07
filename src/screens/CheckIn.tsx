import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/useUserStore';
import { CheckIn } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

const SORENESS_OPTIONS = [
  'Shoulders',
  'Chest',
  'Back',
  'Arms',
  'Core',
  'Legs',
  'None',
];

const MOOD_OPTIONS: { label: string; value: CheckIn['mood'] }[] = [
  { label: '😊 Great', value: 'great' },
  { label: '🙂 Good', value: 'good' },
  { label: '😐 Okay', value: 'okay' },
  { label: '😔 Low', value: 'low' },
  { label: '😫 Bad', value: 'bad' },
];

const INTENT_OPTIONS: { label: string; value: CheckIn['intent']; icon: string }[] = [
  { label: 'Train', value: 'train', icon: '🏋️' },
  { label: 'Light', value: 'light', icon: '🚶' },
  { label: 'Rest', value: 'rest', icon: '😴' },
];

export function CheckInScreen() {
  const navigation = useNavigation();
  const addCheckin = useUserStore((s) => s.addCheckin);

  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [mood, setMood] = useState<CheckIn['mood']>(undefined);
  const [soreness, setSoreness] = useState<string[]>([]);
  const [intent, setIntent] = useState<CheckIn['intent']>('train');

  const toggleSoreness = (part: string) => {
    if (part === 'None') {
      setSoreness([]);
      return;
    }
    setSoreness((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleSave = () => {
    const now = new Date();
    const checkin: CheckIn = {
      id: `ci-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      energy,
      mood,
      soreness: soreness.map((s) => s.toLowerCase()),
      intent,
      createdAt: now.toISOString(),
    };
    addCheckin(checkin);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Daily Check-In</Text>
        <Text style={styles.subtitle}>30 seconds. How are you feeling?</Text>

        {/* Energy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Energy Level</Text>
          <View style={styles.energyRow}>
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.energyButton,
                  energy === level && styles.energyActive,
                ]}
                onPress={() => setEnergy(level)}
              >
                <Text
                  style={[
                    styles.energyText,
                    energy === level && styles.energyTextActive,
                  ]}
                >
                  {level}
                </Text>
                <Text style={styles.energyLabel}>
                  {level === 1
                    ? 'Dead'
                    : level === 2
                    ? 'Low'
                    : level === 3
                    ? 'OK'
                    : level === 4
                    ? 'Good'
                    : 'Great'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mood (optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mood <Text style={styles.optional}>(optional)</Text>
          </Text>
          <View style={styles.chipRow}>
            {MOOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.chip,
                  mood === option.value && styles.chipActive,
                ]}
                onPress={() =>
                  setMood(mood === option.value ? undefined : option.value)
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    mood === option.value && styles.chipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Soreness */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soreness</Text>
          <View style={styles.chipRow}>
            {SORENESS_OPTIONS.map((part) => (
              <TouchableOpacity
                key={part}
                style={[
                  styles.chip,
                  soreness.includes(part) && styles.chipSore,
                  part === 'None' && soreness.length === 0 && styles.chipActive,
                ]}
                onPress={() => toggleSoreness(part)}
              >
                <Text
                  style={[
                    styles.chipText,
                    (soreness.includes(part) ||
                      (part === 'None' && soreness.length === 0)) &&
                      styles.chipTextActive,
                  ]}
                >
                  {part}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Intent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Intent</Text>
          <View style={styles.intentRow}>
            {INTENT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.intentButton,
                  intent === option.value && styles.intentActive,
                ]}
                onPress={() => setIntent(option.value)}
              >
                <Text style={styles.intentIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.intentLabel,
                    intent === option.value && styles.intentLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Check-In</Text>
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
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optional: {
    fontWeight: '400',
    color: Colors.textMuted,
  },
  energyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  energyButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  energyActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  energyText: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  energyTextActive: {
    color: Colors.primary,
  },
  energyLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  chipSore: {
    borderColor: Colors.accentWarm,
    backgroundColor: Colors.accentWarm + '20',
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  intentRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  intentButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  intentActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  intentIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  intentLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  intentLabelActive: {
    color: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  saveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
  },
  bottomSpacer: {
    height: 40,
  },
});
