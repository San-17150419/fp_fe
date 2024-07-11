import { FactoryLogContextProvider } from "./FactoryLogContext";
import FactoryLogPreFilter from "./FactoryLogPreFilter";
import FactoryLogPostFilter from "./FactoryLogPostFilter";
import FactoryLogTable from "./FactoryLogTable";
import TableContainer from "../TableContainer";
import { useTranslation } from "react-i18next";

export default function FactoryLog() {
  const { t } = useTranslation();
  return (
    <FactoryLogContextProvider>
      <div className="flex h-full grow flex-col flex-wrap gap-4 p-2">
        <FactoryLogPreFilter />
        <div className="border-b-2 border-gray-500 p-2 text-center text-xl font-extrabold text-gray-700">
          {t("生產部門")} {t("達成率")}
        </div>
        <TableContainer className="text-gray-700 outline">
          <FactoryLogPostFilter />
          <FactoryLogTable />
        </TableContainer>
      </div>
    </FactoryLogContextProvider>
  );
}
