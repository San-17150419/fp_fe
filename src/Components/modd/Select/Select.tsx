import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { useSelect } from "./useSelect";
import { SelectOption, DetailOption } from "./selectType";
import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import cn from "../../../util/cn";

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
      className={cn(
        "relative mx-1 my-2 flex h-7 w-full pr-2 text-xs desktop:text-base",
        className,
      )}
    >
      {({ open }) => (
        <>
          <ListboxButton
            id={name}
            className={`flex w-full items-center overflow-clip text-nowrap rounded-md border border-gray-300 bg-white px-2 py-0 text-left text-xs shadow shadow-slate-300 hover:border-sky-300 focus:border-2 focus:border-sky-400 desktop:px-3 desktop:py-4 desktop:text-base ${
              open ? "border-blue-300" : "border-gray-300"
            }`}
          >
            <p className="max-w-4/5 truncate">{t(selectedOption.text)}</p>
            <PiCaretDownBold className="font-semiboldbold ml-auto text-sm transition-all" />
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            className="absolute z-[100] w-[var(--button-width)] origin-top rounded-md bg-white text-xs transition duration-200 ease-out data-[closed]:scale-95 data-[enter]:border-blue-300 data-[closed]:opacity-0 desktop:text-base"
          >
            {allOptions.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className="border-l-4 border-transparent p-2 text-left text-xs data-[selected]:border-sky-400 data-[focus]:bg-sky-200 desktop:text-base"
              >
                <p>{t(option.text)}</p>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  );
}
