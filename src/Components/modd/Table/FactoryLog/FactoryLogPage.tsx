import { FactoryLogContextProvider } from "./FactoryLogContext";
import FactoryLogPreFilter from "./FactoryLogPreFilter";
import FactoryLogPostFilter from "./FactoryLogPostFilter";
import FactoryLogTable from "./FactoryLogTable";
import TableContainer from "../TableContainer";

export default function FactoryLog() {
  return (
    <FactoryLogContextProvider>
      <div className="flex h-full grow flex-col flex-wrap gap-4 p-2 outline">
        <FactoryLogPreFilter />
        <FactoryLogPostFilter />
        <TableContainer>
          <FactoryLogTable />
        </TableContainer>
      </div>
    </FactoryLogContextProvider>
  );
}
