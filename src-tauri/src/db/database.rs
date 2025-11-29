use std::fs;
use std::path::PathBuf;
use rusqlite::{Connection, Result};
use crate::db::schema::init_schema;

pub fn init_db() -> Result<Connection> {
    let db_path = get_db_path();

    let conn = Connection::open(&db_path)?;
    init_schema(&conn)?;
    Ok(conn)
}

pub fn get_db_path() -> PathBuf {
    let mut path = if cfg!(target_os = "windows") {
        std::env::var("APPDATA").unwrap().into()
    } else {
        let home = std::env::var("HOME").unwrap();
        let mut p = PathBuf::from(&home);
        p.push(".config");
        p
    };
    path.push("tauri-react-videoplayer");
    let _ = fs::create_dir_all(&path);
    path.push("videos.db");
    path
}
