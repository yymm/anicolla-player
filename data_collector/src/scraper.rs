use crate::consts::SAVE_FILE_NAME;
use crate::model::Record;
use log::info;
use rusqlite::Connection;
use rusqlite::Error as RusqliteError;
use scraper::{Html, Selector};
use std::collections::{HashMap, HashSet};
use std::fs::File;
use std::io::{self, Read};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ScraperError {
    #[error("rusqlite error")]
    RusqliteError(),
}

#[derive(Clone, Copy)]
pub struct Scraper;

impl Scraper {
    pub fn load_data(self, file_path: &str) -> io::Result<String> {
        let mut file = File::open(file_path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;
        Ok(contents)
    }

    pub fn preprocessing(self, raw_data: String) -> String {
        return raw_data
            .replace("－", "-")
            .replace("−", "-")
            .replace("〜", "-")
            .replace("～", "-")
            .replace("<br />", ",");
    }

    fn to_model(self, hash_map: HashMap<&str, &&str>) -> Record {
        let mut record = Record::default();

        let convert_to_option_string = |v: &str| -> Option<String> {
            if !v.is_empty() {
                Some(v.to_string())
            } else {
                None
            }
        };

        for (label, value) in hash_map.iter() {
            if label.contains("曲順") {
                record.song_order = value.parse().unwrap();
            } else if label.contains("アニメタイトル") {
                record.anime_title = value.to_string();
            } else if label.contains("OP_OR_ED") {
                record.op_or_ed_raw = value.to_string();
                record.op_or_ed = if value.contains("OP") {
                    "OP".to_string()
                } else {
                    "ED".to_string()
                };
            } else if label.contains("曲名") {
                record.song_title = value.to_string();
            } else if label.contains("Vocal") {
                record.vocal = convert_to_option_string(value);
            } else if label.contains("Guitar") {
                record.guiter = convert_to_option_string(value);
            } else if label.contains("Key") {
                record.key = convert_to_option_string(value);
            } else if label.contains("Violin") {
                record.violin = convert_to_option_string(value);
            } else if label.contains("Bass") {
                record.bass = convert_to_option_string(value);
            } else if label.contains("Drums") {
                record.drum = convert_to_option_string(value);
            } else if label.contains("Mix") {
                record.mix = convert_to_option_string(value);
            } else if label.contains("Mastering") {
                record.mastering = convert_to_option_string(value);
            } else if label.contains("動画編集") {
                record.movie = convert_to_option_string(value);
            }
        }

        record
    }

    pub fn scraping(self, raw_data: &str, conn: &Connection) -> Result<(), ScraperError> {
        let document = Html::parse_document(raw_data);

        let table_selector = Selector::parse("table.list").unwrap();
        let link_selector = Selector::parse("td > a").unwrap();
        let tr_selector = Selector::parse("tr").unwrap();
        let td_song_selector = Selector::parse("td:not(.font_d)").unwrap();
        let mut player_list: Vec<&str> = vec![];

        for table_fragment in document.select(&table_selector) {
            let mut season_key = "";
            let mut season_title = "";
            for a_element in table_fragment.select(&link_selector) {
                if let Some(name) = a_element.value().attr("name") {
                    season_key = name.trim();
                }
                if let Some(text) = a_element.text().next() {
                    season_title = text.trim();
                }
            }
            let mut td_values_organizar: Vec<Vec<&str>> = vec![];
            let mut td_labels: Vec<&str> = vec![];
            for tr_element in table_fragment.select(&tr_selector) {
                let mut td_values: Vec<&str> = vec![];
                for td_element in tr_element.select(&td_song_selector) {
                    if let Some(class) = td_element.value().attr("class") {
                        if !class.contains("idx") {
                            // tdの先頭行より下(テーブルのデータ)
                            if let Some(text) = td_element.text().next() {
                                let texts: Vec<_> = text.trim().split(',').collect();
                                td_values.push(text.trim());
                                if class == "player" || class == "stuff" {
                                    texts.iter().for_each(|text| player_list.push(text.trim()));
                                }
                                // info!("td_element(text): [{}] {:?}", class.trim(), texts);
                            }
                        } else {
                            // tdの先頭行(テーブルのラベル)
                            if let Some(text) = td_element.text().next() {
                                if text.trim().is_empty() {
                                    td_labels.push("OP_OR_ED");
                                } else {
                                    td_labels.push(text.trim());
                                }
                                // info!("td_element(text): {:?}", texts);
                            }
                        }
                    }
                }
                if !td_values.is_empty() {
                    td_values_organizar.push(td_values);
                }
            }
            // info!("td_labels: {:?}", td_labels);
            // info!("{:?}", td_labels);
            // info!("{:?}", td_values_organizar);
            for values in td_values_organizar.iter() {
                let hash_map: HashMap<_, _> = td_labels
                    .to_owned()
                    .into_iter()
                    .zip(values.into_iter())
                    .collect();
                let mut record = self.to_model(hash_map);
                record.season_key = if season_key.is_empty() {
                    "2019autumn".to_string()
                } else {
                    season_key.to_string()
                };
                record.season_title = season_title.to_string();
                // info!("{:?}", record);
                Record::insert(conn, record).unwrap();
            }
            // Save document
        }
        info!("{:?}", player_list.sort());
        let player_list_unique: HashSet<_> = player_list.iter().collect();
        info!("{:?}", player_list_unique);
        Ok(())
    }
}
