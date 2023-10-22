import {usePlaylistCtx, usePlaylistCtxDispatch} from "../../stores/Provider";

export function SearchCondition() {
  const {search_by} = usePlaylistCtx()
  const dispatch = usePlaylistCtxDispatch()

  const isChecked = search_by !== "Title";

  const handleCheckboxChange = () => {
    dispatch({ type: "updateSearchBy", payload: { search_by: isChecked ? "Title" : "Performer" }})
  }

  return (
    <div className="relative flex justify-center w-full text-gray-500 pt-2">
      <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
      <span className="label flex items-center text-sm font-medium pr-2">
        Search By:
      </span>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <span className="label flex items-center text-sm font-medium">
          Title
        </span>
        <span
          className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
            isChecked ? "bg-[#212b36]" : "bg-[#CCCCCE]"
          }`}
        >
          <span
            className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
              isChecked ? "translate-x-[28px]" : ""
            }`}
          ></span>
        </span>
        <span className="label flex items-center text-sm font-medium">
          Performer
        </span>
      </label>
    </div>
  );
}
