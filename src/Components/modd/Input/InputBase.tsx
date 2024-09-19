import React, { forwardRef } from "react";
import cn from "../../../util/cn";
interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputBaseProps>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-base font-semibold shadow shadow-slate-300 focus:outline-none desktop:px-3",
        props.className,
        props.disabled || props.readOnly
          ? "pointer-events-none caret-transparent opacity-50"
          : "cursor-pointer hover:border-blue-300 focus:border-blue-500",
      )}
    />
  );
});
export default Input;
