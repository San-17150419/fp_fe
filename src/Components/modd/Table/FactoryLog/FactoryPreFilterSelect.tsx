import React from "react";
import { useTranslation } from "react-i18next";
import Select from "../../Select/Select";
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
  return (
    <div key={`${text}-container`} className="flex w-full flex-col">
      <label className="ml-1 mt-2 text-xs desktop:text-sm" htmlFor={text}>
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
