use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Video {
    pub id: i64,
    pub uuid: String,
    pub path: String,
    pub title: Option<String>,
    pub duration: Option<i64>,
    pub rating: Option<f32>,
    pub watch_count: i64,
    pub favorite: i64,
}
