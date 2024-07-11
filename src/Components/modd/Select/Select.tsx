import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Field,
} from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { useSelect } from "./useSelect";
import { SelectOption, DetailOption } from "./selectType";
import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

type SelectProps = {
  options: SelectOption[];
  name: string;
  width?: string;
  onSelect?: (option: string) => void;
};

export default function Select({
  options,
  width,
  onSelect,
  name,
}: SelectProps) {
  const { t } = useTranslation();
  const { allOptions, selectedOption, setSelectedOption } = useSelect(options);
  useEffect(() => {
    if (onSelect) {
      onSelect(selectedOption.value as string);
    }
  }, []);

  const handleSelect = (option: DetailOption) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option.value as string);
    }
  };

  return (
    <Field className="w-full">
      <Listbox
        value={selectedOption}
        onChange={handleSelect}
        name={name}
        defaultValue={selectedOption}
        as="div"
        className="relative mx-1 my-5 flex h-[38px] w-full pr-2"
      >
        {({ open }) => (
          <>
            <ListboxButton
              id={name}
              className={`flex w-full items-center overflow-clip text-nowrap rounded-md border border-gray-300 bg-white p-2 text-left text-sm hover:border-sky-300 ${
                open ? "border-blue-300" : "border-gray-300"
              }`}
            >
              <p className="max-w-4/5 truncate">{t(selectedOption.text)}</p>
              <PiCaretDownBold className="font-semiboldbold ml-auto text-sm transition-all" />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="absolute z-10 w-[var(--button-width)] origin-top rounded-md bg-white transition duration-200 ease-out data-[closed]:scale-95 data-[enter]:border-blue-300 data-[closed]:opacity-0"
            >
              {allOptions.map((option) => (
                <ListboxOption
                  key={option.id}
                  value={option}
                  className="border-l-4 border-transparent p-1 text-left data-[selected]:border-sky-400 data-[focus]:bg-sky-200"
                >
                  <p>{t(option.text)}</p>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </Field>
  );
}
