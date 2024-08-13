import React, { forwardRef } from "react";
import cn from "../../../util/cn";
import { useTheme } from "../../../stores/ThemeContext";
interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputBaseProps>((props, ref) => {
  const { isSemiBold, isTextBase } = useTheme();
  return (
    <div className="my-1 flex h-[2.2rem] w-full pr-2">
      <input
        ref={ref}
        {...props}
        className={cn(
          "h-full w-full cursor-pointer rounded-md border border-gray-300 px-2 text-slate-600 shadow shadow-slate-300 hover:border-blue-300 focus:border-blue-500 focus:outline-none",
          props.className,
          isSemiBold ? "font-semibold" : "font-normal",
          isTextBase ? "text-base" : "text-sm",
        )}
      />
    </div>
  );
});
export default Input;
