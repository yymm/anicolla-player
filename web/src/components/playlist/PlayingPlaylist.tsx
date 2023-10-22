import {usePlayerCtx} from "../../stores/Provider"
import {PlayerRecord} from "./PlayerRecord";

export function PlayingPlaylist() {
  const { records } = usePlayerCtx();
  return (
    <>
      {
        records.map((record, i)=> {
          return <PlayerRecord key={i} record={record} />
        })
      }
      <div className="p-2 sm:p-4 bg-white h-16"></div>
    </>
  )
}
