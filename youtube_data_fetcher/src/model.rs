use rusqlite::Connection;

#[derive(Debug, Default)]
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

impl YoutubeRecord {
    pub fn create_table(conn: &Connection) -> rusqlite::Result<()> {
        conn.execute(
            "CREATE TABLE IF NOT EXISTS youtube_record (
            id INTEGER PRIMARY KEY,
            playlist_id TEXT,
            playlist_title TEXT,
            season_key TEXT,
            video_id TEXT NOT NULL,
            video_title TEXT NOT NULL,
            anime_title TEXT NOT NULL,
            song_title TEXT NOT NULL,
            op_or_ed TEXT NOT NULL,
            video_description TEXT NOT NULL
        )",
            (),
        )?;
        Ok(())
    }

    pub fn insert(conn: &Connection, record: &YoutubeRecord) -> rusqlite::Result<()> {
        conn.execute(
            "INSERT INTO youtube_record
            (playlist_id, playlist_title, season_key, video_id, video_title, anime_title, song_title, op_or_ed, video_description)
            VALUES
            (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        ",
            (
                &record.playlist_id,
                &record.playlist_title,
                &record.season_key,
                &record.video_id,
                &record.video_title,
                &record.anime_title,
                &record.song_title,
                &record.op_or_ed,
                &record.video_description,
            ),
        )?;
        Ok(())
    }

    pub fn delete_all_records(conn: &Connection) -> rusqlite::Result<()> {
        conn.execute("DELETE FROM youtube_record", ())?;
        Ok(())
    }
}
