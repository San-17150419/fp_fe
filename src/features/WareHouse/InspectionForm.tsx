import { InputHTMLAttributes } from "react";
import { type Data } from "./pages/HistoryQuery";

type InspectionFormProps = {
  data: Data;
  isReadOnly?: boolean; // Add a prop to control read-only mode
};

export default function InspectionForm({
  data,
  isReadOnly = false,
}: InspectionFormProps) {
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
              <td className="w-[80px]">
                <Input
                  type="text"
                  title="抽樣數"
                  disabled={isReadOnly}
                  className="text-center"
                />
              </td>
              <td className="w-[50px]">
                <Input
                  type="number"
                  title="嚴重"
                  disabled={isReadOnly}
                  className=""
                />
              </td>
              <td className="w-[50px]">
                <Input
                  type="number"
                  title="主要"
                  disabled={isReadOnly}
                  className=""
                />
              </td>
              <td className="w-[50px]">
                <Input
                  type="number"
                  title="次要"
                  disabled={isReadOnly}
                  className=""
                />
              </td>
              <td className="flex justify-center gap-3 text-sm">
                <div className="m-1 px-2 py-1">
                  <Input
                    type="number"
                    title="紀錄1"
                    disabled={isReadOnly}
                    className=""
                    defaultValue={0.3}
                  />
                </div>
                <div className="m-1 px-2 py-1">
                  <Input
                    type="number"
                    title="紀錄2"
                    disabled={isReadOnly}
                    className=""
                    defaultValue={0.28}
                  />
                </div>
                <div className="m-1 px-2 py-1">
                  <Input
                    type="number"
                    title="紀錄3"
                    disabled={isReadOnly}
                    className=""
                    defaultValue={0.32}
                  />
                </div>
                <div className="m-1 px-2 py-1">
                  <Input
                    type="number"
                    title="紀錄4"
                    disabled={isReadOnly}
                    className=""
                    defaultValue={0.3}
                  />
                </div>
                <div className="m-1 px-2 py-1">
                  <Input
                    type="number"
                    title="紀錄5"
                    disabled={isReadOnly}
                    className=""
                    defaultValue={0.3}
                  />
                </div>
              </td>
              <td className="w-[70px]">OK</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Input({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-[80px] bg-transparent p-2 text-center ${props.disabled ? "pointer-events-none caret-transparent" : "border border-gray-300"}`}
    />
  );
}
