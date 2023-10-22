import { YouTubePlayer } from "youtube-player/dist/types";
import { Playlist, SongRecord } from "./models";
import {AudioPlayer} from "../hooks/AudioPlayer";

export type PlayingInfo = {
  video_id: string;
  index: number;
};

type PlayerMode = "Youtube" | "Music";

type PlayerState = {
  // 選択中のプレイリストID、nullのときは未保存のプレイリスト
  selected_playlist_id: string | null;
  // 選択中のプレイリストがPre definedのプレイリストかどうか
  is_predefined: boolean | null;
  // 再生対象のプレイリストに変更検知
  updating_playlist: boolean;
  // Youtube or Music(mp3)
  mode: PlayerMode;
  // 再生対象のプレイリストに対する現在再生中の情報
  playing_info: PlayingInfo | null;
  // 再生中かどうかを管理
  playing: boolean;
  // ループ状態を管理(Youtube apiのプレイリストの状態が変わるとリセットされるので注意)
  loop: boolean;
  // シャッフル状態を管理(Youtube apiのプレイリストの状態が変わるとリセットされるので注意)
  shuffle: boolean;
  // Youtube iframe player (youtube-playerライブラリを利用)
  youtube_player: YouTubePlayer | null;
  // Web Audio API Context
  audio_player: AudioPlayer | null;
  // audio_player用のcanvas context
  canvas_ctx: CanvasRenderingContext2D | null;
  // current_analyzer_node for audio visualizer
  current_analyzer_node: AnalyserNode | null;
  // 再生対象の楽曲のリスト
  records: SongRecord[];
  // volume: 0 - 100
  volume: number;
};

type PlayerAction =
  | {
      type: "addNewPlaylist";
      payload: {
        playlist: Playlist;
      };
    }
  | {
      type: "trashPlaylist";
    }
  | {
      type: "loadPlaylist";
      payload: {
        playlist: Playlist;
      };
    }
  | {
      type: "addSongRecord";
      payload: {
        record: SongRecord;
      };
    }
  | {
      type: "removeSongRecord";
      payload: {
        video_id: string;
      };
    }
  | {
      type: "togglePlay";
    }
  | {
      type: "play";
      payload: {
        video_id: string;
      };
    }
  | {
      type: "stop";
    }
  | {
      type: "nextVideo";
    }
  | {
      type: "prevVideo";
    }
  | {
      type: "selectVideo";
      payload: {
        video_id: string;
      }
    }
  | {
      type: "toggleLoop";
    }
  | {
      type: "toggleShuffle";
    }
  | {
      type: "changeVolume";
      payload: {
        volume: number;
      };
    }
  | {
      type: "toggleMode";
    }
  | {
      type: "setYoutubePlayer";
      payload: {
        player: YouTubePlayer;
      };
    }
  | {
      type: "setAudioPlayer";
      payload: {
        audio_ctx: AudioContext;
        canvas_ctx: CanvasRenderingContext2D;
      };
    }
  | {
    type: "setAnalyzerNode";
    payload: {
      analyzer_node: AnalyserNode;
    }
  };

