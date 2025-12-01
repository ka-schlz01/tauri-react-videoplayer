use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use rusqlite::{Connection, Result};
use once_cell::sync::OnceCell;
use crate::db::schema::init_schema;

// Global singleton for the SQLite connection. Wrapped in a Mutex to allow interior
// mutability across threads. We initialize it lazily on first access.
static DB_CONN: OnceCell<Mutex<Connection>> = OnceCell::new();

pub fn init_db() -> Result<Connection> {
    // Backwards-compatible: open a new connection (same as before)
    let db_path = get_db_path();
    let conn = Connection::open(&db_path)?;
    init_schema(&conn)?;
    Ok(conn)
}

pub fn get_connection() -> &'static Mutex<Connection> {
    DB_CONN.get_or_init(|| {
        let db_path = get_db_path();
        let conn = Connection::open(&db_path).expect("Failed to open database");
        // ensure schema exists
        init_schema(&conn).expect("Failed to initialize DB schema");
        Mutex::new(conn)
    })
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
