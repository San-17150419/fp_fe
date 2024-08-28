import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { TfiMenuAlt } from "react-icons/tfi";
import { TbCaretDownFilled } from "react-icons/tb";
import { useTranslation } from "react-i18next";
type FilterForTableProps = {
  header: Record<string, string>[];
  visibleColumns: Record<string, boolean>;
  onColumnToggle: (key: string) => void;
};
import { memo } from "react";

const MemoizedFilterForTable = memo(function FilterForTable({
  header,
  visibleColumns,
  onColumnToggle,
}: FilterForTableProps) {
  const { t } = useTranslation();
  return (
    <form action="" id="ENGMS-form" className="mr-4 flex justify-end">
      <Listbox multiple form="ENGMS-form">
        <ListboxButton className="my-2 h-10 cursor-pointer rounded-md border border-sky-300 bg-sky-300 p-2 caret-transparent hover:bg-sky-500">
          <span className="flex items-center gap-2">
            <TfiMenuAlt className="text-2xl" />
            <TbCaretDownFilled />
          </span>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom end"
          modal={false}
          className="flex h-64 flex-col rounded-md border border-gray-200 bg-white text-left [--anchor-gap:4px]"
        >
          {header.map((key) => {
            const value = Object.keys(key)[0];
            const text = Object.values(key)[0];
            return (
              <ListboxOption
                className="flex w-full data-[focus]:bg-blue-100"
                key={`${value}-${text}`}
                value={value}
                as="button"
              >
                <label
                  htmlFor={`${value}-${text}`}
                  className="w-full px-3 pt-2 text-left"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    name={value}
                    id={`${value}-${text}`}
                    onChange={() => onColumnToggle(value)}
                    checked={visibleColumns[value]}
                  />

                  {t(text)}
                </label>
              </ListboxOption>
            );
          })}
        </ListboxOptions>
      </Listbox>
    </form>
  );
});
export default MemoizedFilterForTable;