export function playerReducer(state: PlayerState, action: PlayerAction) {
  switch (action.type) {
    case "addNewPlaylist": {
      return {
        ...state,
        selected_playlist_id: action.payload.playlist.id,
        is_predefined: action.payload.playlist.is_predefined,
        updating_playlist: false,
        playing_info: null,
        playing: false,
        loop: false,
        shuffle: false,
      };
    }
    case "trashPlaylist": {
      return {
        ...state,
        selected_playlist_id: null,
        is_predefined: null,
        updating_playlist: false,
        playing_info: null,
        playing: false,
        loop: false,
        shuffle: false,
        records: [],
      }
    }
    case "loadPlaylist": {
      const playlist = action.payload.playlist;
      return {
        ...state,
        selected_playlist_id: playlist.id,
        records: [...playlist.records],
        is_predefined: playlist.is_predefined,
        updating_playlist: false,
        loop: false,
        shuffle: false,
      };
    }
    case "addSongRecord": {
      if (state.is_predefined) {
        return { ...state }
      }
      return {
        ...state,
        records: [...state.records, action.payload.record],
        loop: false,
        shuffle: false,
        playing_info: null,
        updating_playlist: true,
      };
    }
    case "removeSongRecord": {
      if (state.is_predefined) {
        return { ...state }
      }
      const filtered_records = state.records.filter(
        (r) => r.video_id !== action.payload.video_id
      );
      return {
        ...state,
        records: filtered_records,
        loop: false,
        shuffle: false,
        playing_info: null,
        updating_playlist: true,
      };
    }
    case "togglePlay": {
      const video_id =
        state.records.length === 0 ? "" : state.records[0].video_id;
      let playing_info: PlayingInfo = {
        video_id: video_id,
        index: 0,
      };
      if (state.playing_info !== null) {
        playing_info = { ...state.playing_info };
      }
      return {
        ...state,
        playing: !state.playing,
        playing_info,
      };
    }
    case "play": {// only for "onStateChange" in Youtube iframe API
      return {
        ...state,
        playing: true,
        playing_info: {
          video_id: action.payload.video_id,
          index: state.records.findIndex(r => r.video_id === action.payload.video_id),
        }
      };
    }
    case "stop": {// only for "onStateChange" in Youtube iframe API
      return {
        ...state,
        playing: false,
      };
    }
    case "nextVideo": {
      if (state.playing_info === null) {
        return {
          ...state,
        };
      }
      const i = state.playing_info.index + 1;
      const index = i >= state.records.length ? 0 : i;
      const video_id = state.records[index].video_id;
      return {
        ...state,
        playing_info: {
          video_id,
          index,
        },
      };
    }
    case "prevVideo": {
      if (state.playing_info === null) {
        return {
          ...state,
        };
      }
      const i = state.playing_info.index - 1;
      const index = i < 0 ? state.records.length - 1 : i;
      const video_id = state.records[index].video_id;
      return {
        ...state,
        playing_info: {
          video_id,
          index,
        },
      };
    }
    case "selectVideo": {
      const video_id = action.payload.video_id;
      const index = state.records.findIndex(r => r.video_id === video_id);
      return {
        ...state,
        playing: true,
        playing_info: {
          video_id,
          index,
        },
      };
    }
    case "toggleLoop": {
      return {
        ...state,
        loop: !state.loop,
      };
    }
    case "toggleShuffle": {
      return {
        ...state,
        shuffle: !state.shuffle,
      };
    }
    case "changeVolume": {
      return {
        ...state,
        volume: action.payload.volume,
      };
    }
    case "toggleMode": {
      return {
        ...state,
        mode: state.mode === "Youtube" ? "Music" : "Youtube",
      };
    }
    case "setYoutubePlayer": {
      if (state.youtube_player !== null) {
        return { ...state };
      }
      return {
        ...state,
        youtube_player: action.payload.player,
      };
    }
    case "setAudioPlayer": {
      if (state.audio_player !== null) {
        return { ...state };
      }
      return {
        ...state,
        audio_player: new AudioPlayer(action.payload.audio_ctx),
        canvas_ctx: action.payload.canvas_ctx,
      };
    }
    case "setAnalyzerNode": {
      if (state.audio_player === null) {
        return { ...state };
      }
      return {
        ...state,
        current_analyzer_node: action.payload.analyzer_node,
      };
    }
    default:
      return { ...state };
  }
}

export const initialPlayer: PlayerState = {
  selected_playlist_id: null,
  is_predefined: null,
  updating_playlist: false,
  playing_info: null,
  playing: false,
  mode: "Youtube",
  loop: false,
  shuffle: false,
  youtube_player: null,
  audio_player: null,
  canvas_ctx: null,
  current_analyzer_node: null,
  records: [] as SongRecord[],
  volume: 11,
};

// TODO: 型パズル諦めの境地壱の型: React reducer dispatch
export const initialPlayerAction: any = {};
