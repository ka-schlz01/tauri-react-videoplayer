import { Api } from '../services/api';
import {create} from "zustand/react";

type Theme = string;

type SettingsState = {
  theme: Theme | null;
  showThumbnails: boolean | null;
  defaultView: 'list' | 'grid' | null;
  values: Record<string, string>;
  setTheme: (t: Theme) => Promise<void>;
  setShowThumbnails: (v: boolean) => Promise<void>;
  setDefaultView: (v: 'list' | 'grid') => Promise<void>;
  setSetting: (key: string, value: string) => Promise<void>;
  setAll: (values: Record<string, string>) => Promise<void>;
};

const api = new Api();

function applyThemeToDom(theme: Theme) {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: null,
  showThumbnails: null,
  defaultView: null,
  values: {},
  async setTheme(t: Theme) {
    applyThemeToDom(t);
    await api.setSetting('theme', t);
    set({ theme: t, values: { ...get().values, theme: t } });
  },

  async setShowThumbnails(v: boolean) {
    const str = v ? '1' : '0';
    await api.setSetting('show_thumbnails', str);
    const next = { ...get().values, show_thumbnails: str };
    set({ values: next, showThumbnails: v });
  },

  async setDefaultView(v: 'list' | 'grid') {
    await api.setSetting('default_view', v);
    const next = { ...get().values, default_view: v };
    set({ values: next, defaultView: v });
  },

  async setSetting(key: string, value: string) {
    await api.setSetting(key, value);
    const next = { ...get().values, [key]: value };
    if (key === 'theme' && (value === 'dark' || value === 'light')) {
      applyThemeToDom(value as Theme);
      try { localStorage.setItem('theme', value); } catch {}
    }
    set({ values: next, theme: next['theme'] ?? get().theme });
  },

  async setAll(values: Record<string, string>) {
    if (values.theme === 'dark' || values.theme === 'light') {
      applyThemeToDom(values.theme as Theme);
      try { localStorage.setItem('theme', values.theme); } catch {}
    }
    const showThumbnails = values.show_thumbnails === '1' ? true : (values.show_thumbnails === '0' ? false : null);
    const defaultView = (values.default_view === 'grid' || values.default_view === 'list') ? (values.default_view as 'list' | 'grid') : null;
    set({ values, theme: (values.theme as Theme) ?? null, showThumbnails, defaultView });
  },
}));

export default useSettingsStore;
