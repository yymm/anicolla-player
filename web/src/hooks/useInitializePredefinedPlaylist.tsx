import { useEffect } from "react";
import useSWR from "swr";
import { jsonFetcher } from "./hooks_utils";
import { decompress } from "compress-json";
import { OriginRecord } from "../stores/models";
import { usePlaylistCtxDispatch } from "../stores/Provider";
import { origin_dto, origin_song_dto } from "../stores/stores_utils";

const origin = "/origin_records.json";

export function useInitializePredefinedPlaylist() {
  const { data, error, isLoading } = useSWR(origin, jsonFetcher);
  const dispatch = usePlaylistCtxDispatch();
  useEffect(() => {
    if (data && (!error || isLoading)) {
      const origin_records: OriginRecord[] = decompress(data);
      const playlists = origin_dto(origin_records);
      dispatch({ type: "loadPreDefinedPlaylist", payload: { playlists } });
      const records = origin_song_dto(origin_records);
      dispatch({ type: "loadRecords", payload: { records } });
    }
  }, [data, error, isLoading]);
  return {
    isLoading,
    isError: error,
  };
}
