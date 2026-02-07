// Core domain types for the fitness app MVP

export interface UserProfile {
  id: string;
  name: string;
  currentPhase: string;
  phaseWeek: number;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  energy: 1 | 2 | 3 | 4 | 5;
  mood?: 'great' | 'good' | 'okay' | 'low' | 'bad';
  soreness: string[]; // body part chips
  intent: 'train' | 'light' | 'rest';
  createdAt: string;
}

export interface WeighIn {
  id: string;
  date: string;
  weight: number; // lbs or kg
  createdAt: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  uri: string;
  label?: string;
  createdAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  targetMuscles: string[];
  estimatedMinutes: number;
  exercises: ExerciseTemplate[];
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  templateName: string;
  date: string;
  startedAt: string;
  completedAt?: string;
  sets: LoggedSet[];
}

export interface LoggedSet {
  id: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number; // rate of perceived exertion 1-10
}

export interface MomentumScore {
  total: number; // 0-100
  consistency: number; // 0-100
  checkins: number; // 0-100
  recovery: number; // 0-100
  engagement: number; // 0-100
}

export interface Insight {
  id: string;
  text: string;
  type: 'progress' | 'recovery' | 'consistency' | 'strength' | 'tip';
  priority: number;
}

export interface TodayPlan {
  workout: WorkoutTemplate | null;
  isRestDay: boolean;
  suggestion: string;
  estimatedMinutes: number;
}

export interface WeightTrend {
  date: string;
  weight: number;
  movingAverage: number;
}

export interface StrengthTrend {
  date: string;
  exercise: string;
  estimatedOneRepMax: number;
}
