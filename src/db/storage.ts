import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@fitapp_user_profile',
  CHECKINS: '@fitapp_checkins',
  WEIGHINS: '@fitapp_weighins',
  PHOTOS: '@fitapp_photos',
  SESSIONS: '@fitapp_sessions',
  TEMPLATES: '@fitapp_templates',
} as const;

export const storage = {
  async save<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save ${key}:`, e);
    }
  },

  async load<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove ${key}:`, e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  },

  keys: KEYS,
};
