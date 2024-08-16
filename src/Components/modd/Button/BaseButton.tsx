import { type ButtonHTMLAttributes } from "react";
import cn from "../../../util/cn";

export default function BaseButton({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded bg-stone-300 px-2 py-1 text-xs shadow-sm shadow-gray-400 tabletP:text-sm lg:text-base",
      )}
    >
      {props.children}
    </button>
  );
}
