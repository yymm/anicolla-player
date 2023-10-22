import { useReducer, createContext, useContext } from "react";
import { playerReducer, initialPlayer, initialPlayerAction } from "./player";
import { playlistReducer, initialPlaylist, initialPlaylistAction } from "./playlist";
import { FC } from "react";

const PlayerContext = createContext(initialPlayer);
const PlayerDispatchContext = createContext(initialPlayerAction);
const PlaylistContext = createContext(initialPlaylist);
const PlaylistDispatchContext = createContext(initialPlaylistAction);

type StoreProps = {
  children: React.ReactNode;
};

export const StoreProvider: FC<StoreProps> = ({ children }) => {
  // @ts-ignore
  const [playerState, playerDispatch] = useReducer(playerReducer, initialPlayer);
  const [playlistState, playlistDispatch] = useReducer(playlistReducer, initialPlaylist);
  return (
    <PlayerContext.Provider value={playerState}>
      <PlayerDispatchContext.Provider value={playerDispatch}>
        <PlaylistContext.Provider value={playlistState}>
          <PlaylistDispatchContext.Provider value={playlistDispatch}>
            {children}
          </PlaylistDispatchContext.Provider>
        </PlaylistContext.Provider>
      </PlayerDispatchContext.Provider>
    </PlayerContext.Provider>
  );
}

export function usePlayerCtx() {
  return useContext(PlayerContext);
}

export function usePlayerCtxDispatch() {
  return useContext(PlayerDispatchContext);
}

export function usePlaylistCtx() {
  return useContext(PlaylistContext);
}

export function usePlaylistCtxDispatch() {
  return useContext(PlaylistDispatchContext);
}
