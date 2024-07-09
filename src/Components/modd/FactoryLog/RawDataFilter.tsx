import React, { useState } from "react";
import Select from "../Select/Select";
import { useFactoryLogDataContext } from "./FactoryLogContext";

const SecondFilterArea: React.FC = () => {
  const { preData, rawData, isRawDataLoading } = useFactoryLogDataContext();
  const [department, setDepartment] = useState<string>("");
  const [point, setPoint] = useState<string>("");

  const factory = rawData?.post.factory || "";
  const depOptions = preData.dep[factory] || [];
  const pointOptions = preData.point;

  if (isRawDataLoading) {
    return <div></div>;
  }
  return (
    <>
      <Select onSelect={setDepartment} name="department" options={depOptions} />
      <Select onSelect={setPoint} name="point" options={pointOptions} />
      {/* Render filtered data here based on department and point */}
    </>
  );
};

export default SecondFilterArea;
