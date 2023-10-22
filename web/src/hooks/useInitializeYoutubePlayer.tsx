import { useEffect } from "react";
import { usePlayerCtx, usePlayerCtxDispatch } from "../stores/Provider";
import YouTubePlayer from "youtube-player";

export function useInitializeYoutubePlayer() {
  const { youtube_player, volume } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();

  useEffect(() => {
    if (youtube_player === null) {
      const _player = YouTubePlayer("player", {
        width: "100%",
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          iv_load_policy: 3,
          rel: 0,
        },
      });
      _player.setVolume(volume);
      _player.on("stateChange", (event) => {
        // stop
        if (event.data === 2) {
          dispatch({ type: "stop" });
        }
        // play
        else if (event.data === 1) {
          dispatch({
            type: "play",
            // @ts-ignore: event.target.playerInfo Object
            payload: { video_id: event.target!.playerInfo.videoData.video_id },
          });
        }
      });
      dispatch({ type: "setYoutubePlayer", payload: { player: _player } });
    }
  }, [youtube_player]);
}
