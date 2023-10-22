use std::env;

pub struct Config {
    pub environment: String,
    pub sqlite_database: String,
}

impl Config {
    pub fn from_env() -> Config {
        let environment = env::var("ENV").unwrap_or_else(|_| "development".to_string());
        let sqlite_database = env::var("SQLITE_DATABASE").expect("SQLITE_DATABASE must be set");

        Config {
            environment,
            sqlite_database,
        }
    }
}
