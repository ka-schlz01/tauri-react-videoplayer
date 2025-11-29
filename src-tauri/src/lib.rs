mod commands;
mod db;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(| app | {
            db::database::init_db()?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::open_file_dialog,
            commands::list_videos,
            commands::get_video,
            commands::add_video,
            commands::increment_view,
            commands::add_like,
            commands::add_rating
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
