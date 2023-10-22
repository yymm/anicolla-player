// use crate::model::Record;
use crate::consts::{REQWEST_TARGET_URL, SAVE_FILE_NAME};
use bytes::Bytes;
use encoding_rs;
use reqwest::blocking::Client;
use reqwest::{header::USER_AGENT, StatusCode};
use std::fs::OpenOptions;
use std::io::prelude::*;
use std::time::Duration;
use thiserror::Error;

const REQWEST_TIMEOUT: u64 = 10;

#[derive(Error, Debug)]
pub enum CrawlerError {
    #[error("received non-successful HTTP status: {0}")]
    HttpStatus(StatusCode),
    #[error("reqwest error: {0}")]
    Reqwest(#[from] reqwest::Error),
}

#[derive(Clone, Copy)]
pub struct Crawler;

// 残念ながらrustでcp932のファイルをうまく扱うことができなかったので使用不可です
impl Crawler {
    pub fn fetch_raw_data(self) -> Result<Bytes, CrawlerError> {
        let client = Client::builder()
            .timeout(Duration::from_secs(REQWEST_TIMEOUT))
            .build()?;

        let resp = client
            .get(REQWEST_TARGET_URL)
            .header(USER_AGENT, "anicolla crawler")
            .send()?;

        if !resp.status().is_success() {
            return Err(CrawlerError::HttpStatus(resp.status()));
        }

        let bytes = resp.bytes()?;
        Ok(bytes)
    }

    pub fn save_data(self, raw_data: Bytes) -> std::io::Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .append(false)
            .open(SAVE_FILE_NAME)?;

        let (decoded_data, _, _) = encoding_rs::SHIFT_JIS.decode(&raw_data);
        writeln!(file, "{}", decoded_data)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fetch_raw_data() {
        let crawler = Crawler {};
        // TODO: oh... external dependency is bad practice for testing...
        let result = crawler.fetch_raw_data();
        assert_eq!(result.is_ok(), true);
    }
}
