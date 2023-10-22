import { usePlayerCtx, usePlayerCtxDispatch } from "../stores/Provider";
import { Playlist, SongRecord } from "../stores/models";
import { useToast } from "./useToast";

export function useLoadPlaylist() {
  const { youtube_player, audio_player } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return (playlist: Playlist) => {
    const video_ids = [...playlist.records.map((r) => r.video_id)];
    youtube_player?.cuePlaylist(video_ids);
    audio_player?.cueVideoIds(video_ids);
    dispatch({ type: "loadPlaylist", payload: { playlist } });
  };
}

export function useAddSongRecord() {
  const { youtube_player, audio_player, records, is_predefined } =
    usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return (record: SongRecord) => {
    if (is_predefined) {
      return;
    }
    const video_ids = [...records.map((r) => r.video_id), record.video_id];
    youtube_player?.cuePlaylist(video_ids);
    audio_player?.cueVideoIds(video_ids);
    dispatch({ type: "addSongRecord", payload: { record } });
  };
}

export function useRemoveSongRecord() {
  const { youtube_player, audio_player, records, is_predefined } =
    usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return (video_id: string) => {
    if (is_predefined) {
      return;
    }
    const filtered_records = records.filter((r) => r.video_id !== video_id);
    const filtered_video_ids = filtered_records.map((r) => r.video_id);
    youtube_player?.cuePlaylist(filtered_video_ids);
    audio_player?.cueVideoIds(filtered_video_ids);
    dispatch({ type: "removeSongRecord", payload: { video_id } });
  };
}

export function useTogglePlay() {
  const { youtube_player, audio_player, playing, records, mode, playing_info } =
    usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return () => {
    if (mode === "Youtube") {
      if (playing) {
        youtube_player?.pauseVideo();
      } else {
        if (playing_info !== null) {
          youtube_player?.playVideo(); // 再開
        } else {
          youtube_player?.playVideoAt(0); // 未再生なので始めから再生
        }
      }
    } else {
      if (records.length === 0) {
        return;
      }
      if (playing) {
        audio_player?.suspend();
      } else {
        if (playing_info !== null) {
          audio_player?.resume();
        } else {
          audio_player?.playAt(0);
        }
      }
    }
    dispatch({ type: "togglePlay" });
  };
}

export function useNextVideo() {
  const { youtube_player, audio_player, mode, records, playing_info } =
    usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return () => {
    if (playing_info === null) {
      return;
    }
    const i = playing_info.index + 1;
    const index = i >= records.length ? 0 : i;
    if (mode === "Youtube") {
      youtube_player?.playVideoAt(index);
    } else {
      audio_player?.playAt(index);
    }
    dispatch({ type: "nextVideo" });
  };
}

export function usePrevVideo() {
  const { youtube_player, audio_player, mode, records, playing_info } =
    usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return () => {
    if (playing_info === null) {
      return;
    }
    const i = playing_info.index - 1;
    const index = i < 0 ? records.length - 1 : i;
    if (mode === "Youtube") {
      youtube_player?.playVideoAt(index);
    } else {
      audio_player?.playAt(index);
    }
    dispatch({ type: "prevVideo" });
  };
}

export function useSelectVideo() {
  const { youtube_player, audio_player, mode, records } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return (video_id: string) => {
    const index = records.findIndex((r) => r.video_id === video_id);
    if (mode === "Youtube") {
      youtube_player?.playVideoAt(index);
    } else {
      audio_player?.playAt(index);
    }
    dispatch({ type: "selectVideo", payload: { video_id } });
  };
}

export function useToggleLoop() {
  const { youtube_player, audio_player, loop, mode } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return () => {
    if (mode === "Youtube") {
      youtube_player?.setLoop(!loop);
    } else {
      audio_player?.setLoop(!loop);
    }
    dispatch({ type: "toggleLoop" });
  };
}

export function useToggleShuffle() {
  const { youtube_player, audio_player, shuffle, mode } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  return () => {
    if (mode === "Youtube") {
      youtube_player?.setShuffle(!shuffle);
    } else {
      audio_player?.setShuffle(!shuffle);
    }
    dispatch({ type: "toggleShuffle" });
  };
}

export function useVolup() {
  const { youtube_player, audio_player, mode, volume } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  const toast = useToast();
  return () => {
    if (mode === "Youtube") {
      youtube_player?.setVolume(volume + 5);
      toast(`Volup: ${volume + 5}`);
    } else {
      audio_player?.setVolume(volume + 5);
      toast(`Volup: ${volume + 5}`);
    }
    dispatch({ type: "changeVolume", payload: { volume: volume + 5 } });
  };
}

export function useVoldown() {
  const { youtube_player, audio_player, mode, volume } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  const toast = useToast();
  return async () => {
    if (mode === "Youtube") {
      youtube_player?.setVolume(volume - 5);
      toast(`Voldown: ${volume - 5}`);
    } else {
      audio_player?.setVolume(volume - 5);
      toast(`Voldown: ${volume - 5}`);
    }
    dispatch({ type: "changeVolume", payload: { volume: volume - 5 } });
  };
}
