import React from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import Select from "../../Select/Select";
import { useTranslation } from "react-i18next";
export default function FactoryLogPostFilter() {
  const {
    rawData,
    isPostDataReady,
    departmentList,
    isRequestMade,
    setCurrentDepartment,
  } = useFactoryLogContext();
  const { t } = useTranslation();
  if (!isRequestMade) return null;
  if (!isPostDataReady) return <div>Loading...</div>;
  return (
    <section className="min-h-[100px] outline">
      <div className="w-1/4 pl-2 pr-3">
        <Select
          onSelect={(value) => setCurrentDepartment(value as string)}
          options={departmentList.map((department) => ({
            value: department,
            text: t(department),
          }))}
          name="department"
        />
      </div>
    </section>
  );
}
