import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  storeName: string;
  setStoreName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      storeName: 'Durga Pharmacy', // Default name
      setStoreName: (name) => set({ storeName: name }),
    }),
    {
      name: 'mediraksha-settings',
    }
  )
);
