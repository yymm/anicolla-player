mod config;
mod consts;
mod crawler;
mod model;
mod scraper;

extern crate dotenv;

use crate::config::Config;
// use crate::crawler::Crawler;
use crate::scraper::Scraper;
use dotenv::dotenv;
use model::Record;
use rusqlite::Connection;
use std::env;
// use log::{info, warn, trace, debug};
use anyhow::Result;

fn main() -> Result<()> {
    if env::var("ENV").unwrap_or_else(|_| "development".to_string()) == "development" {
        dotenv().ok();
    }
    env_logger::init();

    let config = Config::from_env();

    // let crawler = Crawler {};
    // let raw_data = crawler.fetch_raw_data()?;
    // crawler.save_data(raw_data)?;

    let conn = Connection::open(config.sqlite_database)?;

    Record::create_table(&conn)?;
    Record::delete_all_records(&conn)?;

    let scraper = Scraper {};
    let loaded_data = scraper.load_data(&config.list_html_path)?;
    let preprocessed_data = scraper.preprocessing(loaded_data);
    let _ = scraper.scraping(&preprocessed_data, &conn)?;

    let loaded_data = scraper.load_data(&config.top_html_path)?;
    let preprocessed_data = scraper.preprocessing(loaded_data);
    let _ = scraper.scraping(&preprocessed_data, &conn)?;

    Ok(())
}
