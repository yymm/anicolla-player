use regex::Regex;
use serde_json::Value;

use crate::model::YoutubeRecord;

pub fn get_playlist() -> Result<Vec<(String, String)>, reqwest::Error> {
    let api_key = "AIzaSyDTeE5WptGGLhSBKE0kELVaNyarSrjljqc";
    // let api_key = "AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM";
    let channel_id = "UCZ4_moy3xNXKrkbkP4XL_BA";
    let max_results = "1000";
    let params = [
        ("key", api_key),
        ("channelId", channel_id),
        ("part", "id"),
        ("part", "snippet"),
        ("maxResults", max_results),
    ];
    let url = "https://www.googleapis.com/youtube/v3/playlists";

    let client = reqwest::blocking::Client::new();

    let mut playlist_ids: Vec<String> = vec![];
    let mut playlist_titles: Vec<String> = vec![];
    let response = client.get(url).query(&params).send()?;
    let text = response.text()?;
    let json: Value = serde_json::from_str(&text).unwrap();
    if let Some(items) = json["items"].as_array() {
        for item in items {
            if let Some(title) = item["snippet"]["title"].as_str() {
                println!("Playlist title: {}", title);
                playlist_titles.push(title.to_string());
            }
            if let Some(id) = item["id"].as_str() {
                println!("Playlist id: {}", id);
                playlist_ids.push(id.to_string());
            }
        }
    }

    Ok(playlist_ids
        .iter()
        .zip(playlist_titles.iter())
        .map(|(a, b)| (a.to_string(), b.to_string()))
        .collect())
}

pub fn get_playlist_item(
    playlist_id: &str,
    playlist_title: &str,
) -> Result<Vec<YoutubeRecord>, reqwest::Error> {
    let api_key = "AIzaSyDTeE5WptGGLhSBKE0kELVaNyarSrjljqc";
    let max_results = "1000";
    let params = [
        ("key", api_key),
        ("playlistId", playlist_id),
        ("part", "id"),
        ("part", "snippet"),
        ("maxResults", max_results),
    ];
    let url = "https://www.googleapis.com/youtube/v3/playlistItems";

    let client = reqwest::blocking::Client::new();

    let response = client.get(url).query(&params).send()?;
    let text = response.text()?;
    let json: Value = serde_json::from_str(&text).unwrap();

    let mut records: Vec<YoutubeRecord> = vec![];

    if let Some(items) = json["items"].as_array() {
        for item in items {
            let mut record = YoutubeRecord::default();
            record.playlist_id = playlist_id.to_string();
            record.playlist_title = playlist_title.to_string();
            let splited_title: Vec<&str> = playlist_title.split(" ").collect();
            record.season_key = format!("{}{}", splited_title[0], splited_title[1]);

            if let Some(title) = item["snippet"]["title"].as_str() {
                // println!("Video title: {}", title);
                record.video_title = title.to_string();
            }
            if let Some(description) = item["snippet"]["description"].as_str() {
                record.video_description = description.to_string();
                let re = Regex::new(r"OP|ED|主題歌").unwrap();
                let desc_split_op_ed: Vec<&str> = re.split(description).collect();
                record.anime_title = desc_split_op_ed[0]
                    .replace("－", "-")
                    .replace("−", "-")
                    .replace("〜", "-")
                    .replace("～", "-")
                    .replace("\r\n", "")
                    .trim()
                    .to_string();
                let re = Regex::new(r"\sOP\d*\s").unwrap();
                record.op_or_ed = if re.is_match(description) {
                    "OP".to_string()
                } else {
                    "ED".to_string()
                };

                // println!("Video description: {:?}", desc);
                if desc_split_op_ed.len() < 2 {
                    println!(
                        "Will be error: [title_related] {:?}, [description] {}",
                        desc_split_op_ed, description
                    );
                }
                let after_song_title: Vec<&str> = desc_split_op_ed[1].split("\n").collect();
                record.song_title = after_song_title[0]
                    .replace("を演奏してみました。", "")
                    .trim()
                    .to_string();
            }
            if let Some(id) = item["snippet"]["resourceId"]["videoId"].as_str() {
                // println!("Video id: {}", id);
                record.video_id = id.to_string();
            }
            // println!(">>> record: {:?}", record);
            records.push(record);
        }
    }

    Ok(records)
}
