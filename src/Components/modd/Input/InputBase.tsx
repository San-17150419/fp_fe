import React, { forwardRef } from "react";
import cn from "../../../util/cn";
interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputBaseProps>((props, ref) => {
  return (
    <div className="h-9 pt-1 desktop:h-[2.4rem]">
      <input
        ref={ref}
        {...props}
        className={cn(
          "w-full cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-xs text-slate-600 hover:border-blue-300 focus:border-blue-500 focus:outline-none desktop:text-base",
          props.className,
        )}
      />
    </div>
  );
});
export default Input;
