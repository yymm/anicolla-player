import {usePlaylistCtx} from "../../stores/Provider"
import { Playlist } from "./Playlist"

export function UserPlaylist() {
  const { user_defined: playlists } = usePlaylistCtx();
  return (
    <div className="flex-1 overflow-y-auto">
      {playlists.map((playlist) => {
        return <Playlist key={playlist.id} playlist={playlist} />;
      })}
    </div>
  )
}
