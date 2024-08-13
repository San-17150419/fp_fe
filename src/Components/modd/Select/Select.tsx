import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { useSelect } from "./useSelect";
import { SelectOption, DetailOption } from "./selectType";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "../../../util/cn";
import clsx from "clsx";
import { useTheme } from "../../../stores/ThemeContext";

type SelectProps = {
  options: SelectOption[];
  name: string;
  className?: string;
  onSelect?: (option: string) => void;
};

export default function Select({
  options,
  className,
  onSelect,
  name,
}: SelectProps) {
  const { t } = useTranslation();
  const { allOptions, selectedOption, setSelectedOption } = useSelect(options);
  const { isSemiBold, isTextBase } = useTheme();
  useEffect(() => {
    if (onSelect) {
      onSelect(selectedOption.value as string);
    }
  }, [onSelect, selectedOption]);

  const handleSelect = (option: DetailOption) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option.value as string);
    }
  };

  return (
    <Listbox
      value={selectedOption}
      onChange={handleSelect}
      name={name}
      defaultValue={selectedOption}
      as="div"
      className={cn("relative my-2 mr-1 flex h-7 w-full pr-2", className)}
    >
      {({ open }) => (
        <>
          <ListboxButton
            id={name}
            className={clsx(
              "flex w-full items-center overflow-clip text-nowrap rounded-md border border-gray-300 bg-white px-2 py-0 text-left shadow shadow-slate-300 hover:border-sky-300 focus:border-2 focus:border-sky-400 desktop:px-3 desktop:py-4",
              open ? "border-blue-300" : "border-gray-300",
              isSemiBold ? "font-semibold" : "font-normal",
              isTextBase ? "text-base" : "text-sm",
            )}
          >
            <p className="max-w-4/5 truncate">{t(selectedOption.text)}</p>
            <PiCaretDownBold
              className={clsx("ml-auto duration-150", open ? "" : "rotate-180")}
            />
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            className={clsx(
              "absolute z-[100] w-[var(--button-width)] origin-top rounded-md bg-white transition duration-200 ease-out data-[closed]:scale-95 data-[enter]:border-blue-300 data-[closed]:opacity-0",
              isSemiBold ? "font-semibold" : "font-normal",
              isTextBase ? "text-base" : "text-sm",
            )}
          >
            {allOptions.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className="border-l-4 border-transparent p-2 text-left data-[selected]:border-sky-400 data-[focus]:bg-sky-200"
              >
                <p
                  className={clsx(
                    isSemiBold ? "font-semibold" : "font-normal",
                    isTextBase ? "text-base" : "text-sm",
                  )}
                >
                  {t(option.text)}
                </p>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  );
}
