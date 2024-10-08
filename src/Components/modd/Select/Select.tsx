import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "../../../util/cn";
import clsx from "clsx";

// TODO: Make is controlled component. I should be able to reset the value from outside

// TODO: Considering to remove some advanced feature to another component. I should not include all features in this component.
export default function Select<T>({
  options,
  className,
  onChange,
  name,
  defaultValue,
  disabled = false,
  value,
  withBorder = true,
}: SelectProps<T>) {
  const { t } = useTranslation();

  // If user wish to add a placeholder, add it to options.
  const defaultOption: Option<T> = options[0];
  const [selectedOption, setSelectedOption] = useState<Option<T>>(
    defaultValue || defaultOption,
  );

  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    // Check if the passed value exists in the options
    const newSelectedOption = options.find((option) => option.value === value);

    // If the value is not found (or is an empty string), reset to default option or an empty option
    if (newSelectedOption) {
      setSelectedOption(newSelectedOption);
    } else {
      // Reset to default or empty value when no valid value is passed
      setSelectedOption(defaultValue || defaultOption);
    }
  }, [value, options, defaultValue, defaultOption]);

  const handleSelect = (option: Option<T>) => {
    setIsInvalid(false); // reset
    if (onChange) {
      onChange(option);
    }
    setSelectedOption(option);
  };
  return (
    <div className="relative w-full">
      <Listbox
        value={options.find((option) => option.value === selectedOption)}
        onChange={(option) => handleSelect(option)}
        disabled={disabled}
        defaultValue={defaultValue}
        name={name}
        as="div"
        className={cn("relative flex h-9 w-full font-semibold", className)}
      >
        {({ open }) => (
          <>
            <ListboxButton
              id={name}
              className={cn(
                "flex w-full items-center overflow-clip text-nowrap rounded-md bg-white px-2 py-1 text-left desktop:px-3 desktop:py-4",
                open ? "border-blue-300" : "border-gray-300",
                disabled && "opacity-50",
                !disabled &&
                  "cursor-pointer border-gray-300 hover:border-sky-300 focus:border-2 focus:border-sky-400",
                isInvalid && !open && "border-red-500",
                withBorder && "border shadow shadow-slate-300",
              )}
            >
              <p className="max-w-4/5 truncate">
                {t(selectedOption?.text || "")}
              </p>
              <PiCaretDownBold
                className={clsx(
                  "ml-auto duration-150",
                  open ? "" : "rotate-180",
                )}
              />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              modal={false}
              className={clsx(
                "z-[100] w-[var(--button-width)] origin-top rounded-md border border-gray-300 bg-white transition duration-200 ease-out data-[closed]:scale-95 data-[enter]:border-blue-300 data-[closed]:opacity-0",
              )}
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.id}
                  value={option}
                  className="text-nowrap border-l-4 border-transparent p-2 text-left data-[selected]:border-sky-400 data-[focus]:bg-sky-200"
                >
                  <p>{t(option.text)}</p>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </div>
  );
}

export type Option<T> = {
  text: string;
  value: T;
  id: string | number;
};
export type SelectProps<T> = {
  options: Option<T>[];
  name?: string;
  className?: string;
  defaultValue?: Option<T>;
  disabled?: boolean;
  required?: boolean;
  value?: Option<T>["value"];
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (option: Option<T>) => void;
  withBorder?: boolean;
};
