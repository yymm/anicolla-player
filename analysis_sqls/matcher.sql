select
  -- record.id,
  record.anime_title,
  record.op_or_ed,
  -- record.song_title,
  youtube_record.anime_title,
  youtube_record.op_or_ed
from youtube_record
left outer join record on
  youtube_record.season_key = record.season_key and
  youtube_record.op_or_ed = record.op_or_ed and
  youtube_record.anime_title = record.anime_title
group by
  -- record.id,
  -- record.anime_title,
  -- record.op_or_ed,
  -- record.song_title,
  youtube_record.anime_title,
  youtube_record.op_or_ed
order by record.anime_title;
