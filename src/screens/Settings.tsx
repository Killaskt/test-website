import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { Colors, FontSize, Spacing, BorderRadius } from '../utils/theme';

export function SettingsScreen() {
  const { profile, setProfile, checkins } = useUserStore();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [editingPhase, setEditingPhase] = useState(false);
  const [phaseInput, setPhaseInput] = useState(profile.currentPhase);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setProfile({ ...profile, name: nameInput.trim() });
    }
    setEditingName(false);
  };

  const handleSavePhase = () => {
    if (phaseInput.trim()) {
      setProfile({ ...profile, currentPhase: phaseInput.trim() });
    }
    setEditingPhase(false);
  };

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Name</Text>
            {editingName ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  onSubmitEditing={handleSaveName}
                />
                <TouchableOpacity onPress={handleSaveName}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Text style={styles.settingValue}>{profile.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Training Phase</Text>
            {editingPhase ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={phaseInput}
                  onChangeText={setPhaseInput}
                  autoFocus
                  onSubmitEditing={handleSavePhase}
                />
                <TouchableOpacity onPress={handleSavePhase}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingPhase(true)}>
                <Text style={styles.settingValue}>
                  {profile.currentPhase}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Phase Week</Text>
            <Text style={styles.settingValue}>Week {profile.phaseWeek}</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Member Since</Text>
            <Text style={styles.settingValue}>{joinDate}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Total Check-ins</Text>
            <Text style={styles.settingValue}>{checkins.length}</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Weight Unit</Text>
            <Text style={styles.settingValue}>lbs</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Rest Timer Sound</Text>
            <Text style={styles.settingValue}>On</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Daily Reminder</Text>
            <Text style={styles.settingValue}>9:00 AM</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0 MVP</Text>
          </View>
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
  settingRow: {
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
  settingLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  settingValue: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '600',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  editInput: {
    backgroundColor: Colors.bg,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
    minWidth: 120,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  saveText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  bottomSpacer: {
    height: 100,
  },
});
