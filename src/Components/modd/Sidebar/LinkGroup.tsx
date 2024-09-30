import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import cn from "../../../util/cn";
import { FaCaretUp } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
type LinkGroupProps = {
  links: [string, string][];
  groupName: string;
};

export default function LinkGroup({ links, groupName }: LinkGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setIsOpen(links.reduce((acc, link) => acc || link[1] === pathname, false));
  }, [pathname]);
  return (
    <div className="font-semibold">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-4 py-1 hover:bg-gray-100 hover:opacity-90"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{groupName}</span>
        <FaCaretUp
          className={cn(isOpen && "rotate-180", "transition-all duration-300")}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            className="ml-4 mt-1"
          >
            {links.map(([text, path]) => (
              <NavLink
                key={text}
                to={path}
                className={({ isActive }) =>
                  cn(
                    "block text-nowrap rounded-md px-4 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100",
                    isActive && "bg-yellow-100", // Highlight last visited link
                  )
                }
              >
                {text}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
