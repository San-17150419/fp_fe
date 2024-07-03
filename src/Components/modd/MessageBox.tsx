import { useState } from "react";
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
        anchor="bottom start"
        className="flex flex-col rounded-md bg-gray-400 px-2 py-2 text-gray-200"
      >
        <p className="px-1 text-xs">{displayMessage}</p>
      </PopoverPanel>
    </Popover>
  );
}
