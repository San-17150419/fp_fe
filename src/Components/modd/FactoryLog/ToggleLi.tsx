import { ReactNode } from "react";
import clsx from "clsx";
import { useTheme } from "../../../stores/ThemeContext";

type ToggleListItemProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  label?: string;
  ariaLabel?: string;
  children?: ReactNode;
};
export default function ToggleLi({
  id,
  checked,
  onChange,
  ariaLabel,
  label,
  children,
}: ToggleListItemProps) {
  const { isSemiBold, isTextBase } = useTheme();
  return (
    <li className="flex gap-2 rounded-md hover:bg-gray-200">
      <label
        className={clsx(
          "mt-1 w-full",
          isSemiBold ? "font-semibold" : "font-normal",
          isTextBase ? "text-base" : "text-sm",
        )}
        htmlFor={id}
      >
        <span className="mx-3 flex w-full gap-2 py-1">
          <input
            type="checkbox"
            checked={checked}
            id={id}
            onChange={onChange}
            aria-label={ariaLabel}
          />
          {children || label}
        </span>
      </label>
    </li>
  );
}
