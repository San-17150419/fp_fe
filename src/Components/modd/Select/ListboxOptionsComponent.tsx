// ListboxOptionsComponent.tsx
/** @jsxImportSource @emotion/react */
import { forwardRef } from "react";
import { type DetailOption } from "./selectType";

import { ListboxOptions, ListboxOption } from "@headlessui/react";
import tw from "twin.macro";

type ListboxOptionsComponentProps = {
  options: DetailOption[];
  selectedOption: DetailOption;
};

const ListboxOptionsComponent = forwardRef<
  HTMLUListElement,
  ListboxOptionsComponentProps
>(({ options, selectedOption }, ref) => (
  <ListboxOptions
    ref={ref}
    anchor="bottom"
    tw="z-[1000]  w-[var(--button-width)] rounded-md border border-gray-300 bg-white [--anchor-gap:2px]"
  >
    {options.map((option: DetailOption) => (
      <ListboxOption
        key={option.id}
        value={option}
        css={[
          tw` z-[1000] cursor-pointer p-2 hover:bg-gray-400 data-[selected]:border-l-2 data-[active]:bg-gray-400`,
          option.id === selectedOption.id ? tw`border-zinc-500` : "",
        ]}
      >
        {option.text}
      </ListboxOption>
    ))}
  </ListboxOptions>
));

export default ListboxOptionsComponent;
