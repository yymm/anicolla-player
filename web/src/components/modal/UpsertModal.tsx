import {useCallback, useState} from "react";
import {useUpsertUserPlaylist} from "../../hooks/useUpsertUserPlaylist";
import {usePlayerCtx, usePlaylistCtx} from "../../stores/Provider";
import {Save} from "../icons/Save";

export function UpsertModal({ close }: { close: () => void}) {
  const upsert = useUpsertUserPlaylist();
  const {selected_playlist_id} = usePlayerCtx();
  const {user_defined: playlists} = usePlaylistCtx();
  const isNew = selected_playlist_id === null || selected_playlist_id === "";
  const nameDefaultValue = playlists.find(p => p.id === selected_playlist_id)?.name || "";
  const [name, setName] = useState(nameDefaultValue);
  const upsertHandler = useCallback(() => {
    upsert(name, !isNew);
    close();
  }, [name, isNew]);
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={close}></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10 text-green-500">
                  <Save />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    {isNew ? "Save user playlist" : "Update user playlist"}
                  </h3>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                onClick={upsertHandler}
              >
                {isNew ? "Save" : "Update"}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={close}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
