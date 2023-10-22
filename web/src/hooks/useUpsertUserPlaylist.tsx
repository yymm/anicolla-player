import { v4 as uuidv4 } from 'uuid';
import {usePlayerCtx, usePlayerCtxDispatch, usePlaylistCtx, usePlaylistCtxDispatch} from "../stores/Provider";
import {Playlist} from '../stores/models';
import {useToast} from './useToast';

export function useUpsertUserPlaylist() {
  const { records, selected_playlist_id } = usePlayerCtx();
  const { user_defined: playlists } = usePlaylistCtx();
  const dispatch = usePlaylistCtxDispatch();
  const dispatchPlayer = usePlayerCtxDispatch();
  const toast = useToast();
  return (name: string, update: boolean) => {
    if (update) {
      const playlist = playlists.find(p => p.id === selected_playlist_id);
      if (playlist) {
        playlist.name = name;
        playlist.records = records;
        localStorage.setItem(playlist.id, JSON.stringify(playlist));
        dispatch({ type: "updateUserPlaylist", payload: { playlist }});
        toast("Updated!");
      } else {
        toast("Error: playlist is not found", "error")
      }
    } else {
      const id = uuidv4();
      const playlist: Playlist = {
        id,
        name,
        is_predefined: false,
        records,
      }
      localStorage.setItem(id, JSON.stringify(playlist));
      dispatch({ type: "addUserPlaylist", payload: { playlist }})
      dispatchPlayer({ type: "addNewPlaylist", payload: { playlist }})
      toast("Saved!")
    }
  }
}
