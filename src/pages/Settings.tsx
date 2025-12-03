import React from 'react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import useSettingsStore from '../stores/settingsStore';

export default function Settings() {
  const theme = useSettingsStore((state: any) => state.theme) ?? 'dark';
  const setTheme = useSettingsStore((state: any) => state.setTheme);
  const showThumbnails = useSettingsStore((state: any) => state.showThumbnails) ?? false;
  const setShowThumbnails = useSettingsStore((state: any) => state.setShowThumbnails);
  const defaultView = useSettingsStore((state: any) => state.defaultView) ?? 'list';
  const setDefaultView = useSettingsStore((state: any) => state.setDefaultView);

  function onThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const t = e.target.value === 'dark' ? 'dark' : 'light';
    setTheme(t).catch(() => {});
  }

  function onShowThumbnailsChange(v: boolean) {
    setShowThumbnails(v).catch(() => {});
  }

  function onDefaultViewChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value === 'grid' ? 'grid' : 'list';
    setDefaultView(v).catch(() => {});
  }

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      <section className="mb-6">
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5">
          <h3 className="text-lg font-medium mb-4">Appearance</h3>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-sm text-muted-foreground">Theme</div>
              <div className="mt-2">
                <select value={theme} onChange={onThemeChange} className="rounded-md bg-background px-3 py-2 border border-white/5">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Default view mode</div>
              <div className="mt-2">
                <select value={defaultView} onChange={onDefaultViewChange} className="rounded-md bg-background px-3 py-2 border border-white/5">
                  <option value="list">List</option>
                  <option value="grid">Grid</option>
                </select>
              </div>
            </div>
            <div className="col-span-2 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">Show thumbnails</div>
                  <div className="text-xs text-muted-foreground">Display video thumbnails in library</div>
                </div>
                <Switch checked={showThumbnails} onCheckedChange={onShowThumbnailsChange} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-6">
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5">
          <h3 className="text-lg font-medium mb-4">Playback</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Auto-play next video</div>
              <div className="mt-2"><Switch /></div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Continue where you left off</div>
              <div className="mt-2"><Switch /></div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Default quality</div>
              <div className="mt-2">
                <select className="rounded-md bg-background px-3 py-2 border border-white/5">
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                </select>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Playback speed</div>
              <div className="mt-2">
                <select className="rounded-md bg-background px-3 py-2 border border-white/5">
                  <option>1x</option>
                  <option>1.25x</option>
                  <option>1.5x</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-6">
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5">
          <h3 className="text-lg font-medium mb-4">Audio & Subtitles</h3>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-sm text-muted-foreground">Default volume</div>
              <div className="mt-2 flex items-center gap-3">
                <Input className="w-48" defaultValue="80%" />
                <div className="text-sm text-muted-foreground">80%</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Auto-load subtitles</div>
              <div className="mt-2"><Switch /></div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Subtitle language</div>
              <div className="mt-2">
                <select className="rounded-md bg-background px-3 py-2 border border-white/5">
                  <option>English</option>
                </select>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Subtitle size</div>
              <div className="mt-2">
                <select className="rounded-md bg-background px-3 py-2 border border-white/5">
                  <option>Small</option>
                  <option>Medium</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-6">
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5">
          <h3 className="text-lg font-medium mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-muted-foreground">Play/Pause</div>
            <div className="text-sm">Space</div>
            <div className="text-sm text-muted-foreground">Skip Forward</div>
            <div className="text-sm">→</div>
            <div className="text-sm text-muted-foreground">Skip Backward</div>
            <div className="text-sm">←</div>
            <div className="text-sm text-muted-foreground">Fullscreen</div>
            <div className="text-sm">F</div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5">
          <h3 className="text-lg font-medium mb-4">Library</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Default library folder</div>
              <div className="text-sm">~/Videos</div>
            </div>
            <Button>Change</Button>
          </div>
        </div>
      </section>
      <section className="mb-6">
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5">
          <h3 className="text-lg font-medium mb-4">Privacy</h3>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-sm text-muted-foreground">Remember playback position</div>
            </div>
            <div><Switch /></div>
            <div>
              <div className="text-sm text-muted-foreground">Track watch history</div>
            </div>
            <div><Switch /></div>
          </div>
        </div>
      </section>
      <section>
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5">
          <h3 className="text-lg font-medium mb-4">Advanced</h3>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="text-sm text-muted-foreground">Hardware acceleration</div>
            <div><Switch /></div>
            <div className="text-sm text-muted-foreground">Show file extensions</div>
            <div><Switch /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
