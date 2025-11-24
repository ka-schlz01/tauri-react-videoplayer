# tauri-react-videoplayer

A simple, elegant Video Player built with React and Tauri (Rust). This project demonstrates a native-desktop video player using a React frontend bundled into a Tauri shell — perfect for showcasing modern web + native tooling.

**Demo**
- **Web**: Run the app in the browser with `npm run dev`.
- **Desktop**: Run a native build with `npm run tauri -- dev`.

**Features**
- **Play local videos**: Open and play local video files using the platform file dialog.
- **Common controls**: Play/Pause, Seek, Volume, Fullscreen, and a clean control bar.
- **Keyboard shortcuts**: Space (play/pause), arrow keys (seek), `F` (fullscreen), `M` (mute).
- **Responsive UI**: Scales from small windows to fullscreen.

**Tech Stack**
- **Frontend**: React, TypeScript, Vite, Tailwind
- **Player**: `react-player` for consistent playback controls
- **UI**: NextUI + react-icons
- **Desktop**: Tauri (Rust) for a lightweight native wrapper

**Getting Started**

- **Prerequisites**:
  - Node.js (LTS) and a package manager (`npm`/`pnpm`/`yarn`).
  - Rust toolchain (`rustup`, `cargo`). On Windows, install the Visual Studio Build Tools / MSVC toolchain. See Tauri docs: https://tauri.app/

- **Install dependencies**:

```powershell
npm install
```

- **Run (web-only development server)**:

```powershell
npm run dev
```

- **Run (native desktop with Tauri - development)**:

```powershell
npm run tauri -- dev
```

- **Build for production**:

```powershell
npm run build
npm run tauri -- build
```

Notes:
- `npm run build` runs the TypeScript compiler and builds the frontend assets. `tauri build` bundles the native app.

**Usage**
- Open a video file via the UI file dialog (or drag & drop if supported).
- Use the control bar to seek, change volume, toggle fullscreen, and play/pause.
- Keyboard shortcuts make playback fast and accessible.

**Contributing**
- Contributions and suggestions are welcome. Open an issue or submit a pull request.

**Contact / Showcase**
- Repository: https://github.com/ka-schlz01/tauri-react-videoplayer

**License**
- This project is free to use. Add your preferred license (e.g., MIT) in `LICENSE`.

---


