import { useState } from "react";
import { type FilterData } from "./types";
import { useTranslation } from "react-i18next";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import Select from "../../Components/modd/Select/Select";
import clsx from "clsx";
import { useENGDepartmentContext } from "./store/ENGDepartmentContext";
type UpdateProps = {
  data: FilterData["data"][number];
};

const header: Record<string, string | boolean>[] = [
  { prod_name_board: "名板", readonly: false },
  { prod_name_nocolor: "定義品名", readonly: false }, //在原來的是機種
  { sys: "系列", readonly: true },
  { sn_num: "唯一碼", readonly: true },
  { mold_num: "模號", readonly: true },
  { hole_num: "模穴數", readonly: true },
  { site: "位置", readonly: false },
  { property: "財產歸屬", readonly: false },
  { state: "狀態", readonly: false },
  { maker: "廠商代號", readonly: false },
  { dutydate_month: "開模日期", readonly: false },
];

export default function Update({ data }: UpdateProps) {
  const { makerOptions } = useENGDepartmentContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-md bg-blue-600 p-2 text-white"
      >
        更新
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="min-h-full">
          {data?.id_ms}
          <form
            action=""
            className="m-auto grid w-fit grid-flow-row grid-cols-2 gap-8 text-nowrap border p-2"
          >
            {header.map((h) => (
              <div
                key={Object.keys(h)[0]}
                className="flex h-full items-center justify-between gap-4 p-2"
              >
                <label htmlFor={Object.keys(h)[0]}>
                  {t(Object.keys(h)[0])}
                </label>
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
                  defaultValue={
                    data[Object.keys(h)[0] as keyof typeof data] || ""
                  }
                />
              </div>
            ))}
            <div className="flex h-full items-center justify-between gap-4 p-2">
              <Select name="maker" options={makerOptions} />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
