import { FactoryLogContextProvider } from "./FactoryLogContext";
import FactoryLogPreFilter from "./FactoryLogPreFilter";
import FactoryLogTable from "./FactoryLogTable";

export default function FactoryLog() {
  return (
    <FactoryLogContextProvider>
      <div className="flex h-full grow flex-col gap-4 mx-3">
        <FactoryLogPreFilter />
        <FactoryLogTable />
      </div>
    </FactoryLogContextProvider>
  );
}
