import { useFactoryLogContext } from "./FactoryLogContext";
import Loading from "../../../Loading";
import FactoryTableComponent from "./FactoryTableComponent";

export default function FactoryLogTable() {
  const { postData, duration, isRequestMade, isTableDataReady } =
    useFactoryLogContext();
  if (!postData) return null;
  if (!isRequestMade) return null;
  if (!isTableDataReady) return <Loading />;
  return (
    <div>
      {postData &&
        Object.keys(postData).map((department: string, index) => (
          <FactoryTableComponent
            department={department}
            sysData={postData[department]}
            dateRanges={duration}
            key={department}
            index={index}
          />
        ))}
    </div>
  );
}
