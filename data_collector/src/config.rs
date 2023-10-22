use std::env;

pub struct Config {
    pub environment: String,
    pub sqlite_database: String,
    pub list_html_path: String,
    pub top_html_path: String,
}

impl Config {
    pub fn from_env() -> Config {
        let environment = env::var("ENV").unwrap_or_else(|_| "development".to_string());
        let sqlite_database = env::var("SQLITE_DATABASE").expect("SQLITE_DATABASE must be set");
        let list_html_path = env::var("LIST_HTML_PATH").expect("LIST_HTML_PATH must be set");
        let top_html_path = env::var("TOP_HTML_PATH").expect("TOP_HTML_PATH must be set");

        Config {
            environment,
            sqlite_database,
            list_html_path,
            top_html_path,
        }
    }
}
