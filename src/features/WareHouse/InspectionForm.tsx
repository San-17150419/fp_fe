import { type Data } from "./pages/HistoryQuery";
type InspectionFormProps = {
  data: Data;
};
export default function InspectionForm({ data }: InspectionFormProps) {
  return (
    <>
      <h1 className="mx-2 mb-2 bg-stone-600 p-2 text-center text-xl font-semibold text-white outline">
        {data.doc_class}| {data.order_prodModel}| {data.order_prodNum}
      </h1>
      <table className="min-w-[700px] table-fixed text-center">
        <thead>
          <tr>
            <th rowSpan={2}>檢驗項目</th>
            <th rowSpan={2}>抽樣數</th>
            <th colSpan={3} className="border-b">
              (AC/不良數)
            </th>
            <th rowSpan={2}>檢驗記錄</th>
            <th rowSpan={2}>結果</th>
          </tr>
          <tr className="border-b">
            <th>嚴重</th>
            <th>主要</th>
            <th>次要</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="border-b even:bg-slate-100">
              <td className="w-[80px]">A</td>
              <td className="w-[80px]">0</td>
              <td className="w-[50px]"></td>
              <td className="w-[50px]"></td>
              <td className="w-[50px]"></td>
              <td className="flex justify-center gap-3 text-sm">
                <div className="m-1 px-2 py-1">0.30</div>
                <div className="m-1 px-2 py-1">0.28</div>
                <div className="m-1 px-2 py-1">0.32</div>
                <div className="m-1 px-2 py-1">0.30</div>
                <div className="m-1 px-2 py-1">0.30</div>
              </td>
              <td className="w-[70px]">OK</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
