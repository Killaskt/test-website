import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { LoggedSet } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

export function LogWorkoutScreen() {
  const navigation = useNavigation();
  const { activeSession, logSet, finishSession, cancelSession, templates } =
    useWorkoutStore();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');

  if (!activeSession) {
    return (
      <View style={styles.screen}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active session</Text>
          <Text style={styles.emptySubtext}>
            Start a workout from the Workout tab or Home screen.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const template = templates.find((t) => t.id === activeSession.templateId);
  const exercises = template?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const setsForCurrentExercise = activeSession.sets.filter(
    (s) => s.exerciseName === currentExercise?.name
  );

  const handleLogSet = () => {
    if (!currentExercise) return;
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps, 10);
    if (isNaN(weightNum) || isNaN(repsNum)) return;

    const newSet: LoggedSet = {
      id: `set-${Date.now()}`,
      exerciseName: currentExercise.name,
      setNumber: setsForCurrentExercise.length + 1,
      weight: weightNum,
      reps: repsNum,
      rpe: rpe ? parseInt(rpe, 10) : undefined,
    };

    logSet(newSet);
    setWeight('');
    setReps('');
    setRpe('');
  };

  const handleFinish = () => {
    finishSession();
    navigation.goBack();
  };

  const handleCancel = () => {
    Alert.alert('Cancel Workout', 'Are you sure? Progress will be lost.', [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Cancel',
        style: 'destructive',
        onPress: () => {
          cancelSession();
          navigation.goBack();
        },
      },
    ]);
  };

  const totalSets = activeSession.sets.length;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{activeSession.templateName}</Text>
            <Text style={styles.subtitle}>
              {totalSets} sets logged
            </Text>
          </View>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Exercise Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.exerciseTabs}
        >
          {exercises.map((ex, i) => {
            const done = activeSession.sets.filter(
              (s) => s.exerciseName === ex.name
            ).length;
            return (
              <TouchableOpacity
                key={ex.id}
                style={[
                  styles.exerciseTab,
                  i === currentExerciseIndex && styles.exerciseTabActive,
                  done >= ex.sets && styles.exerciseTabDone,
                ]}
                onPress={() => setCurrentExerciseIndex(i)}
              >
                <Text
                  style={[
                    styles.exerciseTabText,
                    i === currentExerciseIndex && styles.exerciseTabTextActive,
                  ]}
                >
                  {ex.name}
                </Text>
                <Text style={styles.exerciseTabSets}>
                  {done}/{ex.sets}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Current Exercise */}
        {currentExercise && (
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseTarget}>
              Target: {currentExercise.sets} sets × {currentExercise.repsMin}-
              {currentExercise.repsMax} reps • {currentExercise.restSeconds}s
              rest
            </Text>

            {/* Logged sets */}
            {setsForCurrentExercise.map((set) => (
              <View key={set.id} style={styles.loggedSet}>
                <Text style={styles.setNumber}>Set {set.setNumber}</Text>
                <Text style={styles.setValue}>
                  {set.weight} lbs × {set.reps}
                </Text>
                {set.rpe && (
                  <Text style={styles.setRpe}>RPE {set.rpe}</Text>
                )}
              </View>
            ))}

            {/* Input Row */}
            {setsForCurrentExercise.length < currentExercise.sets && (
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  Set {setsForCurrentExercise.length + 1}
                </Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputHint}>Weight</Text>
                    <TextInput
                      style={styles.input}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      placeholder="lbs"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputHint}>Reps</Text>
                    <TextInput
                      style={styles.input}
                      value={reps}
                      onChangeText={setReps}
                      keyboardType="numeric"
                      placeholder="#"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                  <View style={styles.inputGroupSmall}>
                    <Text style={styles.inputHint}>RPE</Text>
                    <TextInput
                      style={styles.input}
                      value={rpe}
                      onChangeText={setRpe}
                      keyboardType="numeric"
                      placeholder="opt"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.logSetButton}
                  onPress={handleLogSet}
                >
                  <Text style={styles.logSetButtonText}>Log Set</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Finish */}
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish Workout</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  backButtonText: {
    color: Colors.white,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cancelText: {
    fontSize: FontSize.md,
    color: Colors.danger,
    fontWeight: '600',
  },
  exerciseTabs: {
    marginBottom: Spacing.lg,
  },
  exerciseTab: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    minWidth: 100,
  },
  exerciseTabActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  exerciseTabDone: {
    borderColor: Colors.success,
  },
  exerciseTabText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  exerciseTabTextActive: {
    color: Colors.primary,
  },
  exerciseTabSets: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  exerciseCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  exerciseName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  exerciseTarget: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  loggedSet: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: Spacing.md,
  },
  setNumber: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    width: 50,
  },
  setValue: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  setRpe: {
    fontSize: FontSize.sm,
    color: Colors.accentWarm,
  },
  inputSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  inputLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  inputGroup: {
    flex: 2,
  },
  inputGroupSmall: {
    flex: 1,
  },
  inputHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.text,
    fontWeight: '700',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  logSetButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logSetButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  finishButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  finishButtonText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSize.lg,
  },
  bottomSpacer: {
    height: 100,
  },
});
