import FactoryLogPreFilter from "../Components/modd/Table/FactoryLog/FactoryLogPreFilter";
import Loading from "../Components/Loading";
import axios from "axios";
import { useState, useEffect } from "react";
import { type FactoryLogPreData } from "../Components/modd/Table/FactoryLog/FactoryLogDataType";
export default function FactoryLog() {
  const [preDataLoaded, setPreDataLoaded] = useState(false);
  const [preData, setPreData] = useState<FactoryLogPreData["preData"] | null>(
    null,
  );
  const api = process.env.REACT_APP_FACTORY_LOG_URL;

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
    <div className="flex h-full flex-col gap-4 overflow-auto px-40 pt-20">
      {preDataLoaded && preData ? (
        <FactoryLogPreFilter preData={preData} />
      ) : (
        <Loading />
      )}
    </div>
  );
}
