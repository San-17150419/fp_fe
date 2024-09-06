import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import Select, { type Option } from "../../Components/modd/Select/Select";
import clsx from "clsx";
import Input from "../../Components/modd/Input/InputBase";
import { AnimatePresence, motion } from "framer-motion";
export default function CreateMoldSubComponent({
  makerOptions,
  propertyOptions,
  siteOptions,
  isSnNumReady,
  handleReset,
  isFormSubmitted,
  setIsFormSubmitted,
}: PreFilterData & {
  isSnNumReady: boolean;
  handleReset: () => void;
  isFormSubmitted: boolean;
  setIsFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  isFormSubmitted;
  const inputConfig: Array<{
    name: string;
    text: string;
    readonly?: boolean;
    pattern?: string;
  }> = [
    { name: "prod_name_board", text: "名板", readonly: false },
    { name: "prod_name_nocolor", text: "定義品名", readonly: false }, //在原來的是機種
    { name: "hole_num", text: "模穴數", readonly: false, pattern: "[0-9]" },
    { name: "block_num", text: "塞穴數", readonly: false, pattern: "[0-9]" },
    { name: "property_num", text: "財產編號", readonly: false },
  ];
  console.log(siteOptions);
  const selectheaders: Array<{
    readonly: boolean;
    options: Array<Option>;
    name: string;
    text: string;
    required?: boolean;
    pattern?: RegExp;
  }> = [
    {
      name: "brand",
      text: "品牌",
      readonly: false,
      options: [
        { id: "1", text: "無", value: 0 },
        { id: "2", text: "第一品牌", value: 1 },
        { id: "3", text: "第二品牌", value: 2 },
      ],
    },
    {
      name: "property",
      text: "財產歸屬",
      readonly: false,
      options: (() => {
        const propertyOptionsCopy = [...propertyOptions];
        propertyOptionsCopy.splice(0, 1);
        propertyOptionsCopy.unshift({ id: "1", text: "無", value: "" });
        return propertyOptionsCopy;
      })(),
      required: true,
      // options: propertyOptions.toSpliced(0, 1),
    },
    {
      name: "site",
      text: "位置",
      readonly: false,
      options: siteOptions,
      required: true,
    },
    {
      name: "state",
      text: "狀態",
      required: true,
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
        const newOptions = options.map((d) => ({ id: d, text: d, value: d }));
        newOptions.unshift({
          id: "1",
          text: "無",
          value: "",
        });
        return newOptions;
      })(),
    },
    {
      name: "maker",
      text: "廠商代號",
      required: true,
      readonly: false,
      options: makerOptions,
    },
  ];

  return (
    <AnimatePresence>
      {isSnNumReady && (
        <>
          {inputConfig.map(({ name, text, readonly, pattern }) => (
            <motion.div key={name} className="">
              <label
                className="flex h-full items-center justify-between gap-4 p-2"
                htmlFor={name}
              >
                <span className="w-1/4">{text} </span>
                <Input
                  type="text"
                  id={name}
                  required
                  className={clsx(
                    "w-3/4",
                    readonly
                      ? "bg-white"
                      : "border border-gray-100/50 bg-gray-100",
                  )}
                  pattern={pattern}
                  disabled={readonly ? true : false}
                />
              </label>
            </motion.div>
          ))}
          {selectheaders.map((h) => (
            <motion.div
              key={h.name}
              className="flex h-full items-center justify-between gap-4 p-2"
            >
              <label className="w-1/4" htmlFor={h.name}>
                {h.text}
              </label>
              <div className="w-3/4">
                <Select
                  name={h.name}
                  options={h.options}
                  required={h.required}
                ></Select>
              </div>
            </motion.div>
          ))}
          <motion.div className="flex h-full items-center justify-between gap-4 p-2">
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
          </motion.div>
          <motion.div className="col-span-2 flex h-full items-center justify-between gap-4 p-2">
            <label className="w-1/8" htmlFor="spare">
              備註
            </label>
            <div className="w-full">
              <textarea
                className="w-full rounded-md border border-black"
                name="spare"
                id="spare"
              ></textarea>
            </div>
          </motion.div>
          <select name="123" id="" title="test" required>
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <button
            className={clsx(
              "ml-auto w-1/2 rounded bg-blue-500 px-4 py-2 font-bold text-white",
              !isSnNumReady
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-700",
            )}
            disabled={!isSnNumReady}
            onClick={() => setIsFormSubmitted(true)}
            type="submit"
          >
            送出
          </button>
          <input
            onClick={handleReset}
            className={clsx(
              "ml-auto w-1/2 rounded bg-blue-500 px-4 py-2 font-bold text-white",
              !isSnNumReady
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-700",
            )}
            disabled={!isSnNumReady}
            form="Create Mold"
            type="reset"
          />
        </>
      )}
    </AnimatePresence>
  );
}
