mod config;
mod model;
mod request;

use crate::config::Config;
use crate::model::YoutubeRecord;
use crate::request::get_playlist;
use crate::request::get_playlist_item;
use anyhow::Error;
use rusqlite::Connection;

fn main() -> Result<(), Error> {
    let config = Config::from_env();
    let conn = Connection::open(config.sqlite_database)?;

    YoutubeRecord::create_table(&conn)?;
    YoutubeRecord::delete_all_records(&conn)?;

    let playlist_infos = get_playlist()?;
    for playlist_info in playlist_infos.iter() {
        let records = get_playlist_item(&playlist_info.0, &playlist_info.1)?;
        println!("{}: {}", &playlist_info.1, records.len());
        for record in records.iter() {
            YoutubeRecord::insert(&conn, record)?;
        }
    }

    Ok(())
}
