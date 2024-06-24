import { useState } from "react";
import { GoQuestion } from "react-icons/go";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

interface MessageBoxProps {
  displayMessage: string;
}
export default function MessageBox({ displayMessage }: MessageBoxProps) {
  return (
    <Popover className="relative ml-1">
      <PopoverButton className="flex Z-50 justify-center">
        <GoQuestion />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom start"
        className="flex w-[180px] flex-col rounded-md bg-gray-400 px-4 py-4 text-gray-200"
      >
        <p className="text-sm">{displayMessage}</p>
      </PopoverPanel>
    </Popover>
  );
}
