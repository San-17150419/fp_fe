// useSelect.ts
import { useState } from "react";
import { SelectOption, DetailOption } from "./selectType";
import { v4 as uuidv4 } from "uuid";
export const useSelect = (options: SelectOption[]) => {
  function convertSelectOptionToDetailOption(
    options: SelectOption[],
  ): DetailOption[] {
    // Initialize detailOptions array
    const detailOptions: DetailOption[] = [];

    // Loop through options and add missing properties
    options.forEach((option) => {
      if (typeof option === "object") {
        // If option is an object, add id, value, and text properties
        const text = option.text || option.value;
        const id = option.id || uuidv4();
        detailOptions.push({
          ...option,
          id,
          value: option.value,
          text,
        });
      } else {
        detailOptions.push({
          id: uuidv4(),
          value: option,
          text: option.toString(),
        });
      }
    });
    return detailOptions;
  }



  const [allOptions, setAllOptions] = useState<DetailOption[]>(
    convertSelectOptionToDetailOption(options),
  );

  const [selectedOption, setSelectedOption] = useState<DetailOption>(
    allOptions[0],
  );

  return {
    allOptions,
    selectedOption,
    setSelectedOption,
  };
};
