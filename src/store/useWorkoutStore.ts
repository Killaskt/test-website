import { create } from 'zustand';
import { WorkoutTemplate, WorkoutSession, LoggedSet } from '../types';
import { SAMPLE_TEMPLATES, SAMPLE_SESSIONS } from '../logic/sampleData';

interface WorkoutState {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;

  addTemplate: (template: WorkoutTemplate) => void;
  startSession: (template: WorkoutTemplate) => void;
  logSet: (set: LoggedSet) => void;
  finishSession: () => void;
  cancelSession: () => void;
  getCompletedSessions: () => WorkoutSession[];
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  templates: SAMPLE_TEMPLATES,
  sessions: SAMPLE_SESSIONS,
  activeSession: null,

  addTemplate: (template) =>
    set((state) => ({ templates: [...state.templates, template] })),

  startSession: (template) => {
    const now = new Date();
    const session: WorkoutSession = {
      id: `sess-${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      date: now.toISOString().split('T')[0],
      startedAt: now.toISOString(),
      sets: [],
    };
    set({ activeSession: session });
  },

  logSet: (newSet) =>
    set((state) => {
      if (!state.activeSession) return state;
      return {
        activeSession: {
          ...state.activeSession,
          sets: [...state.activeSession.sets, newSet],
        },
      };
    }),

  finishSession: () =>
    set((state) => {
      if (!state.activeSession) return state;
      const completed: WorkoutSession = {
        ...state.activeSession,
        completedAt: new Date().toISOString(),
      };
      return {
        sessions: [...state.sessions, completed],
        activeSession: null,
      };
    }),

  cancelSession: () => set({ activeSession: null }),

  getCompletedSessions: () => {
    return get().sessions.filter((s) => s.completedAt);
  },
}));
