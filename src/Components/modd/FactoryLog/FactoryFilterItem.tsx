import { useTranslation } from "react-i18next";
import SelectComponent from "../Select/Select";
import { useTheme } from "../../../stores/ThemeContext";
import clsx from "clsx";
import { ChangeEvent } from "react";
import InputBase from "../Input/InputBase";
import { type FactoryPreFilterItemProps } from "./types";

export default function FactoryFilterItem({
  text,
  options,
  onChange,
  type,
  defaultValue,
}: FactoryPreFilterItemProps) {
  const { t } = useTranslation();

  const { isSemiBold, isTextBase } = useTheme();
  return (
    <div
      key={`${text}-container`}
      className="flex min-w-[120px] flex-grow flex-col"
    >
      <label
        className={clsx(
          "ml-1 mt-2",
          isTextBase ? "text-base" : "text-sm",
          isSemiBold ? "font-semibold" : "font-normal",
        )}
        htmlFor={text}
      >
        {t(text)}
      </label>
      {type === "select" ? (
        <SelectComponent
          key={`key-${text}`}
          name={text}
          className="mt-1"
          onSelect={onChange}
          options={options!} // TypeScript knows `options` exists here
        />
      ) : (
        <InputBase
          type="date"
          defaultValue={defaultValue!} // TypeScript knows `defaultValue` exists here
          name={text}
          id={text}
          className={clsx(
            "mt-1 shadow shadow-slate-300",
            isSemiBold ? "font-semibold" : "font-normal",
            isTextBase ? "text-base" : "text-sm",
          )}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
        />
      )}
    </div>
  );
}
