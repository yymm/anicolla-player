import {useNextVideo, usePrevVideo, useTogglePlay, useVoldown, useVolup} from "../../hooks/usePlayerControl";
import { usePlayerCtx } from "../../stores/Provider";
import { Next } from "../icons/Next";
import { Play } from "../icons/Play";
import { Prev } from "../icons/Prev";
import { Stop } from "../icons/Stop";
import {Voldown} from "../icons/Voldown";
import {Volup} from "../icons/Volup";

export function Controller() {
  const { playing } = usePlayerCtx();
  const prevVideo = usePrevVideo();
  const nextVideo = useNextVideo();
  const volUp = useVolup();
  const volDown = useVoldown();
  const togglePlay = useTogglePlay();
  return (
    <ul className="flex justify-around items-center h-full">
      <li
        className="text-gray-400 relative cursor-pointer"
        onClick={volDown}
      >
        <Voldown />
      </li>
      <li
        className="text-gray-400 relative cursor-pointer"
        onClick={prevVideo}
      >
        <Prev />
      </li>
      <li
        className="text-gray-400 relative cursor-pointer"
        onClick={togglePlay}
      >
        {playing ? <Stop /> : <Play />}
      </li>
      <li
        className="text-gray-400 relative cursor-pointer"
        onClick={nextVideo}
      >
        <Next />
      </li>
      <li
        className="text-gray-400 relative cursor-pointer"
        onClick={volUp}
      >
        <Volup />
      </li>
    </ul>
  );
}
