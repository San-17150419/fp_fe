import { PiCaretDownBold } from "react-icons/pi";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { useState } from "react";
import { RxCaretDown } from "react-icons/rx";

// options is an array of strings or an array of objects. If it's an array of objects, the id property is required. The value property is required.
// I am not sure what benifits it has. It might be useful in the future. If not, I can remove it. It might make more sense to just pass an array of strings. You can easily extract certain property from the object and make it an array of strings.
type Options =
  | string[]
  | Array<{ id: string | number; value: string | number }>;

type SelectProps = {
  options: Options;
};

export default function SelectTestVersion({ options }: SelectProps) {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <Listbox
      value={selectedOption}
      onChange={setSelectedOption}
      as={"div"}
      className={"m-1"}
    >
      {({ open }) => (
        <>
          <ListboxButton
            data-open={open}
            className={`mb-1 flex min-w-[180px] items-center rounded border border-gray-300 py-1 font-bold focus-visible:outline-none focus-visible:ring-2 data-[focus]:border-gray-300 data-[active]:ring-2 data-[focus]:ring-2`}
            //
          >
            <span className="mx-1">
              {typeof selectedOption === "object"
                ? selectedOption.value
                : selectedOption}
            </span>
            <PiCaretDownBold className="ml-auto mr-2 font-bold transition-all" />
          </ListboxButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ListboxOptions
              anchor="bottom"
              //To match the width of the dropdown with the width of the button, use the --button-width CSS variable that's exposed on the ListboxOptions element
              className={
                "z-10 w-[var(--button-width)] rounded-md border border-gray-300 bg-white [--anchor-gap:2px]"
              }
            >
              {options.map((option) => (
                <ListboxOption
                  key={
                    typeof selectedOption === "object"
                      ? selectedOption.id
                      : selectedOption
                  }
                  value={option}
                  className={`${option === selectedOption ? "border-zinc-500" : "border-transparent"} z-20 cursor-pointer p-2 hover:bg-gray-400 data-[selected]:border-l-2 data-[active]:bg-gray-400`}
                >
                  {typeof option === "object" ? option.value : option}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </>
      )}
    </Listbox>
  );
}
