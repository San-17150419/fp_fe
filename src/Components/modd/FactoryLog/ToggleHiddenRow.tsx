import { useState, useRef } from "react";
import useCloseAndEscape from "../../../hooks/useCloseAndEscape";
import clsx from "clsx";
import { useTheme } from "../../../stores/ThemeContext";
import { useTranslation } from "react-i18next";
import ToggleLi from "./ToggleLi";
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
  // TODO: fix a issure where all options are toggled but toggle all is not toggled and text is not updated to "全部隱藏"
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { isSemiBold, isTextBase } = useTheme();
  const { t } = useTranslation();
  useCloseAndEscape(dropdownRef, () => setOpen(false), open, false);

  return (
    <div
      className="relative mt-2 w-full max-w-fit  p-3"
      ref={dropdownRef}
    >
      <button
        type="button"
        className={clsx(
          "block rounded-md bg-gray-200 px-2 py-1 shadow shadow-slate-400 hover:bg-gray-300",
          isSemiBold ? "font-semibold" : "font-normal",
          isTextBase ? "text-sm" : "text-xs",
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        {t("顯示隱藏系列")}
      </button>
      {open && (
        <ul
          className={clsx(
            "absolute z-50 flex w-fit flex-col rounded-md bg-white shadow shadow-slate-400",
            {
              "right-1 top-full": position === "bottom-right",
              "left-3 top-full": position === "bottom-left",
              "bottom-full right-1": position === "top-right",
              "bottom-full left-1": position === "top-left",
            },
          )}
        >
          <ToggleLi
            id="toggle-all"
            checked={allHiddenToggled}
            onChange={toggleAllVisibility}
            ariaLabel="Toggle all hiddenRows"
          >
            {allHiddenToggled ? "取消全部隱藏" : "全部隱藏"}
          </ToggleLi>

          {hiddenRows.map((row, index) => (
            <ToggleLi
              key={index}
              id={`${row}-${index}`}
              checked={visibleRows.includes(row)}
              onChange={() => toggleVisibility(row)}
              label={row}
              ariaLabel={`Toggle ${row} in hiddenRows`}
            ></ToggleLi>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HiddenRowsToggle;
