import { usePlaylistCtx } from "../../stores/Provider";
import { PlaylistRecord } from "../playlist/PlaylistRecord";

export function SearchResult() {
  const { search_keyword, search_by, records } = usePlaylistCtx();
  return (
    <>
      {records
        .filter((record) => {
          const s =
            search_by === "Title"
              ? record.anime_title + record.song_title // @ts-ignore
              : record.vocal + // @ts-ignore
                record.guiter +
                record.key +
                record.violin +
                record.bass +
                record.drum +
                record.mix +
                record.mastering +
                record.movie;
          return s.includes(search_keyword);
        })
        .map((record, i) => {
          return <PlaylistRecord key={i} record={record} />;
        })}
    </>
  );
}
