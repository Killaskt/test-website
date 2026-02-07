import { create } from 'zustand';
import { UserProfile, CheckIn } from '../types';
import { SAMPLE_USER, SAMPLE_CHECKINS } from '../logic/sampleData';

interface UserState {
  profile: UserProfile;
  checkins: CheckIn[];
  setProfile: (profile: UserProfile) => void;
  addCheckin: (checkin: CheckIn) => void;
  getTodayCheckin: () => CheckIn | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: SAMPLE_USER,
  checkins: SAMPLE_CHECKINS,

  setProfile: (profile) => set({ profile }),

  addCheckin: (checkin) =>
    set((state) => {
      // Replace if same date exists
      const filtered = state.checkins.filter((c) => c.date !== checkin.date);
      return { checkins: [...filtered, checkin] };
    }),

  getTodayCheckin: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().checkins.find((c) => c.date === today);
  },
}));
