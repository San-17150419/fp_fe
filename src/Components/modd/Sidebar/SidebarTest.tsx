/** @jsxImportSource @emotion/react */
import { useState, Fragment, useRef, useEffect } from "react";
import tw from "twin.macro";
import { Transition } from "@headlessui/react";
import { GoSidebarCollapse } from "react-icons/go";
import { NavLink, useLocation } from "react-router-dom";
import options from "../../../util/SidebarLinkData";

export default function SidebarTest() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  useEffect(() => {
    setLastVisited(location.pathname);
  }, [location]);

  return (
    <div className="relative flex h-full bg-white px-2 py-1" ref={sidebarRef}>
      <GoSidebarCollapse
        size={24}
        css={[
          tw`cursor-pointer mx-auto ml-auto transition-all duration-300 mt-2`,
          !isOpen && tw`rotate-180 `,
          isOpen && tw`rotate-0 `,
        ]}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Transition
        show={isOpen}
        enter="transition-all ease-out duration-500"
        enterFrom="transform opacity-0 "
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        as={Fragment}
      >
        <div
          css={[
            tw`absolute left-10 px-4 py-6 top-0 z-50 h-full transition-all duration-300 min-w-max max-w-80 bg-white `,
            !isOpen && tw`w-0 invisible `,
          ]}
        >
          {options.map((option) => (
            <NavLink
              key={option.text}
              to={option.path}
              css={[
                tw` mb-1 block rounded-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200`,
                lastVisited === option.path && tw`bg-yellow-200`, // Highlight last visited link
              ]}
              onClick={() => setLastVisited(option.path)}
            >
              {option.text}
            </NavLink>
          ))}
        </div>
      </Transition>
    </div>
  );
}
