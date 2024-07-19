import React, { useState, useRef } from "react";
import useCloseAndEscape from "../../../../hooks/useCloseAndEscape";
import clsx from "clsx";

type HiddenRowsToggleProps = {
  hiddenRows: { label: string; visible: boolean }[];
  setHiddenRows: React.Dispatch<React.SetStateAction<string[]>>;
  setRows: React.Dispatch<
    React.SetStateAction<{ label: string; visible: boolean }[]>
  >;
  allHiddenToggled: boolean;
  setAllHiddenToggled: React.Dispatch<React.SetStateAction<boolean>>;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
};

type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const HiddenRowsToggle = ({
  hiddenRows,
  setHiddenRows,
  setRows,
  allHiddenToggled,
  setAllHiddenToggled,
  position = "bottom-right",
}: HiddenRowsToggleProps) => {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  useCloseAndEscape(dropdownRef, () => setOpen(false), open);
  const toggleVisibility = (label: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.label === label ? { ...row, visible: !row.visible } : row,
      ),
    );
  };

  const toggleAllVisibility = () => {
    setAllHiddenToggled((prev) => !prev);
    setRows((prevRows) =>
      prevRows.map((row) => ({ ...row, visible: !allHiddenToggled })),
    );
  };

  return (
    <div ref={dropdownRef} className="relative mt-2 w-full max-w-fit">
      <button
        type="button"
        className="block h-6 rounded-md bg-white px-2 text-xs shadow shadow-slate-300 desktop:text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        Open
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
          <li className="flex gap-2 py-2 pl-3 pr-4 hover:bg-gray-100">
            <input
              type="checkbox"
              checked={allHiddenToggled}
              id="toggle-all"
              onChange={toggleAllVisibility}
            />
            {/* This need to be full width. So the label occupies all the
              remaining space. Otherwise, the label with shorter text will have
              area on the right that looks like part of the label, but */}
            {/* TODO: Add explanation */}
            <label
              className="w-full text-left text-xs desktop:text-sm"
              htmlFor="toggle-all"
            >
              {allHiddenToggled ? "Show all" : "Hide all"}
            </label>
          </li>
          {hiddenRows.map((row, index) => (
            <li
              className="flex gap-2 py-2 pl-3 pr-4 hover:bg-gray-100"
              key={index}
            >
              <input
                type="checkbox"
                id={`${row.label}-${index}`}
                checked={row.visible}
                onChange={() => toggleVisibility(row.label)}
              />
              <label
                className="w-full text-left text-xs desktop:text-sm"
                htmlFor={`${row.label}-${index}`}
              >
                {row.label}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HiddenRowsToggle;
