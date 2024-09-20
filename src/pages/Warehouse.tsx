import React from "react";
import Select from "../Components/modd/Select/Select";
import { LuUpload } from "react-icons/lu";
export default function Warehouse() {
  return (
    <div className="flex gap-x-24 mb-5">
      <form
        action=""
        className="flex  w-[600px] h-fit flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
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
            <span className="font-extrabold text-red-400 text-lg">退貨產品 *</span>
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
          <label htmlFor="" className="flex col-span-2 flex-col gap-2 row-span-2  ">
            <span> 備註 * </span>
            <textarea className="w-full border rounded-md" name="" id="" rows={3}></textarea>
          </label>
        </div>

        <button className="col-span-2 my-4 flex items-center justify-center gap-4 rounded-md bg-gray-600 py-4 text-lg text-white shadow-[0_10px_25px_0_rgba(0,0,0,0.2)]">
          <LuUpload size={24} />
          確認上傳
        </button>
      </form>
    </div>
  );
}
