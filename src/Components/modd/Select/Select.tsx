// Select.tsx
/** @jsxImportSource @emotion/react */

import { Listbox, Transition } from "@headlessui/react";
import ListboxButtonComponent from "./ListboxButtonComponent";
import ListboxOptionsComponent from "./ListboxOptionsComponent";
import { useSelect } from "./useSelect";
import { SelectOption, DetailOption } from "./selectType";

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
      tw="min-w-[180px] pr-2 "
      onChange={handleSelect}
      as={"div"}
    >
      {({ open }) => (
        <>
          <ListboxButtonComponent open={open} selectedOption={selectedOption} />
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ListboxOptionsComponent
              options={allOptions}
              selectedOption={selectedOption}
            />
          </Transition>
        </>
      )}
    </Listbox>
  );
}
