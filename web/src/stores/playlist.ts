import {Playlist, SongRecord } from "./models";

type SearchBy = "Title" | "Performer";

type PlaylistState = {
  menuOpen: boolean,
  user_defined: Playlist[],
  pre_defined: Playlist[],
  search_keyword: string,
  search_by: SearchBy,
  records: SongRecord[],
}

type PlaylistAction = |
{
  type: "toggleMenuOpen",
} |
{
  type: "loadPreDefinedPlaylist",
  payload: {
    playlists: Playlist[],
  }
} |
{
  type: "loadUserPlaylist",
  payload: {
    playlists: Playlist[],
  }
} |
{
  type: "addUserPlaylist",
  payload: {
    playlist: Playlist,
  }
} |
{
  type: "updateUserPlaylist",
  payload: {
    playlist: Playlist,
  }
} |
{
  type: "removeUserPlaylist",
  payload: {
    playlist_id: string,
  }
} |
{
  type: "updateSearchKeyword",
  payload: {
    search_keyword: string,
  }
} |
{
  type: "updateSearchBy",
  payload: {
    search_by: SearchBy,
  }
} |
{
  type: "loadRecords",
  payload: {
    records: SongRecord[],
  }
};

export function playlistReducer(state: PlaylistState, action: PlaylistAction) {
  switch (action.type) {
    case "toggleMenuOpen":
      return {
        ...state,
        menuOpen: !state.menuOpen,
      }
    case "loadPreDefinedPlaylist":
      const pre_defined = action.payload.playlists;
      return {
        ...state,
        pre_defined,
      }
    case "loadUserPlaylist":
      const user_defined = action.payload.playlists;
      return {
        ...state,
        user_defined,
      }
    case "addUserPlaylist":
      // TODO: naming is soooooooooo bad...
      const playlistA = action.payload.playlist;
      return {
        ...state,
        user_defined: [...state.user_defined, playlistA],
      }
    case "updateUserPlaylist":
      // TODO: naming is soooooooooo bad...
      const playlistU = action.payload.playlist;
      const indexU = state.user_defined.findIndex(p => p.id !== playlistU.id);
      return {
        ...state,
        user_defined: state.user_defined.splice(indexU, 1, playlistU),
      };
    case "removeUserPlaylist":
      const playlist_id = action.payload.playlist_id;
      return {
        ...state,
        user_defined: state.user_defined.filter(u => u.id !== playlist_id),
      }
    case "updateSearchKeyword":
      const search_keyword = action.payload.search_keyword;
      return {
        ...state,
        search_keyword: search_keyword,
      };
    case "updateSearchBy":
      const search_by = action.payload.search_by;
      return {
        ...state,
        search_by: search_by,
      };
    case "loadRecords":
      const records = action.payload.records;
      return {
        ...state,
        records: records,
      };
  }
}

export const initialPlaylist: PlaylistState = {
  menuOpen: false,
  user_defined: [] as Playlist[],
  pre_defined: [] as Playlist[],
  records: [] as SongRecord[],
  search_keyword: "",
  search_by: "Title",
};

// TODO: 型パズル諦めの境地壱の型: React reducer dispatch
export const initialPlaylistAction: any = {};
