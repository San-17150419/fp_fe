import FactoryLogTable from "../Components/modd/Table/FactoryLog/FactoryLogPage";

export default function FactoryLog() {
  return (
    <div className="flex h-full  flex-col gap-4 overflow-auto px-40 pt-20">
      <FactoryLogTable />
    </div>
  );
}
