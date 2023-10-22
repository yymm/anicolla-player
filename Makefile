data_collector:
	cargo run -p data_collector

youtube_data_fetcher:
	cargo run -p youtube_data_fetcher

data_matcher:
	cargo run -p data_matcher

generate_data:
	cargo run -p data_collector
	cargo run -p youtube_data_fetcher
	# sqlite3 --json local.db3 < analysis_sqls/record_full.sql > record_full.json
	# sqlite3 --json local.db3 < analysis_sqls/youtube_record_full.sql > youtube_record_full.json
	# cp youtube_record_full.json web/src/assets/
	cargo run -p data_matcher
	cp fixed_records.json web/src/assets/
