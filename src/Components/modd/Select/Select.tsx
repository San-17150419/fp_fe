// SelectTestVersion.tsx
import { Listbox, Transition } from "@headlessui/react";
import ListboxButtonComponent from "./ListboxButtonComponent";
import ListboxOptionsComponent from "./ListboxOptionsComponent";
import { useSelect } from "./useSelect";

type Option = string | { id: string | number; value: string | number };

type SelectProps = {
  options: Option[];
  width?: string;
};

export default function SelectTestVersion({ options, width }: SelectProps) {
  const { selectedOption, setSelectedOption, getOptionValue, getOptionKey } = useSelect(options);

  return (
    <Listbox
      value={selectedOption}
      tw="min-w-[180px] pr-2"
      onChange={setSelectedOption}
      as={"div"}
    >
      {({ open }) => (
        <>
          <ListboxButtonComponent
            open={open}
            selectedOption={selectedOption}
            getOptionValue={getOptionValue}
          />
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ListboxOptionsComponent
              options={options}
              selectedOption={selectedOption}
              getOptionKey={getOptionKey}
              getOptionValue={getOptionValue}
            />
          </Transition>
        </>
      )}
    </Listbox>
  );
}
