import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { useSelect } from "./useSelect";
import { SelectOption, DetailOption } from "./selectType";
import "twin.macro";

type SelectProps = {
  options: SelectOption[];
  width?: string;
  onSelect?: (option: SelectOption) => void;
};

export default function Select({ options, width, onSelect }: SelectProps) {
  const { allOptions, selectedOption, setSelectedOption } = useSelect(options);

  const handleSelect = (option: DetailOption) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option.value);
    }
  };

  return (
    <Listbox
      value={selectedOption}
      onChange={handleSelect}
      as="div"
      className="mx-1 my-5 flex h-[38px] w-full pr-2"
    >
      <ListboxButton className="flex w-full items-center overflow-clip text-nowrap rounded-md border border-gray-300 bg-white p-2 text-left text-sm data-[active]:border-blue-400 data-[focus]:border-blue-300 data-[hover]:border-blue-300">
        <p className="max-w-4/5 truncate">{selectedOption.text}</p>
        <PiCaretDownBold className="font-semiboldbold ml-auto text-sm transition-all" />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="w-[var(--button-width)] origin-top rounded-md bg-white transition duration-200 ease-out data-[closed]:scale-95 data-[enter]:border-blue-300 data-[closed]:opacity-0"
      >
        {allOptions.map((option) => (
          <ListboxOption
            key={option.id}
            value={option}
            className="border-l-4 border-transparent p-1 text-left data-[selected]:border-sky-400 data-[focus]:bg-sky-200"
          >
            <p>{option.text}</p>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
