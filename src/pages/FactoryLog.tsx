import FactoryLogTable from "../Components/modd/Table/FactoryLog/FactoryLogPage";

export default function FactoryLog() {
  return (
    <div className="flex h-full overflow-auto w-full flex-col gap-4 bg-zinc-200 shadow shadow-slate-400">
      <FactoryLogTable />
    </div>
  );
}
