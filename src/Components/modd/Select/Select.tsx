import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "../../../util/cn";
import clsx from "clsx";

// TODO: Make it more generic.
// For example:
// interface SelectProps<T> {
//   options: T[];
//   name: string;
//   onSelect: (value: T) => void;
//   placeholder: string;
// }

// const Select = <T,>({ options, name, onSelect, placeholder }: SelectProps<T>) => {
//   // ...
// };

export type Option = {
  text: string;
  value: string | number;
  id: string | number;
};
type SelectProps = {
  options: Option[];
  name: string;
  className?: string;
  onSelect?: (option: Option) => void;
};

export default function Select({
  options,
  className,
  onSelect,
  name,
}: SelectProps) {
  const { t } = useTranslation();
  // If user wish to add a placeholder, add it to options.
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  const handleSelect = (option: Option) => {
    if (onSelect) {
      onSelect(option);
    }
    setSelectedOption(option);
  };

  return (
    <Listbox
      value={selectedOption}
      onChange={handleSelect}
      name={name}
      defaultValue={selectedOption}
      as="div"
      className={cn("box-border flex h-9 w-full", className)}
    >
      {({ open }) => (
        <>
          <ListboxButton
            id={name}
            className={clsx(
              "box-border flex w-full items-center overflow-clip text-nowrap rounded-md border border-gray-300 bg-white px-2 py-1 text-left font-semibold shadow shadow-slate-300 hover:border-sky-300 focus:border-2 focus:border-sky-400 desktop:px-3 desktop:py-4",
              open ? "border-blue-300" : "border-gray-300",
            )}
          >
            <p className="max-w-4/5 truncate">{t(selectedOption.text)}</p>
            <PiCaretDownBold
              className={clsx("ml-auto duration-150", open ? "" : "rotate-180")}
            />
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            modal={false}
            className={clsx(
              "z-[100] w-[var(--button-width)] origin-top rounded-md bg-white transition duration-200 ease-out data-[closed]:scale-95 data-[enter]:border-blue-300 data-[closed]:opacity-0",
            )}
          >
            {options.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className="border-l-4 border-transparent p-2 text-left data-[selected]:border-sky-400 data-[focus]:bg-sky-200"
              >
                <p className={clsx("font-semibold")}>{t(option.text)}</p>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  );
}
