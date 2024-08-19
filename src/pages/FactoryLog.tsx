import FactoryLogPreFilter from "../Components/modd/FactoryLog/FactoryLogFilter";
import Loading from "../Components/Loading";
import axios from "axios";
import { useState, useEffect } from "react";
import { type FactoryLogPreData } from "../Components/modd/FactoryLog/types/factoryLogDataType";
// import { useTheme } from "../stores/ThemeContext";
export default function FactoryLog() {
  const [preDataLoaded, setPreDataLoaded] = useState(false);
  const [preData, setPreData] = useState<FactoryLogPreData["preData"] | null>(
    null,
  );
  // const { isSemiBold, isTextBase, setIsSemiBold, setIsTextBase } = useTheme();
  const api = import.meta.env.VITE_FACTORY_LOG_URL;

  useEffect(() => {
    const fetchPreData = async () => {
      try {
        const response = await axios.get<FactoryLogPreData>(`${api}/pre-data/`);
        const data = response.data;
        const { factory, point, date_type, dep } = data.preData;
        setPreData({ factory, point, date_type, dep });
        setPreDataLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreData();
  }, []);
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-32 pt-20 lg:px-36 desktop:px-52">
      {/* <div className="flex gap-2">
        <button
          type="button"
          className="rounded-sm bg-gray-400 px-2 py-1"
          aria-label="change font size"
          onClick={() => setIsTextBase(!isTextBase)}
        >
          {isTextBase ? "大" : "小"}
        </button>
        <button
          type="button"
          className="rounded-sm bg-gray-400 px-2 py-1"
          aria-label="change font weight"
          onClick={() => setIsSemiBold(!isSemiBold)}
        >
          {isSemiBold ? "粗" : "正"}
        </button>
      </div> */}
      {preDataLoaded && preData ? (
        <FactoryLogPreFilter preData={preData} />
      ) : (
        <Loading />
      )}
    </div>
  );
}
