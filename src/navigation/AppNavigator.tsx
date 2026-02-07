import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/Home';
import { CheckInScreen } from '../screens/CheckIn';
import { WorkoutScreen } from '../screens/Workout';
import { LogWorkoutScreen } from '../screens/LogWorkout';
import { ProgressScreen } from '../screens/Progress';
import { SettingsScreen } from '../screens/Settings';
import { Colors, FontSize } from '../utils/theme';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const WorkoutStack = createNativeStackNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Workout: '🏋️',
    Progress: '📊',
    Settings: '⚙️',
  };
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={tabStyles.icon}>{icons[label] || '•'}</Text>
      <Text
        style={[
          tabStyles.label,
          focused && tabStyles.labelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: Colors.bg },
          headerTintColor: Colors.text,
        }}
      />
    </HomeStack.Navigator>
  );
}

function WorkoutStackScreen() {
  return (
    <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkoutStack.Screen name="WorkoutMain" component={WorkoutScreen} />
      <WorkoutStack.Screen
        name="LogWorkout"
        component={LogWorkoutScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: Colors.bg },
          headerTintColor: Colors.text,
        }}
      />
    </WorkoutStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.bg,
            borderTopColor: Colors.cardBorder,
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 20,
            paddingTop: 8,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Home" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="WorkoutTab"
          component={WorkoutStackScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Workout" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="ProgressTab"
          component={ProgressScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Progress" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Settings" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
