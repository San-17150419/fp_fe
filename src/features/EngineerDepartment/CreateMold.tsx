import { useState } from "react";
import useCreateMold from "./hooks/useCreateMold";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { useENGDepartmentContext } from "./store/ENGDepartmentContext";

import Select2, { type Option } from "../../Components/modd/Select/Select";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

type InputConfig = {
  readonly: boolean;
  name: string;
  text: string;
};

type SelectConfig = {
  name: string;
  text: string;
  options: Array<Option>;
};

export default function CreateMold() {
  const { makerOptions, factoryOptions, seriesOptions, siteOptions } =
    useENGDepartmentContext();
  const [showModal, setShowModal] = useState(false);
  const { handleCreateNewMold } = useCreateMold();
  const inputHeader: Record<string, string | boolean>[] = [
    { sn_num: "唯一碼", readonly: true },
    { sys: "系列", readonly: false },
    { mold_num: "模號", readonly: false },
    { prod_name_board: "名板", readonly: false },
    { prod_name_nocolor: "定義品名", readonly: false }, //在原來的是機種
    { hole_num: "模穴數", readonly: false },
    { block_num: "塞穴數", readonly: false },
    { property_num: "財產編號", readonly: false },
  ];
  console.log(makerOptions);
  const list = [
    "sn_num",
    "sys",
    "mold_num",
    "prod_name_board",
    "prod_name_nocolor",
    "hole_num",
    "block_num",
    "property_num",
    "brand",
    "property",
    "site",
    "pnb_state",
    "maker",
    "dutydate_month",
    "spare",
  ];
  const config: Record<string, InputConfig | SelectConfig> = (() => {
    const config: Record<string, InputConfig | SelectConfig> = {};

    return config;
  })();
  const selectheaders: Array<{
    readonly: boolean;
    options: Array<Option>;
    name: string;
    text: string;
  }> = [
    {
      name: "brand",
      text: "品牌",
      readonly: false,
      options: [{ id: "1", text: "品牌", value: "品牌" }],
    },
    {
      name: "property",
      text: "資產歸屬",
      readonly: false,
      options: factoryOptions.toSpliced(0, 1),
    },
    {
      name: "site",
      text: "位置",
      readonly: false,
      options: siteOptions.toSpliced(0, 1),
    },
    {
      name: "state",
      text: "狀態",
      readonly: false,
      options: (() => {
        const options = [
          "開發中",
          "製模中",
          "待生產",
          "待驗收",
          "生產中",
          "待維修",
          "維修中",
          "待轉回",
          "移轉中",
          "待報廢",
          "已報廢",
        ];
        return options.map((d) => ({ id: d, text: d, value: d }));
      })(),
    },
    {
      name: "maker",
      text: "廠商代號",
      readonly: false,
      options: makerOptions.toSpliced(0, 1),
    },
  ];

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        新增模具
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form
          action=""
          onSubmit={handleCreateNewMold}
          className="m-auto grid w-fit grid-flow-row grid-cols-2 gap-8 text-nowrap border p-2"
        >
          {inputHeader.map((h) => (
            <div
              key={Object.keys(h)[0]}
              className="flex h-full items-center justify-between gap-4 p-2"
            >
              <label className="w-1/4" htmlFor={Object.keys(h)[0]}>
                {h[Object.keys(h)[0]]}
              </label>
              <div className="w-3/4">
                <input
                  type="text"
                  id={Object.keys(h)[0]}
                  className={clsx(
                    "rounded-md px-2 py-1",
                    h.readonly
                      ? "bg-white"
                      : "border border-gray-100/50 bg-gray-100",
                  )}
                  disabled={h.readonly ? true : false}
                />
              </div>
            </div>
          ))}
          {/* <Select name="maker" options={makerOptions} /> */}
          {selectheaders.map((h) => (
            <div
              key={h.name}
              className="flex h-full items-center justify-between gap-4 p-2"
            >
              <label className="w-1/4" htmlFor={h.name}>
                {h.text}
              </label>
              <div className="w-3/4">
                <Select2 name={h.name} options={h.options}></Select2>
              </div>
            </div>
          ))}
          <div className="flex h-full items-center justify-between gap-4 p-2">
            <label className="w-1/4" htmlFor="date">
              開模日期
            </label>
            <div className="w-3/4">
              <input
                className="w-full rounded-md border px-2 py-1 shadow-sm shadow-gray-500"
                type="date"
                name="date"
                id="date"
              />
            </div>
          </div>
          <div className="col-span-2 flex h-full items-center justify-between gap-4 p-2">
            <label className="w-1/8" htmlFor="spare">
              開模日期
            </label>
            <div className="w-full">
              <textarea
                className="w-full rounded-md border border-black"
                name="spare"
                id="spare"
              >
                測試
              </textarea>
            </div>
          </div>
          <button
            className="ml-auto w-1/2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            送出
          </button>
        </form>
      </Modal>
    </div>
  );
}

function Container() {}
