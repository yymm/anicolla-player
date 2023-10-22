import { useEffect } from "react";
import { usePlaylistCtxDispatch } from "../stores/Provider";
import { Playlist } from "../stores/models";

export function useInitializeUserPlaylist() {
  const dispatch = usePlaylistCtxDispatch();
  useEffect(() => {
    const playlists =
      Object.values({ ...localStorage }).map(
        (v) => JSON.parse(v) as Playlist
      ) || [];
    const empty_playlists: Playlist = {
      id: "",
      name: "New playlist",
      is_predefined: false,
      records: [],
    };
    playlists.unshift(empty_playlists);
    dispatch({
      type: "loadUserPlaylist",
      payload: { playlists },
    });
  }, []);
}
