use rusqlite::Connection;
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
pub struct Record {
    pub id: u32,
    pub season_key: String,
    pub season_title: String,
    pub song_order: u64,
    pub anime_title: String,
    pub song_title: String,
    pub op_or_ed_raw: String,
    pub op_or_ed: String,
    pub vocal: Option<String>,
    pub guiter: Option<String>,
    pub key: Option<String>,
    pub violin: Option<String>,
    pub bass: Option<String>,
    pub drum: Option<String>,
    pub mix: Option<String>,
    pub mastering: Option<String>,
    pub movie: Option<String>,
}

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
pub struct YoutubeRecord {
    pub id: u32,
    pub playlist_id: String,
    pub playlist_title: String,
    pub season_key: String,
    pub video_id: String,
    pub video_title: String,
    pub anime_title: String,
    pub song_title: String,
    pub op_or_ed: String,
    pub video_description: String,
}

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
pub struct FixedRecord {
    pub id: u32,
    pub record_id: u32,
    pub youtube_record_id: u32,
    pub season_key: String,
    pub playlist_id: String,
    pub playlist_title: String,
    pub video_id: String,
    pub video_title: String,
    pub video_description: String,
    pub anime_title: String,
    pub song_title: String,
    pub song_order: u64,
    pub op_or_ed: String,
    pub vocal: Option<String>,
    pub guiter: Option<String>,
    pub key: Option<String>,
    pub violin: Option<String>,
    pub bass: Option<String>,
    pub drum: Option<String>,
    pub mix: Option<String>,
    pub mastering: Option<String>,
    pub movie: Option<String>,
}

// impl FixedRecord {
//     pub fn create_table(conn: &Connection) -> rusqlite::Result<()> {
//         conn.execute(
//             "CREATE TABLE IF NOT EXISTS fixed_record (
//             id INTEGER PRIMARY KEY,
//             record_id INTEGER NOT NULL,
//             youtube_record_id INTEGER NOT NULL,
//             season_key TEXT NOT NULL,
//             playlist_id TEXT NOT NULL,
//             playlist_title TEXT NOT NULL,
//             video_id TEXT NOT NULL,
//             video_title TEXT NOT NULL,
//             video_description TEXT NOT NULL,
//             anime_title TEXT NOT NULL,
//             song_title TEXT NOT NULL,
//             song_order INTEGER NOT NULL,
//             op_or_ed TEXT NOT NULL,
//             vocal TEXT,
//             guiter TEXT,
//             key TEXT,
//             violin TEXT,
//             bass TEXT,
//             drum TEXT,
//             mix TEXT,
//             mastering TEXT,
//             movie TEXT
//         )",
//             (),
//         )?;
//         Ok(())
//     }
// 
//     pub fn insert(conn: &Connection, record: FixedRecord) -> rusqlite::Result<()> {
//         conn.execute("INSERT INTO fixed_record
//             (record_id, youtube_record_id, season_key, playlist_id, playlist_title, video_id, video_title, video_description, anime_title, song_title, song_order, op_or_ed, vocal, guiter, key, violin, bass, drum, mix, mastering, movie)
//             VALUES
//             (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21)
//         ", (&record.record_id, &record.youtube_record_id, &record.season_key, &record.playlist_id, &record.playlist_title, &record.video_id, &record.video_title, &record.video_description, &record.anime_title, &record.song_title, &record.song_order, &record.op_or_ed, &record.vocal, &record.guiter, &record.key, &record.violin, &record.bass, &record.drum, &record.mix, &record.mastering, &record.movie))?;
//         Ok(())
//     }
// 
//     pub fn delete_all_records(conn: &Connection) -> rusqlite::Result<()> {
//         conn.execute("DELETE FROM fixed_record", ())?;
//         Ok(())
//     }
// }
