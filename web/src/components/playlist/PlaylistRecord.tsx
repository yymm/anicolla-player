import {useAddSongRecord} from "../../hooks/usePlayerControl";
import { useToast } from "../../hooks/useToast";
import {
  usePlayerCtx,
  usePlaylistCtx,
} from "../../stores/Provider";
import { SongRecord } from "../../stores/models";

export function PlaylistRecord({ record }: { record: SongRecord }) {
  const { search_by } = usePlaylistCtx();
  const { is_predefined } = usePlayerCtx();
  const addSongRecord = useAddSongRecord();
  const toast = useToast();
  const onClick = () => {
    addSongRecord(record);
    if (is_predefined) {
      toast("Can't add to Predefined", "error");
    } else {
      toast("Add to playlist");
    }
  };
  return (
    <div
      className="p-2 sm:p-4 shadow-lg cursor-pointer bg-gray-700"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="relative flex-shrink-0">
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-gray-600 bg-white border-2 border-gray-600 rounded-full -top-2 -right-2">
            {record.op_or_ed}
          </div>
          <img
            className="h-12 w-12 rounded-lg self-center"
            src={`https://i.ytimg.com/vi/${record.video_id}/default.jpg`}
            alt={record.song_title}
          />
        </div>
        {search_by === "Title" ? (
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-bold">{record.anime_title}</h3>
            <div className="text-gray-500 flex items-center justify-between">
              <span className="truncate text-sm">{record.song_title}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate">
              {"Title: " + record.song_title + " " + record.anime_title}
            </p>
            <p className="text-xs truncate">
              {"Vocal: " + record.vocal + " Guiter: " + record.guiter}
            </p>
            <p className="text-xs truncate">
              {"Key: " + record.key + " Bass: " + record.bass}
            </p>
            <p className="text-xs truncate">{"Drum: " + record.drum}</p>
          </div>
        )}
      </div>
    </div>
  );
}
