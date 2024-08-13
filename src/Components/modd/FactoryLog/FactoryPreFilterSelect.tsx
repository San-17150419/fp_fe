import { useTranslation } from "react-i18next";
import Select from "../Select/Select";
import { useTheme } from "../../../stores/ThemeContext";
import clsx from "clsx";
type FactoryPreFilterSelectProps = {
  text: string;
  options: {
    value: string;
    text: string;
  }[];
  onSelect: (value: string) => void;
};

export default function FactoryPreFilterSelect({
  text,
  options,
  onSelect,
}: FactoryPreFilterSelectProps) {
  const { t } = useTranslation();

  const { isSemiBold, isTextBase } = useTheme();
  return (
    <div key={`${text}-container`} className="flex w-full flex-col">
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
      <Select
        key={`key-${text}`}
        name={text}
        className="my-1"
        onSelect={onSelect}
        options={options}
      />
    </div>
  );
}
