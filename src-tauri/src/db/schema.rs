use rusqlite::{Connection, Result};

pub const CREATE_VIDEOS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS videos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid          TEXT NOT NULL UNIQUE,
    path          TEXT NOT NULL UNIQUE,
    title         TEXT,
    duration      INTEGER,
    added_at      DATETIME DEFAULT (datetime('now')),
    last_watched  DATETIME,
    watch_count   INTEGER DEFAULT 0,
    rating        REAL,
    favorite      INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_path ON videos(path);
CREATE INDEX IF NOT EXISTS idx_title ON videos(title);
CREATE INDEX IF NOT EXISTS idx_rating ON videos(rating);
"#;

pub fn init_schema(conn: &Connection) -> Result<()> {
    conn.execute_batch(CREATE_VIDEOS_TABLE)?;
    Ok(())
}
