import {useRemoveSongRecord, useSelectVideo} from "../../hooks/usePlayerControl";
import { useToast } from "../../hooks/useToast";
import { usePlayerCtx } from "../../stores/Provider";
import { SongRecord } from "../../stores/models";
import { SimpleTrash } from "../icons/SimpleTrash";

export function PlayerRecord({ record }: { record: SongRecord }) {
  const { is_predefined, playing_info } = usePlayerCtx();
  const toast = useToast();
  const selectVideo = useSelectVideo();
  const removeSongRecord = useRemoveSongRecord();
  const removeSongRecordHandler = () => {
    removeSongRecord(record.video_id);
    toast("Remove to playlist", "warn");
  };
  const selectVideoHandler = () => {
    selectVideo(record.video_id);
  };
  return (
    <div className={playing_info?.video_id !== record.video_id ? "p-2 sm:p-4 shadow-lg bg-white" : "p-2 sm:p-4 shadow-lg bg-blue-200"}>
      <div className="flex items-center space-x-4">
        <div className="relative flex-shrink-0" onClick={() => selectVideoHandler()}>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-gray-600 bg-white border-2 border-gray-600 rounded-full -top-2 -right-2">
            {record.op_or_ed}
          </div>
          <img
            className="h-12 w-12 rounded-lg self-center"
            src={`https://i.ytimg.com/vi/${record.video_id}/default.jpg`}
            alt={record.song_title}
          />
        </div>
        <div className="flex-1 min-w-0" onClick={() => selectVideoHandler()}>
          <h3 className="truncate font-bold">{record.anime_title}</h3>
          <div className="text-gray-500 flex items-center justify-between">
            <span className="truncate text-sm">{record.song_title}</span>
          </div>
        </div>
        {is_predefined ? (
          <></>
        ) : (
          <div
            className="inline-flex items-center text-base font-semibold text-gray-400 cursor-pointer"
            onClick={removeSongRecordHandler}
          >
            <SimpleTrash />
          </div>
        )}
      </div>
    </div>
  );
}
