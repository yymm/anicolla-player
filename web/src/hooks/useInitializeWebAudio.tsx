import { useEffect } from "react";
import { usePlayerCtx, usePlayerCtxDispatch } from "../stores/Provider";

export function useInitializeWebAudio() {
  const { audio_player } = usePlayerCtx();
  const dispatch = usePlayerCtxDispatch();
  useEffect(() => {
    if (audio_player !== null) {
      return;
    }
    const audio_ctx = new AudioContext();
    const canvas: HTMLCanvasElement | null = document.querySelector("#audio-canvas");
    const canvas_ctx = canvas!.getContext("2d");
    dispatch({ type: "setAudioPlayer", payload: { audio_ctx, canvas_ctx } });
    // @ts-ignore
    const audio_ended = (e) => {
      dispatch({
        type: "play",
        payload: { video_id: e.detail.video_id },
      });
    };
    // @ts-ignore
    const analyzer_changed = (e) => {
      dispatch({
        type: "setAnalyzerNode",
        payload: { analyzer_node: e.detail.analyzer_node },
      });
    };

    window.addEventListener("audio_ended", audio_ended);
    window.addEventListener("analyzer_changed", analyzer_changed);
    return () => {
      window.removeEventListener("audio_ended", audio_ended, false);
      window.removeEventListener("analyzer_changed", analyzer_changed, false);
    };
  }, []);
}
