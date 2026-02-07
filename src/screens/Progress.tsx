import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useProgressStore } from '../store/useProgressStore';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { TrendChart } from '../components/TrendChart';
import { PhotoCard } from '../components/PhotoCard';
import { WeighIn } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

export function ProgressScreen() {
  const { weighIns, photos, addWeighIn, getWeightTrend, getLatestWeight } =
    useProgressStore();
  const { sessions } = useWorkoutStore();
  const [weightInput, setWeightInput] = useState('');
  const [showWeightInput, setShowWeightInput] = useState(false);

  const weightTrend = getWeightTrend();
  const latestWeight = getLatestWeight();
  const completedSessions = sessions.filter((s) => s.completedAt);

  const handleAddWeight = () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight)) return;

    const now = new Date();
    const newWeighIn: WeighIn = {
      id: `w-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      weight,
      createdAt: now.toISOString(),
    };
    addWeighIn(newWeighIn);
    setWeightInput('');
    setShowWeightInput(false);
  };

  // Simple stats
  const totalWorkouts = completedSessions.length;
  const totalSets = completedSessions.reduce(
    (sum, s) => sum + s.sets.length,
    0
  );
  const firstWeight = weighIns.length > 0 ? weighIns[0].weight : null;
  const weightChange =
    latestWeight && firstWeight ? latestWeight - firstWeight : null;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Progress</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>Total Sets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {latestWeight ? `${latestWeight}` : '--'}
            </Text>
            <Text style={styles.statLabel}>Current lbs</Text>
          </View>
        </View>

        {/* Weight Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weight Trend</Text>
            <TouchableOpacity
              onPress={() => setShowWeightInput(!showWeightInput)}
            >
              <Text style={styles.addText}>+ Log Weight</Text>
            </TouchableOpacity>
          </View>

          {showWeightInput && (
            <View style={styles.weightInputRow}>
              <TextInput
                style={styles.weightInput}
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="numeric"
                placeholder="Weight in lbs"
                placeholderTextColor={Colors.textMuted}
                autoFocus
              />
              <TouchableOpacity
                style={styles.weightSave}
                onPress={handleAddWeight}
              >
                <Text style={styles.weightSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.chartCard}>
            <TrendChart data={weightTrend} />
            {weightChange !== null && (
              <Text
                style={[
                  styles.changeText,
                  { color: weightChange <= 0 ? Colors.success : Colors.danger },
                ]}
              >
                {weightChange > 0 ? '+' : ''}
                {weightChange.toFixed(1)} lbs overall
              </Text>
            )}
          </View>

          {/* Weight History */}
          <View style={styles.historyList}>
            {[...weighIns]
              .reverse()
              .slice(0, 10)
              .map((w) => (
                <View key={w.id} style={styles.historyRow}>
                  <Text style={styles.historyDate}>
                    {new Date(w.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.historyValue}>{w.weight} lbs</Text>
                </View>
              ))}
          </View>
        </View>

        {/* Progress Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress Photos</Text>
            <TouchableOpacity>
              <Text style={styles.addText}>+ Add Photo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoRow}
          >
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
            {photos.length === 0 && (
              <View style={styles.emptyPhoto}>
                <Text style={styles.emptyPhotoText}>
                  Take your first progress photo
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Recent Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout History</Text>
          {completedSessions
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 8)
            .map((session) => (
              <View key={session.id} style={styles.sessionRow}>
                <View>
                  <Text style={styles.sessionName}>
                    {session.templateName}
                  </Text>
                  <Text style={styles.sessionDate}>
                    {new Date(session.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <Text style={styles.sessionSets}>
                  {session.sets.length} sets
                </Text>
              </View>
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  addText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  changeText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  weightInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  weightInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  weightSave: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
  },
  weightSaveText: {
    color: Colors.white,
    fontWeight: '700',
  },
  historyList: {
    marginTop: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  historyDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  historyValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  photoRow: {
    gap: Spacing.md,
  },
  emptyPhoto: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
  },
  emptyPhotoText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  sessionRow: {
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
  sessionName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  sessionDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sessionSets: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 100,
  },
});
