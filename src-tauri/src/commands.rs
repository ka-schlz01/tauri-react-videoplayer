use tauri_plugin_dialog::{DialogExt, FilePath};

#[tauri::command]
pub fn open_file_dialog(app: tauri::AppHandle) -> Option<FilePath> {
    let file_path = app.dialog().file().blocking_pick_file();
    return file_path;
}
