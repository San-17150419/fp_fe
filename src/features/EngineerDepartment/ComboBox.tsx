import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState, useEffect, useMemo } from "react";

type Option<T> = {
  id: string | number;
  text: string;
  value: T;
};

type ComboBoxProps<T> = {
  options: Option<T>[];
  onChange: (value: Option<T>) => void;
  name: string;
};

// TODO: Close
export default function ComboBox<T>({
  options,
  onChange,
  name,
}: ComboBoxProps<T>) {
  const defaultValue = { id: 1, text: "", value: "" as T };
  const [selected, setSelected] = useState<Option<T>>(defaultValue);
  const [query, setQuery] = useState<string>("");

  const optionsWithNoDuplicateText = useMemo(() => {
    return [...new Map(options.map((option) => [option.text, option])).values()]
      .filter((option) => option.text)
      .sort((a, b) => a.text.localeCompare(b.text));
  }, [options]);

  const filteredValue = useMemo(() => {
    if (query === "") return optionsWithNoDuplicateText;
    return optionsWithNoDuplicateText.filter((item) =>
      item.text.toLowerCase().includes(query.toLowerCase().trim()),
    );
  }, [query, optionsWithNoDuplicateText]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      // TODO: escape key does not clear the displayed value, but it does clear the combobox.
      if (event.key === "Escape") {
        setQuery("");
        setSelected(defaultValue.value as Option<T>);
        onChange(defaultValue);
      }
    };

    document.addEventListener("keydown", onEscape);

    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <Combobox
      value={selected}
      // open the combobox on focus
      immediate
      name={name}
      // enable virtual scrolling.
      virtual={{ options: filteredValue }}
      onChange={(value) => {
        // This is necessary to reset available options. I can't add custom option when virtual scrolling is enabled (At least I have not found a way to do it).
        if (!value) {
          setSelected(defaultValue);
          onChange(defaultValue);
        }
        if (value) {
          setSelected(value);
          onChange(value);
        }
      }}
      onClose={() => {
        setQuery("");
      }}
    >
      <ComboboxInput
        displayValue={() => selected.text}
        placeholder={name}
        // name={name}
        onChange={(event) => setQuery(event.target.value)}
        className={
          "h-9 w-full rounded-md border border-gray-300 p-2 shadow-sm shadow-slate-300 focus:outline-blue-300"
        }
      />
      <ComboboxOptions
        anchor={{ to: "bottom", gap: "4px" }}
        modal={false}
        className="max-h-[300px] w-[var(--input-width)] border bg-white empty:invisible"
      >
        {({ option: filteredValue }) => (
          <ComboboxOption
            value={filteredValue}
            className={"w-full p-2 data-[focus]:bg-blue-100"}
          >
            {filteredValue.text}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
