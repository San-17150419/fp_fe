import { useFactoryLogContext } from "./FactoryLogContext";
import Select from "../../Select/Select";
import { useTranslation } from "react-i18next";
export default function FactoryLogPostFilter() {
  const {
    isPostDataReady,
    departmentList,
    isRequestMade,
    setCurrentDepartment,
  } = useFactoryLogContext();
  const { t } = useTranslation();
  if (!isRequestMade) return null;
  if (!isPostDataReady) return <div>Loading...</div>;
  return (
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
  );
}
