import { PlaylistRecord } from "./PlaylistRecord";
import { Playlist } from "../../stores/models";
import { useState } from "react";
import { Plus } from "../icons/Plus";
import { Minus } from "../icons/Minus";
import { Play } from "../icons/Play";
import { usePlaylistCtxDispatch } from "../../stores/Provider";
import { useToast } from "../../hooks/useToast";
import { useLoadPlaylist } from "../../hooks/usePlayerControl";

export function Playlist({ playlist }: { playlist: Playlist }) {
  const [open, setOpen] = useState(false);
  const dispatch = usePlaylistCtxDispatch();
  const loadPlaylist = useLoadPlaylist();
  const toast = useToast();
  const c = "overflow-hidden ";
  const loadPlaylistHandler = () => {
    loadPlaylist(playlist);
    dispatch({ type: "toggleMenuOpen" });
    toast("Add playlist");
  };
  return (
    <>
      <div className="accordion-header cursor-pointer transition flex space-x-5 px-5 items-center justify-between h-16">
        <div onClick={() => setOpen(!open)}>{open ? <Minus /> : <Plus />}</div>
        <p className="truncate" onClick={() => setOpen(!open)}>
          {playlist.name}
        </p>
        <div onClick={loadPlaylistHandler}>
          <Play />
        </div>
      </div>
      <div className={open ? c + "block" : c + "hidden"}>
        {playlist.records.map((record, i) => {
          return <PlaylistRecord key={i} record={record} />;
        })}
      </div>
    </>
  );
}
