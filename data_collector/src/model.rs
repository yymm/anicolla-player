use rusqlite::Connection;

#[derive(Debug, Default)]
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

impl Record {
    pub fn create_table(conn: &Connection) -> rusqlite::Result<()> {
        conn.execute(
            "CREATE TABLE IF NOT EXISTS record (
            id INTEGER PRIMARY KEY,
            season_key TEXT NOT NULL,
            season_title TEXT NOT NULL,
            song_order INTEGER,
            anime_title TEXT NOT NULL,
            song_title TEXT NOT NULL,
            op_or_ed_raw TEXT NOT NULL,
            op_or_ed TEXT NOT NULL,
            vocal TEXT,
            guiter TEXT,
            key TEXT,
            violin TEXT,
            bass TEXT,
            drum TEXT,
            mix TEXT,
            mastering TEXT,
            movie TEXT
        )",
            (),
        )?;
        Ok(())
    }

    pub fn insert(conn: &Connection, record: Record) -> rusqlite::Result<()> {
        conn.execute("INSERT INTO record
            (season_key, season_title, song_order, anime_title, song_title, op_or_ed_raw, op_or_ed, vocal, guiter, key, violin, bass, drum, mix, mastering, movie)
            VALUES
            (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)
        ", (&record.season_key, &record.season_title, &record.song_order, &record.anime_title, &record.song_title, &record.op_or_ed_raw, &record.op_or_ed, &record.vocal, &record.guiter, &record.key, &record.violin, &record.bass, &record.drum, &record.mix, &record.mastering, &record.movie))?;
        Ok(())
    }

    pub fn delete_all_records(conn: &Connection) -> rusqlite::Result<()> {
        conn.execute("DELETE FROM record", ())?;
        Ok(())
    }
}
