import FactoryTableComponent from "./FactoryTableComponent";
import {
  type FactoryLogRawData,
  type DepartmentMap,
} from "./FactoryLogDataType";
import { transformData } from "./formatFactoryData";
import { useEffect, useState } from "react";
type FactoryLogTableProps = {
  logData: FactoryLogRawData;
};
export default function FactoryLogTable({ logData }: FactoryLogTableProps) {
  // const { postData, duration, isRequestMade, isTableDataReady } =
  //   useFactoryLogContext();
  const [postData, setPostData] = useState<Record<string, any> | null>(null);
  useEffect(() => {
    const formData = transformData(logData.data);
    setPostData(transformData(logData.data));
  }, [logData.data]);

  // Just a safe check. It should not happen since this component is only rendered when the data is ready
  if (!postData)
    return (
      <div>
        No data available <h2>This should not happen</h2>
      </div>
    );
  console.log(postData);
  return (
    <div>
      {postData &&
        Object.keys(postData).map((department: string, index) => (
          <FactoryTableComponent
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
