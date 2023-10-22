import { useState } from "react";
import { usePlayerCtx, usePlayerCtxDispatch } from "../../stores/Provider";
import { Coffee } from "../icons/Coffee";
import { Loop } from "../icons/Loop";
import { Shuffle } from "../icons/Shuffle";
import { Trash } from "../icons/Trash";
import { DeleteModal } from "../modal/DeleteModal";
import { UpsertModal } from "../modal/UpsertModal";
import { Music } from "../icons/Music";
import { Movie } from "../icons/Movie";
import { Cup } from "../icons/Cup";
import {useToggleLoop, useToggleShuffle} from "../../hooks/usePlayerControl";

export function MiniController() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const {
    selected_playlist_id,
    is_predefined,
    updating_playlist,
    mode,
    loop,
    shuffle,
  } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  const c = "mx-auto rounded-full h-10 w-10 flex justify-center items-center ";
  const isEmptyPlaylist = selected_playlist_id !== null && selected_playlist_id === "";
  const toggleShuffle = useToggleShuffle();
  const toggleLoop = useToggleLoop();
  return (
    <ul className="flex justify-between">
      <li
        className="inline-block cursor-pointer"
        onClick={toggleLoop}
      >
        <div
          className={
            loop
              ? c + "bg-blue-500 text-white"
              : c + "border border-gray-300 bg-white text-gray-800"
          }
        >
          <Loop />
        </div>
      </li>
      <li
        className="inline-block cursor-pointer"
        onClick={toggleShuffle}
      >
        <div
          className={
            shuffle
              ? c + "bg-blue-500 text-white"
              : c + "border border-gray-300 bg-white text-gray-800"
          }
        >
          <Shuffle />
        </div>
      </li>
      <li
        className="inline-block cursor-pointer"
        onClick={() => dispatch({ type: "toggleMode" })}
      >
        <div
          className={
            mode === "Youtube"
              ? c + "text-white bg-[#ff0000]"
              : c + "text-white bg-[#282828]"
          }
        >
          {mode === "Youtube" ? <Movie /> : <Music />}
        </div>
      </li>
      <li
        className="inline-block cursor-pointer"
        onClick={() => is_predefined || isEmptyPlaylist || setDeleteOpen(true)}
      >
        <div className={is_predefined || isEmptyPlaylist ?  c + "text-gray-200" : c + "border border-gray-300 text-gray-800"}>
          <Trash />
        </div>
      </li>
      <li
        className="inline-block cursor-pointer"
        onClick={() => is_predefined || setSaveOpen(true)}
      >
        <div
          className={
            selected_playlist_id === null
              ? c + "relative border border-gray-300 bg-white text-gray-800"
              : is_predefined
              ? c + "relative bg-white text-gray-200"
              : c + "relative bg-[#7b5544] text-white"
          }
        >
          {updating_playlist ? (
            <div className="absolute h-8 w-8 top-0 right-0">
              <svg
                className="absolute text-orange-500 border-white"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                stroke="#fff"
                stroke-width="3"
              >
                <circle cx="85" cy="15" r="15"></circle>
              </svg>
            </div>
          ) : (
            <></>
          )}
          {selected_playlist_id === null || selected_playlist_id === "" ? <Cup /> : <Coffee />}
        </div>
      </li>
      {deleteOpen ? <DeleteModal close={() => setDeleteOpen(false)} /> : <></>}
      {saveOpen ? <UpsertModal close={() => setSaveOpen(false)} /> : <></>}
    </ul>
  );
}
