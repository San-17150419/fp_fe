import { useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { TfiMenuAlt } from "react-icons/tfi";
import clsx from "clsx";
import { TbCaretDownFilled } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import Loading from "../../Components/Loading";
// This is a temporary component for testing

type TableProps = {
  data: { [key: string]: number | string | undefined }[];
  //  header props act as a key to the data. Allow you to decide the order of the table and what to show. If the header props is an object, the key of the object will be used as key of the data and the value of the object will be used as the header
  header: Record<string, string>[];
  isLoading?: boolean;
};
export default function Table({ data, header, isLoading }: TableProps) {
  const [displayedColumns, setDisplayedColumns] = useState(
    header.map((h) => Object.keys(h)[0]),
  );
  const headerDictionary = header.reduce((acc, curr) => {
    return { ...acc, ...curr };
  });
  const columnsOder = header.map((h) => Object.keys(h)[0]);
  const { t } = useTranslation();
  return (
    <>
      {isLoading ? <Loading /> : ""}
      <div className="relative max-w-full overflow-hidden text-nowrap">
        {/* TODO: Extract this to a component */}
        {/* TODO: Add autocomplete to input based on preData */}
        {/* TODO: Can't maintain the order of the header */}
        <form action="" id="ENGMS-form" className="mr-4 flex justify-end">
          <Listbox multiple form="ENGMS-form">
            <ListboxButton className="my-2 h-10 cursor-pointer rounded-md border border-sky-300 bg-sky-300 p-2 hover:bg-sky-500">
              <span className="flex items-center gap-2">
                <TfiMenuAlt className="text-2xl" />
                <TbCaretDownFilled />
              </span>
            </ListboxButton>
            <ListboxOptions
              anchor="bottom end"
              className="flex h-64 flex-col rounded-md border border-gray-200 bg-white text-left [--anchor-gap:4px]"
            >
              {header.map((key) => {
                const value = Object.keys(key)[0];
                const text = Object.values(key)[0];
                return (
                  <ListboxOption
                    className="flex w-full"
                    key={value}
                    value={value}
                    as="button"
                  >
                    <label htmlFor={value} className="w-full p-1 text-left">
                      <input
                        type="checkbox"
                        className="mr-2"
                        name={value}
                        id={value}
                        onChange={() =>
                          displayedColumns.includes(value)
                            ? setDisplayedColumns(
                                displayedColumns.filter((col) => col !== value),
                              )
                            : setDisplayedColumns(
                                displayedColumns.concat(value),
                              )
                        }
                        checked={displayedColumns.includes(value)}
                      />

                      {t(text)}
                    </label>
                  </ListboxOption>
                );
              })}
            </ListboxOptions>
          </Listbox>
        </form>
        <div className="relative h-[500px] max-w-full overflow-auto">
          <table className="relative w-full table-auto border-separate border-spacing-0 text-center">
            <thead className="sticky top-0 bg-gray-300">
              <tr>
                {columnsOder.map((key) => (
                  <th
                    className={clsx(
                      "border border-gray-200 p-2",
                      displayedColumns.includes(key) ? "" : "hidden",
                    )}
                    key={key.slice(0, 5 + key.length)}
                  >
                    {t(headerDictionary[key])}
                  </th>
                ))}
              </tr>
            </thead>
            {data.length === 0 && (
              <tbody>
                <tr>
                  <td
                    className="border border-gray-200 p-2"
                    colSpan={header.length}
                  >
                    {t("無資料")}
                  </td>
                </tr>
              </tbody>
            )}
            <tbody>
              {data.map((item) => (
                <tr key={item.id_ms}>
                  {columnsOder.map((key) => (
                    <td
                      className={clsx(
                        "border border-gray-200 p-2",
                        key === "sn_num" ? "text-blue-600" : "",
                        key === "prod_name_board" ? "text-red-600" : "",
                        key === "dutydate_last" ? "text-blue-600" : "",
                        displayedColumns.includes(key) ? "" : "hidden",
                      )}
                      key={key.slice(0, 5 + key.length)}
                    >
                      {key === "pnb_state" ? (
                        <span
                          className={
                            clsx(item[key as keyof typeof item] as string) ===
                            "incomplete"
                              ? "text-red-600"
                              : "text-blue-600"
                          }
                        >
                          {t(item[key as keyof typeof item] as string)}
                        </span>
                      ) : (
                        item[key as keyof typeof item]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
