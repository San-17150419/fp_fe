import React, { useState } from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
import Loading from "../../../Loading";
import FactoryTableComponent from "./FactoryTableComponent";

export default function FactoryLogTable() {
  const { postData, duration, isRequestMade, isTableDataReady } =
    useFactoryLogContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState("");
  // If a row  has missing data, it will be hidden in the table by default
  // User can
  const [showHiddenColumns, setShowHiddenColumns] = useState(false);
  if (!postData) return null;
  const dateRange = ["1", "2", "3", "4"];
  // TODO: Add key to table. React is complaining. I need to check where did I forget to add key
  if (!isRequestMade) return null;
  if (!isTableDataReady) return <Loading />;
  return (
    <div>
      {postData &&
        Object.keys(postData).map((department: string) => (
          <FactoryTableComponent
            department={department}
            sysData={postData[department]}
            dateRanges={duration}
            key={department}
          />
        ))}
    </div>
  );
}
