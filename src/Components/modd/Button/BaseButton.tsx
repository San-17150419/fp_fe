import { type ButtonHTMLAttributes } from "react";
import cn from "../../../util/cn";

export default function BaseButton({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded p-1 text-xs text-white tabletP:text-sm lg:text-base",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
