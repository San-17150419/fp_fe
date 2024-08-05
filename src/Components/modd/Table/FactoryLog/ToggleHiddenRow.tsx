import  { useState, useRef } from "react";
import useCloseAndEscape from "../../../../hooks/useCloseAndEscape";
import clsx from "clsx";

type HiddenRowsToggleProps = {
  hiddenRows: string[];
  visibleRows: string[];
  toggleVisibility: (label: string) => void;
  allHiddenToggled: boolean;
  toggleAllVisibility: () => void;
  position?: Position;
};

type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const HiddenRowsToggle = ({
  hiddenRows,
  visibleRows,
  toggleVisibility,
  allHiddenToggled,
  toggleAllVisibility,
  position = "bottom-right",
}: HiddenRowsToggleProps) => {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  useCloseAndEscape(dropdownRef, () => setOpen(false), open);

  return (
    <div ref={dropdownRef} className="relative mt-2 w-full max-w-fit">
      <button
        type="button"
        className="block rounded-md hover:bg-gray-300 bg-gray-200 px-2 py-1 text-xs shadow shadow-slate-400 "
        onClick={() => setOpen((prev) => !prev)}
      >
        顯示隱藏系列
      </button>

      {open && (
        <ul
          className={clsx(
            "absolute z-50 flex w-fit flex-col rounded-md bg-white shadow shadow-slate-400",
            {
              "right-0 top-full mt-2": position === "bottom-right",
              "left-0 top-full mt-2": position === "bottom-left",
              "bottom-full right-0 mb-2": position === "top-right",
              "bottom-full left-0 mb-2": position === "top-left",
            },
          )}
        >
          <li className="flex gap-2 py-2 pl-3 pr-4 rounded-md hover:bg-gray-100">
            <input
              type="checkbox"
              checked={allHiddenToggled}
              id="toggle-all"
              onChange={toggleAllVisibility}
            />
            <label
              className="w-full text-left text-xs "
              htmlFor="toggle-all"
            >
              {!allHiddenToggled ? "Show all" : "Hide all"}
            </label>
          </li>
          {hiddenRows.map((row, index) => (
            <li
              className="flex gap-2 py-2 pl-3 rounded-md pr-4 hover:bg-gray-100"
              key={index}
            >
              <input
                type="checkbox"
                id={`${row}-${index}`}
                checked={visibleRows.includes(row)}
                onChange={() => toggleVisibility(row)}
              />
              <label
                className="w-full text-left text-xs "
                htmlFor={`${row}-${index}`}
              >
                {row}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HiddenRowsToggle;
