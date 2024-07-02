/** @jsxImportSource @emotion/react */
import tw from "twin.macro";
import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { IoCaretDownSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const options = [
    { id: 1, value: "Home Page", path: "/" },
    { id: 2, value: "Input", path: "/input" },
    { id: 3, value: "Select Page", path: "/select" },
    {
      id: 4,
      value: "Data Table with non-dialog modal",
      path: "/table-non-dialog",
    },
    // { id: 5, value: "Data Table with dialog modal", path: "/table-dialog" },
    { id: 6, value: "Data Table with BFF pattern", path: "/bff" },
    {
      id: 7,
      value: "Test Page for highcharts type 1",
      path: "/highchart-type-1",
    },
    {
      id: 8,
      value: "Test Page for highcharts type 2",
      path: "/highchart-type-2",
    },
    {
      id: 9,
      value: "Test Page for highcharts type 3",
      path: "/highchart-type-3",
    },
    { id: 10, value: "Button Page", path: "/button" },
    { id: 11, value: "HighCharts Page", path: "/highcharts" },
  ];

  return (
    <aside tw="z-20 h-full border-e border-gray-300 bg-white p-4 shadow-xl">
      <Menu as="div" tw="relative text-left">
        <MenuButton
          onClick={() => setIsOpen(!isOpen)}
          tw="flex items-center gap-2 font-semibold hover:font-bold hover:text-blue-500"
        >
          {({ open }) => (
            <>
              <IoCaretDownSharp
                size={21}
                className={`${open && "-rotate-90"} transition-all duration-300`}
              />
              元件展示
            </>
          )}
        </MenuButton>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          as={"div"}
        >
          <MenuItems tw=" z-40 mt-2 w-full origin-top-right bg-transparent">
            <div tw="mx-6 py-1">
              {options.map((option) => (
                <MenuItem key={option.id} as="div">
                  {({ focus }) => (
                    <NavLink
                      to={option.path}
                      css={[
                        tw` mb-1 block rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200`,
                        focus && tw`bg-gray-100`,
                      ]}
                    >
                      {option.value}
                    </NavLink>
                  )}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </aside>
  );
}
