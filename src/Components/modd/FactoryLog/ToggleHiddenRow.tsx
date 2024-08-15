import { useState, useRef } from "react";
import useCloseAndEscape from "../../../hooks/useCloseAndEscape";
import clsx from "clsx";
import { useTheme } from "../../../stores/ThemeContext";

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
  position = "bottom-left",
}: HiddenRowsToggleProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { isSemiBold, isTextBase } = useTheme();
  useCloseAndEscape(dropdownRef, () => setOpen(false), open, false);

  return (
    <div
      className="relative mt-2 w-full max-w-fit bg-white p-3"
      ref={dropdownRef}
    >
      <button
        type="button"
        className={clsx(
          "block rounded-md bg-gray-200 px-2 py-1 shadow shadow-slate-400 hover:bg-gray-300",
          isSemiBold ? "font-semibold" : "font-normal",
          isTextBase ? "text-base" : "text-sm",
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        顯示隱藏系列
      </button>

      {open && (
        <ul
          className={clsx(
            "absolute z-50 flex w-fit flex-col rounded-md bg-white shadow shadow-slate-400",
            {
              "right-1 top-full ": position === "bottom-right",
              "left-3 top-full ": position === "bottom-left",
              "bottom-full right-1 ": position === "top-right",
              "bottom-full left-1 ": position === "top-left",
            },
          )}
        >
          <li className="flex gap-2 rounded-md hover:bg-gray-100">
            <label
              className={clsx(
                "mt-1 w-full",
                isSemiBold ? "font-semibold" : "font-normal",
                isTextBase ? "text-base" : "text-sm",
              )}
              htmlFor="toggle-all"
            >
              <span className="mx-3 flex w-full gap-2">
                <input
                  type="checkbox"
                  checked={allHiddenToggled}
                  id="toggle-all"
                  onChange={toggleAllVisibility}
                  aria-label="Toggle all hiddenRows"
                />
                {!allHiddenToggled ? "Show all" : "Hide all"}
              </span>
            </label>
          </li>
          {hiddenRows.map((row, index) => (
            <li key={index} className="rounded-md hover:bg-gray-100">
              <label
                className={clsx(
                  "mt-1 w-full",
                  isSemiBold ? "font-semibold" : "font-normal",
                  isTextBase ? "text-base" : "text-sm",
                )}
                htmlFor={`${row}-${index}`}
              >
                <span className="mx-3 flex w-full gap-2">
                  <input
                    type="checkbox"
                    id={`${row}-${index}`}
                    checked={visibleRows.includes(row)}
                    onChange={() => toggleVisibility(row)}
                  />
                  {row}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HiddenRowsToggle;
