import TableFetcher from "../Components/modd/Table/TableFetcher";
import { getTableData } from "../Components/modd/Table/api";

export default function DataTablePage() {

  return <TableFetcher fetchData={getTableData} />;
}
