import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

export default function Select({ options, ...props }: SelectProps) {
  return (
    // TODO: Extract width to a variable
    <div className="px-2 m-1 flex h-[38px] w-[180px] rounded-md border border-gray-300">
      <select className="w-full" {...props}>
        {options.map((option, index) => (
          <option
            className="border-start border-3 fw-bolder border-black"
            key={index}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
