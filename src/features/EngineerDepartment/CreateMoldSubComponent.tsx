import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import Select, { type Option } from "../../Components/modd/Select/Select";
import clsx from "clsx";
import Input from "../../Components/modd/Input/InputBase";
export default function CreateMoldSubComponent({
  makerOptions,
  propertyOptions,
  siteOptions,
  isSnNumReady,
  handleReset,
}: PreFilterData & { isSnNumReady: boolean; handleReset: () => void }) {
  const inputHeader: Record<string, string | boolean>[] = [
    { prod_name_board: "名板", readonly: false },
    { prod_name_nocolor: "定義品名", readonly: false }, //在原來的是機種
    { hole_num: "模穴數", readonly: false },
    { block_num: "塞穴數", readonly: false },
    { property_num: "財產編號", readonly: false },
  ];
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
      options: propertyOptions,
      // options: propertyOptions.toSpliced(0, 1),
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
    <>
      {inputHeader.map((h) => (
        <div key={Object.keys(h)[0]} className="">
          <label
            className="flex h-full items-center justify-between gap-4 p-2"
            htmlFor={Object.keys(h)[0]}
          >
            <span className="w-1/4">{h[Object.keys(h)[0]]} </span>
            <Input
              type="text"
              id={Object.keys(h)[0]}
              className={clsx(
                "w-3/4",
                h.readonly
                  ? "bg-white"
                  : "border border-gray-100/50 bg-gray-100",
              )}
              disabled={h.readonly ? true : false}
            />
          </label>
        </div>
      ))}
      {selectheaders.map((h) => (
        <div
          key={h.name}
          className="flex h-full items-center justify-between gap-4 p-2"
        >
          <label className="w-1/4" htmlFor={h.name}>
            {h.text}
          </label>
          <div className="w-3/4">
            <Select name={h.name} options={h.options}></Select>
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
          ></textarea>
        </div>
      </div>
      <button
        className={clsx(
          "ml-auto w-1/2 rounded bg-blue-500 px-4 py-2 font-bold text-white",
          !isSnNumReady ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700",
        )}
        disabled={!isSnNumReady}
        type="submit"
      >
        送出
      </button>
      <input
        onClick={handleReset}
        className={clsx(
          "ml-auto w-1/2 rounded bg-blue-500 px-4 py-2 font-bold text-white",
          !isSnNumReady ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700",
        )}
        disabled={!isSnNumReady}
        form="Create Mold"
        type="reset"
      />
    </>
  );
}
