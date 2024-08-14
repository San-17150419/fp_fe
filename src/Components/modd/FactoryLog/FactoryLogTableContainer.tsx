import FactoryTable from "./FactoryTable";
import {
  type FactoryLogRawData,
  type DepartmentMap,
} from "./types/factoryLogDataType";
import { transformData } from "./formatFactoryData";
import { useEffect, useState } from "react";
type FactoryLogTableContainerProps = {
  logData: FactoryLogRawData;
};
export default function FactoryLogTableContainer({
  logData,
}: FactoryLogTableContainerProps) {
  // const { postData, duration, isRequestMade, isTableDataReady } =
  //   useFactoryLogContext();
  const [postData, setPostData] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    setPostData(transformData(logData.data));
  }, [logData.data]);

  // Just a safe check. It should not happen since this component is only rendered when the data is ready
  if (!postData)
    return (
      <div>
        No data available <h2>This should not happen</h2>
      </div>
    );
  return (
    <div>
      {postData &&
        Object.keys(postData).map((department: string, index) => (
          <FactoryTable
            factory={logData.post.factory}
            // TODO: modify type definition to enable type checking
            department={
              department as DepartmentMap[typeof logData.post.factory]
            }
            sysData={postData[department]}
            duration={logData.duration}
            key={`factory-table-${department}-${index}`}
            index={index}
          />
        ))}
    </div>
  );
}