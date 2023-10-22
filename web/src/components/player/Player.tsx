import { useEffect, useRef } from "react";
import { useInitializeWebAudio } from "../../hooks/useInitializeWebAudio";
import { useInitializeYoutubePlayer } from "../../hooks/useInitializeYoutubePlayer";
import { usePlayerCtx } from "../../stores/Provider";

export function Player() {
  const { mode, canvas_ctx, current_analyzer_node } = usePlayerCtx();
  const anime_ref = useRef(null);
  useInitializeYoutubePlayer();
  useInitializeWebAudio();

  const draw = () => {
    const width = canvas_ctx!.canvas!.width;
    const height = canvas_ctx!.canvas!.height;
    canvas_ctx!.fillStyle = "rgb(255, 255, 255)";
    canvas_ctx!.fillRect(0, 0, width, height);
    canvas_ctx!.beginPath();
    const buffer_length = current_analyzer_node!.frequencyBinCount; // fftSize / 2
    const data_array = new Uint8Array(buffer_length);
    current_analyzer_node!.getByteTimeDomainData(data_array);
    const slice_width = width / data_array.length;
    let x = 0;
    for (let i = 0; i < data_array.length; i++) {
      const v = data_array[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) {
        canvas_ctx!.moveTo(x, y);
      } else {
        canvas_ctx!.lineTo(x, y);
      }
      x += slice_width;
    }
    canvas_ctx!.lineTo(width, height / 2);
    canvas_ctx!.lineWidth = 2;
    canvas_ctx!.strokeStyle = "rgb(0, 0, 0)";
    canvas_ctx!.stroke();
    // @ts-ignore
    anime_ref.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (mode !== "Youtube" && current_analyzer_node !== null) {
      draw();
    }
    return () => {
      if (anime_ref.current) {
        cancelAnimationFrame(anime_ref.current);
      }
    };
  }, [mode, canvas_ctx, current_analyzer_node]);

  return (
    <>
      <div
        className={mode === "Youtube" ? "sm:h-80 h-64 hidden" : "sm:h-80 h-64"}
      >
        <canvas className="sm:h-80 h-64" id="audio"></canvas>
      </div>
      <div
        className={mode === "Youtube" ? "sm:h-80 h-64" : "sm:h-80 h-64 hidden"}
      >
        <div className="sm:h-80 h-64" id="player"></div>
      </div>
    </>
  );
}
