import {usePlaylistCtx} from "../../stores/Provider";
import { PredefinedPlaylist } from "../playlist/PredefinedPlaylist";
import { UserPlaylist } from "../playlist/UserPlaylist";
import { Search } from "../search/Search";
import {SearchCondition} from "../search/SearchCondition";
import { SearchResult } from "../search/SearchResult";

export function Menu() {
  const { search_keyword } = usePlaylistCtx();
  return (
    <>
      {/* 検索窓 */}
      <Search />
      {/* 検索窓 */}
      <SearchCondition />
      {/* Predefined Playlist */}
      {
        search_keyword.length === 0 ?
          <>
            <UserPlaylist />
            <PredefinedPlaylist />
          </>
          :
          <SearchResult />
      }
    </>
  );
}
