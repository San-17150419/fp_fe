import { FactoryLogContextProvider } from "./FactoryLogContext";
import FactoryLogPreFilter from "./FactoryLogPreFilter";
import FactoryLogTable from "./FactoryLogTable";

export default function FactoryLog() {
  return (
    <FactoryLogContextProvider>
      <div className="mx-8 my-4 flex h-full grow flex-col flex-wrap gap-4 p-2 desktop:mx-20">
        <FactoryLogPreFilter />
        <FactoryLogTable />
      </div>
    </FactoryLogContextProvider>
  );
}
