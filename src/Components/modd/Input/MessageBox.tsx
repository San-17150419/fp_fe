import { GoQuestion } from "react-icons/go";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

interface MessageBoxProps {
  displayMessage: string;
}
export default function MessageBox({ displayMessage }: MessageBoxProps) {
  return (
    <Popover className="relative ml-1">
      <PopoverButton className="Z-50 flex justify-center">
        <GoQuestion />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor={{ to: "right", gap: "4px" }}
        className="flex flex-col rounded-md bg-gray-400 p-1 text-gray-200 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <p className="px-1 text-xs">{displayMessage}</p>
      </PopoverPanel>
    </Popover>
  );
}
