import React, { forwardRef } from "react";
import cn from "../../../util/cn";
import { useTheme } from "../../../stores/ThemeContext";
interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputBaseProps>((props, ref) => {
  const { isSemiBold, isTextBase } = useTheme();
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "h-9 w-full cursor-pointer rounded-md border border-gray-300 px-2 desktop:px-3 text-slate-600 shadow shadow-slate-300 hover:border-blue-300 focus:border-blue-500 focus:outline-none",
        props.className,
        isSemiBold ? "font-semibold" : "font-normal",
        isTextBase ? "text-base" : "text-sm",
      )}
    />
  );
});
export default Input;
