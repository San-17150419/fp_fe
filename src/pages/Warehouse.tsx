import { useState } from "react";
import Modal from "../Components/modd/Modal/NonDialogModal";
import { LuUpload } from "react-icons/lu";
export default function Warehouse() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-5 flex gap-x-24">
      <button onClick={() => setIsOpen(true)}>Open</button>
      <form
        action=""
        className="flex h-fit w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
        // className="grid h-full w-[600px] grid-cols-2 space-x-4 space-y-3 bg-white px-12 py-4 shadow-lg shadow-gray-500"
      >
        <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
          輸入驗收單
        </h1>
        <div className="grid w-full grid-cols-2 gap-x-4 space-y-3 py-2">
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>收貨日期 **</span>
            <input type="date" name="" id="" required />
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>文件編碼 *</span>
            <input type="text" name="" id="" />
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>訂單編碼 *</span>
            <input type="text" name="" id="" />
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>廠商代號 *</span>
            <select name="" id=""></select>
            {/* <Select options={[]} className=" px-4" /> */}
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>訂單品名 *</span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>品名規格 *</span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>Model_No *</span>
            <select name="" id=""></select>
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2"
          >
            <span className="text-red-400">交付產品 *</span>
            <select name="" id=""></select>
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2"
          >
            <span>交貨數量 *</span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>交貨數量(輔助) </span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>單位 </span>
            <select name="" id=""></select>
          </label>
        </div>

        <button className="col-span-2 my-4 flex items-center justify-center gap-4 rounded-md bg-gray-600 py-4 text-lg text-white shadow-[0_10px_25px_0_rgba(0,0,0,0.2)]">
          <LuUpload size={24} />
          確認上傳
        </button>
      </form>
      <form
        action=""
        className="flex h-full w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
        // className="grid h-full w-[600px] grid-cols-2 space-x-4 space-y-3 bg-white px-12 py-4 shadow-lg shadow-gray-500"
      >
        <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
          輸入退貨單
        </h1>
        <div className="grid w-full grid-cols-2 gap-x-4 space-y-3 py-2">
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>退貨日期 *</span>
            <input type="date" name="" id="" required />
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>退貨原因 *</span>
            <select name="" id=""></select>
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>退貨文件編碼 *</span>
            <input type="text" name="" id="" />
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>交貨文件編碼 *</span>
            <input type="text" name="" id="" />
          </label>

          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>訂單編號 *</span>
            <input type="text" />
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>廠商代號 *</span>
            <input type="text" />
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>訂單品名 *</span>
            <input type="text" />
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>品名規格 *</span>
            <input type="text" />
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>Model_No *</span>
            <input type="text" />
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2"
          >
            <span className="text-lg font-extrabold text-red-400">
              退貨產品 *
            </span>
            <input type="text" />
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2"
          >
            <span>退貨數量 *</span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>退貨數量(輔助) </span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>單位 </span>
            <select name="" id=""></select>
          </label>
          <label
            htmlFor=""
            className="col-span-2 row-span-2 flex flex-col gap-2"
          >
            <span> 備註 * </span>
            <textarea
              className="w-full rounded-md border"
              name=""
              id=""
              rows={3}
            ></textarea>
          </label>
        </div>

        <button className="col-span-2 my-4 flex items-center justify-center gap-4 rounded-md bg-gray-600 py-4 text-lg text-white shadow-[0_10px_25px_0_rgba(0,0,0,0.2)]">
          <LuUpload size={24} />
          確認上傳
        </button>
      </form>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <table className="w-fit table-auto border-separate bg-white border-spacing-0 text-nowrap align-middle">
          <thead>
            <tr>
              <Th rowSpan={2}>檢驗項目</Th>
              <Th rowSpan={2}>抽樣數</Th>
              <Th colSpan={3}>(AC/不良數)</Th>
              <Th rowSpan={2}>檢驗記錄</Th>
              <Th rowSpan={2}>結果</Th>
            </tr>
            <tr>
              <Th>嚴重</Th>
              <Th>主要</Th>
              <Th>次要</Th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }).map((_, index) => (
              <tr>
                <Td>A</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td>
                  <input type="text" name="1" id="1" title='1' className="w-1/5" />
                  <input type="text" name="1" id="2" title='1' className="w-1/5" />
                  <input type="text" name="1" id="3" title='1' className="w-1/5" />
                  <input type="text" name="1" id="4" title='1' className="w-1/5" />
                  <input type="text" name="1" id="5" title='1' className="w-1/5" />
                </Td>
                <Td></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

function Th({
  children,
  rowSpan,
  colSpan,
}: {
  key?: string;
  children?: React.ReactNode;
  rowSpan?: number;
  colSpan?: number;
}) {
  return (
    <th
      colSpan={colSpan || 1}
      rowSpan={rowSpan || 1}
      className="h-[75px] min-w-[85px] max-w-[300px] text-nowrap border border-gray-400 p-3 text-center"
    >
      {children}
    </th>
  );
}

function Td({
  children,
  rowSpan,
  colSpan,
}: {
  key?: string;
  children?: React.ReactNode;
  rowSpan?: number;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan || 1}
      rowSpan={rowSpan || 1}
      className="h-[75px] min-w-[100px] max-w-[800px] text-nowrap border border-gray-400 p-2 text-center"
    >
      {children}
    </td>
  );
}
