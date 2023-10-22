mod model;

use std::io::Write;
use std::{fs::File, io::Read};

use anyhow::Error;
use strsim::{damerau_levenshtein, jaro, jaro_winkler, levenshtein, sorensen_dice};

use crate::model::FixedRecord;
use crate::model::Record;
use crate::model::YoutubeRecord;

fn to_fixed_record(record: &Record, youtube_record: &YoutubeRecord) -> FixedRecord {
    FixedRecord {
        id: 0,
        record_id: record.id,
        youtube_record_id: youtube_record.id,
        season_key: record.season_key.to_string(),
        playlist_id: youtube_record.playlist_id.to_string(),
        playlist_title: youtube_record.playlist_title.to_string(),
        video_id: youtube_record.video_id.to_string(),
        video_title: youtube_record.video_title.to_string(),
        video_description: youtube_record.video_description.to_string(),
        anime_title: record.anime_title.to_string(),
        song_title: record.song_title.to_string(),
        song_order: record.song_order,
        op_or_ed: record.op_or_ed.to_string(),
        vocal: record.vocal.to_owned(),
        guiter: record.guiter.to_owned(),
        key: record.key.to_owned(),
        violin: record.violin.to_owned(),
        bass: record.bass.to_owned(),
        drum: record.drum.to_owned(),
        mix: record.mix.to_owned(),
        mastering: record.mastering.to_owned(),
        movie: record.movie.to_owned(),
    }
}

fn main() -> Result<(), Error> {
    let record_full_path = "record_full.json";
    let youtube_record_full_path = "youtube_record_full.json";

    let mut file = File::open(youtube_record_full_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let youtube_records: Vec<YoutubeRecord> = serde_json::from_str(&contents)?;

    let mut file = File::open(record_full_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let records: Vec<Record> = serde_json::from_str(&contents)?;
    let aa: Vec<&Record> = records.iter().filter(|x| x.season_key.is_empty()).collect();
    for a in aa.iter() {
        println!("{:?}", a);
    }
    let filtered_records: Vec<&Record> = records
        .iter()
        .filter(|x| !x.season_key.contains("2009"))
        .filter(|x| !x.season_key.contains("2010winter"))
        // .filter(|x| !x.season_key.contains("2010autumn"))
        .filter(|x| !x.season_key.contains("2010spring"))
        .filter(|x| !x.season_key.contains("2010springpreview"))
        .filter(|x| !x.season_key.contains("2010summer"))
        .collect();

    println!("{}", youtube_records.len() - 5);
    println!("{}", filtered_records.len() - 1);

    // 全件対象にしてレーベンシュタイン距離でそこそこマッチしているけど、数件間違えているので
    // 多分シーズンごとにマッチさせることが出来るはずなので、元データをシーズンごとにして
    // ゴニョゴニョしたほうが良い
    // 元データはsqlite -> sqlからjsonにダンプするスクリプト or コマンド列作成 -> matcherで連結
    // あと基本youtube側のデータを主とする(でないと動画見れないじゃん...)ので、そのようにコードを作る
    // シーズンマッチするためにはyoutube_data_fetcherいじらないといけないっす
    // あとjaro距離が結果が良い
    let season_keys = vec![
        "2010autumn",
        "2010summer",
        "2011autumn",
        "2011spring",
        "2011summer",
        "2011summer(off",
        "2011winter",
        "2012autumn",
        "2012spring",
        "2012summer",
        "2012winter",
        "2013autumn",
        "2013spring",
        "2013summer",
        "2013winter",
        "2014autumn",
        "2014spring",
        "2014summer",
        "2014winter",
        "2015autumn",
        "2015spring",
        "2015summer",
        "2015winter",
        "2016autumn",
        "2016spring",
        "2016summer",
        "2016winter",
        "2017autumn",
        "2017spring",
        "2017summer",
        "2017winter",
        "2018autumn",
        "2018spring",
        "2018summer",
        "2018winter",
        "2019autumn",
        "2019spring",
        "2019summer",
        "2019winter",
        "OldAnime",
    ];
    let mut fixed_records: Vec<FixedRecord> = vec![];
    for season_key in season_keys.iter() {
        let match_key = match season_key.to_owned() {
            "OldAnime" => "mp01",
            "2011summer(off" => "2011summerkaraoke",
            _ => season_key,
        };
        let season_youtube_records: Vec<YoutubeRecord> = youtube_records
            .iter()
            .filter(|x| x.season_key.contains(season_key))
            .map(|x| x.clone())
            .collect();
        let season_records: Vec<Record> = records
            .iter()
            .filter(|x| x.season_key.contains(match_key))
            .map(|x| x.clone())
            .collect();
        for youtube_record in season_youtube_records.iter() {
            let youtube_record_leven_str = format!(
                "{} {} {}",
                youtube_record.anime_title, youtube_record.op_or_ed, youtube_record.song_title
            );
            let mut min_leven: f64 = 0.0;
            // let mut min_leven: usize = 1000000;
            let mut min_leven_record: Record = Record::default();
            for record in season_records.iter() {
                if record.op_or_ed != youtube_record.op_or_ed {
                    continue;
                }
                let record_leven_str = format!(
                    "{} {} {}",
                    record.anime_title, record.op_or_ed, record.song_title
                );
                if youtube_record_leven_str == record_leven_str {
                    min_leven_record = record.clone();
                    break;
                }
                // let leven = jaro(&youtube_record_leven_str, &record_leven_str);
                // let leven = jaro_winkler(&youtube_record_leven_str, &record_leven_str);
                // let leven = levenshtein(&youtube_record_leven_str, &record_leven_str);
                // let leven = damerau_levenshtein(&youtube_record_leven_str, &record_leven_str);
                let leven = sorensen_dice(&youtube_record_leven_str, &record_leven_str);
                if min_leven < leven {
                    min_leven = leven;
                    min_leven_record = record.clone();
                }
            }
            fixed_records.push(to_fixed_record(&min_leven_record, &youtube_record));
            // let record_leven_str = format!(
            //     "{} {} {}",
            //     min_leven_record.anime_title,
            //     min_leven_record.op_or_ed,
            //     min_leven_record.song_title
            // );
            // if youtube_record_leven_str != record_leven_str {
            //     println!(
            //         "youtube({}) {}: {} {} {}",
            //         youtube_record.season_key,
            //         youtube_record.id,
            //         youtube_record.anime_title,
            //         youtube_record.op_or_ed,
            //         youtube_record.song_title
            //     );
            //     println!(
            //         "origin({})  {}: {} {} {}",
            //         min_leven_record.season_key,
            //         min_leven_record.id,
            //         min_leven_record.anime_title,
            //         min_leven_record.op_or_ed,
            //         min_leven_record.song_title
            //     );
            //     println!("===");
            // }
        }
    }
    println!("fixed_records: {}", fixed_records.len());
    println!("youtube_records: {}", youtube_records.len());
    let mut file = File::create("fixed_records.json")?;
    let json_str = match serde_json::to_string(&fixed_records) {
        Ok(json) => json,
        Err(e) => {
            println!("Error serializing person: {}", e);
            panic!("Serialization failed");
            // return Err(std::io::Error::new(std::io::ErrorKind::Other, "Serialization failed"));
        }
    };
    file.write_all(json_str.as_bytes())?;

    Ok(())
}
