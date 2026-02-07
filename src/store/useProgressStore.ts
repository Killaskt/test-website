import { create } from 'zustand';
import { WeighIn, ProgressPhoto } from '../types';
import { SAMPLE_WEIGHINS, SAMPLE_PHOTOS, calculateMovingAverage } from '../logic/sampleData';

interface ProgressState {
  weighIns: WeighIn[];
  photos: ProgressPhoto[];

  addWeighIn: (weighIn: WeighIn) => void;
  addPhoto: (photo: ProgressPhoto) => void;
  getWeightTrend: () => { date: string; weight: number; movingAverage: number }[];
  getLatestWeight: () => number | null;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  weighIns: SAMPLE_WEIGHINS,
  photos: SAMPLE_PHOTOS,

  addWeighIn: (weighIn) =>
    set((state) => ({
      weighIns: [...state.weighIns, weighIn].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    })),

  addPhoto: (photo) =>
    set((state) => ({
      photos: [...state.photos, photo].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    })),

  getWeightTrend: () => {
    return calculateMovingAverage(get().weighIns);
  },

  getLatestWeight: () => {
    const weighIns = get().weighIns;
    return weighIns.length > 0 ? weighIns[weighIns.length - 1].weight : null;
  },
}));
