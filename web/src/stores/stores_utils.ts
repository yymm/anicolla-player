import { OriginRecord, Playlist, SongRecord } from "./models";

export function origin_dto(origin_records: OriginRecord[]): Playlist[] {
  let playlists: Playlist[] = [];
  const season_keys = new Set(origin_records.map((o) => o.season_key).sort());
  season_keys.forEach((season_key) => {
    let playlist_title = "";
    const season_filtered_origin_records = origin_records.filter(
      (o) => o.season_key == season_key
    );
    const season_song_records: SongRecord[] =
      season_filtered_origin_records.map((r) => {
        playlist_title = r.playlist_title;
        return {
          season_key: r.season_key,
          playlist_title: r.playlist_title,
          video_id: r.video_id,
          video_title: r.video_title,
          anime_title: r.anime_title,
          song_title: r.song_title,
          song_order: r.song_order,
          op_or_ed: r.op_or_ed,
          vocal: r.vocal,
          guiter: r.guiter,
          key: r.key,
          violin: r.violin,
          bass: r.bass,
          drum: r.drum,
          mix: r.mix,
          mastering: r.mastering,
          movie: r.movie,
        };
      });
    const playlist: Playlist = {
      id: season_key,
      name: playlist_title,
      is_predefined: true,
      records: season_song_records.sort((a, b) =>
        a.song_order < b.song_order ? 0 : 1
      ),
    };
    playlists.push(playlist);
  });
  return playlists.sort((a, b) => (a.id > b.id ? 0 : 1));
}

export function origin_song_dto(origin_records: OriginRecord[]): SongRecord[] {
  const song_records: SongRecord[] = origin_records.map((r) => {
    return {
      season_key: r.season_key,
      playlist_title: r.playlist_title,
      video_id: r.video_id,
      video_title: r.video_title,
      anime_title: r.anime_title,
      song_title: r.song_title,
      song_order: r.song_order,
      op_or_ed: r.op_or_ed,
      vocal: r.vocal,
      guiter: r.guiter,
      key: r.key,
      violin: r.violin,
      bass: r.bass,
      drum: r.drum,
      mix: r.mix,
      mastering: r.mastering,
      movie: r.movie,
    };
  });
  return song_records;
}
