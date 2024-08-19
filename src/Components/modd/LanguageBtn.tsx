import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoLanguageOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { PiCaretDown } from "react-icons/pi";
import clsx from "clsx";
export default function LanguageBtn() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const currentLanguate = i18n.language;

  const languageConfig = {
    "zh-TW": "繁體",
    // en: "English",
    "zh-CN": "简体",
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="ml-auto mr-4 block rounded-md bg-stone-300 p-2 text-lg lg:text-xl">
        <span className="flex items-center">
          <IoLanguageOutline />
          <PiCaretDown className="ml-1 text-sm" />
        </span>
      </MenuButton>
      <MenuItems
        className={
          "flex w-24 flex-col gap-1 rounded-md bg-white p-2 text-base [--anchor-gap:0.25rem]"
        }
        anchor="bottom"
      >
        {Object.entries(languageConfig).map(([key, value]) => (
          <MenuItem>
            <button
              type="button"
              className={clsx(
                "rounded-md px-3 py-1 text-left caret-transparent data-[active]:bg-sky-200 data-[focus]:bg-sky-100",
                currentLanguate === key ? "bg-sky-200" : "bg-white",
                currentLanguate === key
                  ? "cursor-not-allowed"
                  : "cursor-pointer",
              )}
              onClick={() => changeLanguage(key)}
              disabled={currentLanguate === key}
            >
              {value}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
