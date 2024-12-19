import {invoke} from '@tauri-apps/api/core';

export class Api {
    openFileDialog() {
        return invoke('open_file_dialog');
    }
}
