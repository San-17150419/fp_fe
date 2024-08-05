import ProgressBar from "./ProgressBar";
export default function Container() {
  return (
    <div className="w-full border border-black p-4">
      <h1 className="rounded-md border border-yellow-600 bg-yellow-300 p-4 text-center bg-gradient-to-br from-yellow-300 to-amber-400">
        <i>各部門生產達成率</i>
      </h1>
      <h2 className="my-4 flex justify-between text-sm text-gray-400">
        <span>更新時間: {new Date().toLocaleString()} </span>
        <span>
          總計: <span className="text-2xl">??? 單位</span>
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <ProgressBar target={100} achieved={75} />
        <ProgressBar target={100} achieved={36} />
        <ProgressBar target={100} achieved={86} />
        <ProgressBar target={100} achieved={46} />
        <ProgressBar target={100} achieved={36} />
        <ProgressBar target={100} achieved={74} />
        <ProgressBar target={100} achieved={12} />
        <ProgressBar target={100} achieved={52} />
        <ProgressBar target={100} achieved={78} />
        <ProgressBar target={100} achieved={65} />
        <ProgressBar target={100} achieved={14} />
        <ProgressBar target={100} achieved={14} />
        <ProgressBar target={100} achieved={44} />
        <ProgressBar target={100} achieved={100} />
      </div>
    </div>
  );
}
