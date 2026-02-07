import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { WorkoutTemplate } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

function TemplateCard({
  template,
  onStart,
}: {
  template: WorkoutTemplate;
  onStart: () => void;
}) {
  return (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View>
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={styles.templateMeta}>
            {template.estimatedMinutes} min • {template.exercises.length}{' '}
            exercises
          </Text>
        </View>
        <TouchableOpacity style={styles.startSmall} onPress={onStart}>
          <Text style={styles.startSmallText}>Start</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.muscleRow}>
        {template.targetMuscles.map((muscle) => (
          <View key={muscle} style={styles.muscleChip}>
            <Text style={styles.muscleText}>{muscle}</Text>
          </View>
        ))}
      </View>
      <View style={styles.exerciseList}>
        {template.exercises.map((ex) => (
          <Text key={ex.id} style={styles.exerciseItem}>
            • {ex.name} — {ex.sets}×{ex.repsMin}-{ex.repsMax}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function WorkoutScreen() {
  const navigation = useNavigation<any>();
  const { templates, sessions, startSession } = useWorkoutStore();
  const recentSessions = sessions
    .filter((s) => s.completedAt)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleStart = (template: WorkoutTemplate) => {
    startSession(template);
    navigation.navigate('LogWorkout');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Workouts</Text>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            {recentSessions.map((session) => (
              <View key={session.id} style={styles.recentCard}>
                <View>
                  <Text style={styles.recentName}>
                    {session.templateName}
                  </Text>
                  <Text style={styles.recentDate}>
                    {new Date(session.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <Text style={styles.recentSets}>
                  {session.sets.length} sets
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Templates</Text>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onStart={() => handleStart(template)}
            />
          ))}
        </View>

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
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  templateCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  templateMeta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  startSmall: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  startSmallText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  muscleChip: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  muscleText: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
    textTransform: 'capitalize',
  },
  exerciseList: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  exerciseItem: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  recentCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  recentName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  recentDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  recentSets: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 100,
  },
});
