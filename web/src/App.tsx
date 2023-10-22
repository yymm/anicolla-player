import { Menu } from "./components/menu/Menu";
import { PlayingPlaylist } from "./components/playlist/PlayingPlaylist";
import { MiniController } from "./components/controller/MiniController";
import { Controller } from "./components/controller/Controller";
import { Dots } from "./components/icons/Dots";
import { Cross } from "./components/icons/Cross";
import { Player } from "./components/player/Player";
import { useInitializePredefinedPlaylist } from "./hooks/useInitializePredefinedPlaylist";
import { Toaster } from "react-hot-toast";
import { useInitializeUserPlaylist } from "./hooks/useInitializeUserPlaylist";
import { usePlaylistCtx, usePlaylistCtxDispatch } from "./stores/Provider";

function App() {
  const { menuOpen } = usePlaylistCtx();
  const dispatch = usePlaylistCtxDispatch();
  const { isLoading, isError } = useInitializePredefinedPlaylist();
  useInitializeUserPlaylist();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>...Error...</div>;
  }

  return (
    <div className="absolute inset-0 flex flex-col mx-auto pt-4">
      <header className="flex sm:px-8 px-4 justify-between items-center sm:h-16 h-8">
        <div className="flex items-center">
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => dispatch({ type: "toggleMenuOpen" })}
          >
            {menuOpen ? <Cross /> : <Dots />}
          </button>
        </div>
        <div className="relative">
          <img
            className="sm:h-16 h-12 sm:w-16 w-12 rounded-full"
            src="https://yt3.googleusercontent.com/ytc/APkrFKbDjYD8rCtXPpqW3ZwCkXmGl916M408P7COr8Nq=s176-c-k-c0x00ffffff-no-rj"
            alt="新作アニメの曲をまとめてコラボ"
          />
        </div>
        {menuOpen && (
          <div
            className="sm:top-20 top-14 absolute left-0 z-10 mt-2 w-full origin-top-right text-gray-400 bg-gray-700 py-1 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <Menu />
          </div>
        )}
      </header>
      {/* audio component */}
      <div className="relative mt-5">
        <Player />
      </div>
      {/* mini controller (loop, player mode, suffle) */}
      <div className="mx-auto mt-2 w-4/5">
        <MiniController />
      </div>
      {/* playlist component wrapper */}
      <div className="w-full mt-2 px-0 sm:px-5 overflow-y-auto flex-1">
        <PlayingPlaylist />
      </div>
      {/* global controller (play, prev,next) */}
      <div className="absolute bottom-0 border-gray-100 border-2 left-0 bg-white shadow-xl rounded-full w-full h-16">
        <Controller />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
