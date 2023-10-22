import {
  usePlayerCtx,
  usePlayerCtxDispatch,
  usePlaylistCtxDispatch,
} from "../stores/Provider";
import { useToast } from "./useToast";

export function useTrashUserPlaylist() {
  const { youtube_player, mode } = usePlayerCtx();
  const dispatch = usePlaylistCtxDispatch();
  const dispatchPlayer = usePlayerCtxDispatch();
  const toast = useToast();
  return (id: string) => {
    localStorage.removeItem(id);
    dispatch({ type: "removeUserPlaylist", payload: { playlist_id: id } });
    dispatchPlayer({ type: "trashPlaylist" });
    if (mode === "Youtube") {
      youtube_player?.cuePlaylist([]);
      youtube_player?.loadVideoById("");
    }
    toast("Trashed!");
  };
}
