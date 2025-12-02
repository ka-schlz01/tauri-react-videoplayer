use rusqlite::params;
use tauri_plugin_dialog::{DialogExt, FilePath};

use crate::db::database;
use crate::db::model::{Video, Setting};
use std::path::Path;
use std::fs;

#[tauri::command]
pub fn open_file_dialog(app: tauri::AppHandle) -> Option<FilePath> {
    let file_path = app.dialog().file().blocking_pick_file();

    file_path
}

// Einfacher test-command, falls `greet` noch erwartet wird
#[tauri::command]
pub fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
pub fn list_videos() -> Result<Vec<Video>, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos ORDER BY COALESCE(last_watched, added_at) DESC")
        .map_err(|e| e.to_string())?;

    let video_iter = stmt
        .query_map([], |row| {
            Ok(Video {
                id: row.get(0)?,
                uuid: row.get(1)?,
                path: row.get(2)?,
                title: row.get(3)?,
                duration: row.get(4)?,
                rating: row.get(5)?,
                watch_count: row.get(6)?,
                favorite: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut videos = Vec::new();
    for vid in video_iter {
        videos.push(vid.map_err(|e| e.to_string())?);
    }
    Ok(videos)
}

#[tauri::command]
pub fn pick_folder(app: tauri::AppHandle) -> Result<Option<String>, String> {
    match rfd::FileDialog::new().pick_folder() {
        Some(path_buf) => Ok(Some(path_buf.to_string_lossy().to_string())),
        None => Ok(None),
    }
}

#[tauri::command]
pub fn read_dir_recursive(path: String) -> Result<Vec<String>, String> {
    let mut result: Vec<String> = Vec::new();
    let start = Path::new(&path);
    if !start.exists() {
        return Err("Path does not exist".to_string());
    }

    let exts = [".mp4", ".mkv", ".mov", ".webm", ".avi", ".flv", ".m4v", ".ts", ".m2ts", ".wmv", ".mp3"];

    fn walk_dir(p: &Path, exts: &[&str], out: &mut Vec<String>) -> std::io::Result<()> {
        for entry in fs::read_dir(p)? {
            let e = entry?;
            let path = e.path();
            if path.is_dir() {
                let _ = walk_dir(&path, exts, out);
            } else if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                let lower = name.to_lowercase();
                if exts.iter().any(|ext| lower.ends_with(ext)) {
                    if let Some(s) = path.to_str() {
                        out.push(s.to_string());
                    }
                }
            }
        }
        Ok(())
    }

    match walk_dir(start, &exts, &mut result) {
        Ok(_) => Ok(result),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn list_recent(limit: Option<i64>, offset: Option<i64>) -> Result<Vec<Video>, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;

    let mut videos: Vec<Video> = Vec::new();

    match (limit, offset) {
        (Some(l), Some(o)) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE last_watched IS NOT NULL ORDER BY last_watched DESC LIMIT ?1 OFFSET ?2")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map(params![l, o], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
        (Some(l), None) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE last_watched IS NOT NULL ORDER BY last_watched DESC LIMIT ?1")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map(params![l], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
        (None, Some(o)) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE last_watched IS NOT NULL ORDER BY last_watched DESC LIMIT -1 OFFSET ?1")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map(params![o], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
        (None, None) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE last_watched IS NOT NULL ORDER BY last_watched DESC")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map([], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
    }

    Ok(videos)
}

#[tauri::command]
pub fn list_favorites(limit: Option<i64>, offset: Option<i64>) -> Result<Vec<Video>, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;

    let mut videos: Vec<Video> = Vec::new();

    match (limit, offset) {
        (Some(l), Some(o)) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE favorite = 1 ORDER BY COALESCE(last_watched, added_at) DESC LIMIT ?1 OFFSET ?2")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map(params![l, o], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
        (Some(l), None) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE favorite = 1 ORDER BY COALESCE(last_watched, added_at) DESC LIMIT ?1")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map(params![l], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
        (None, Some(o)) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE favorite = 1 ORDER BY COALESCE(last_watched, added_at) DESC LIMIT -1 OFFSET ?1")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map(params![o], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
        (None, None) => {
            let mut stmt = conn
                .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE favorite = 1 ORDER BY COALESCE(last_watched, added_at) DESC")
                .map_err(|e| e.to_string())?;
            let iter = stmt
                .query_map([], |row| {
                    Ok(Video {
                        id: row.get(0)?,
                        uuid: row.get(1)?,
                        path: row.get(2)?,
                        title: row.get(3)?,
                        duration: row.get(4)?,
                        rating: row.get(5)?,
                        watch_count: row.get(6)?,
                        favorite: row.get(7)?,
                    })
                })
                .map_err(|e| e.to_string())?;
            for v in iter {
                videos.push(v.map_err(|e| e.to_string())?);
            }
        }
    }

    Ok(videos)
}

#[tauri::command]
pub fn get_video(id: i64) -> Result<Option<Video>, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    let mut rows = stmt
        .query_map(params![id], |row| {
            Ok(Video {
                id: row.get(0)?,
                uuid: row.get(1)?,
                path: row.get(2)?,
                title: row.get(3)?,
                duration: row.get(4)?,
                rating: row.get(5)?,
                watch_count: row.get(6)?,
                favorite: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    if let Some(result) = rows.next() {
        let v = result.map_err(|e| e.to_string())?;
        Ok(Some(v))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub fn add_video(path: String, title: Option<String>, duration: Option<i64>) -> Result<Video, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    let uuid = uuid::Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO videos (uuid, path, title, duration) VALUES (?1, ?2, ?3, ?4)",
        params![uuid, path, title, duration],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    Ok(Video {
        id,
        uuid,
        path,
        title,
        duration,
        rating: None,
        watch_count: 0,
        favorite: 0,
    })
}

#[tauri::command]
pub fn increment_view(id: i64) -> Result<(), String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE videos SET watch_count = watch_count + 1, last_watched = datetime('now') WHERE id = ?1",
        params![id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn add_like(id: i64) -> Result<(), String> {
    increment_view(id)
}

#[tauri::command]
pub fn add_rating(id: i64, rating: f32) -> Result<(), String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    conn.execute("UPDATE videos SET rating = ?1 WHERE id = ?2", params![rating, id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_video_duration_by_path(path: String, duration: i64) -> Result<(), String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE videos SET duration = ?1 WHERE path = ?2",
        params![duration, path],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_video(id: i64) -> Result<(), String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM videos WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn set_favorite(id: i64, favorite: bool) -> Result<(), String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    let f = if favorite { 1 } else { 0 };
    conn.execute("UPDATE videos SET favorite = ?1 WHERE id = ?2", params![f, id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_video_by_path(path: String) -> Result<Option<Video>, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, uuid, path, title, duration, rating, watch_count, favorite FROM videos WHERE path = ?1")
        .map_err(|e| e.to_string())?;

    let mut rows = stmt
        .query_map(params![path], |row| {
            Ok(Video {
                id: row.get(0)?,
                uuid: row.get(1)?,
                path: row.get(2)?,
                title: row.get(3)?,
                duration: row.get(4)?,
                rating: row.get(5)?,
                watch_count: row.get(6)?,
                favorite: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    if let Some(result) = rows.next() {
        let v = result.map_err(|e| e.to_string())?;
        Ok(Some(v))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub fn confirm_dialog(app: tauri::AppHandle, title: String, message: String) -> Result<bool, String> {
    let result = rfd::MessageDialog::new()
        .set_title(&title)
        .set_description(&message)
        .set_buttons(rfd::MessageButtons::YesNo)
        .show();

    let ok = matches!(result, rfd::MessageDialogResult::Yes);
    Ok(ok)
}

#[tauri::command]
pub fn get_setting(key: String) -> Result<Option<String>, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    match conn.query_row("SELECT value FROM settings WHERE key = ?1", params![key], |row| row.get::<_, String>(0)) {
        Ok(v) => Ok(Some(v)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn set_setting(key: String, value: String) -> Result<(), String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        params![key, value],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn list_settings() -> Result<Vec<Setting>, String> {
    let conn = database::get_connection().lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT key, value FROM settings ORDER BY key ASC")
        .map_err(|e| e.to_string())?;

    let iter = stmt
        .query_map([], |row| Ok(Setting { key: row.get(0)?, value: row.get(1)? }))
        .map_err(|e| e.to_string())?;

    let mut out = Vec::new();
    for s in iter {
        out.push(s.map_err(|e| e.to_string())?);
    }
    Ok(out)
}
