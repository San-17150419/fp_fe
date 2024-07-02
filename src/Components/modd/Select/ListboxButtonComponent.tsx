// ListboxButtonComponent.tsx
/** @jsxImportSource @emotion/react */
import { forwardRef } from "react";
import { ListboxButton } from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { type DetailOption } from "./selectType";
import "twin.macro";

type ListboxButtonComponentProps = {
  open: boolean;
  selectedOption: DetailOption;
};

const ListboxButtonComponent = forwardRef<
  HTMLButtonElement,
  ListboxButtonComponentProps
>(({ open, selectedOption }, ref) => (
  <ListboxButton
    ref={ref}
    data-open={open}
    tw="mx-1 mb-4 mt-8 flex h-[38px] w-full min-w-[180px] items-center rounded-md border border-gray-300 bg-white px-2 py-2 font-bold focus-visible:outline-none focus-visible:ring-2 data-[focus]:border-gray-300 data-[active]:ring-2 data-[focus]:ring-2"
  >
    <span>{selectedOption.text}</span>
    <PiCaretDownBold tw="ml-auto mr-2 font-bold transition-all" />
  </ListboxButton>
));

export default ListboxButtonComponent;
