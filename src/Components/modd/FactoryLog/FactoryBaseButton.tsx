import { type ButtonHTMLAttributes } from "react";
import cn from "../../../util/cn";

export default function FactoryBaseButton({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded bg-gray-400 text-sm shadow shadow-gray-500 hover:bg-gray-500 hover:text-white hover:shadow-gray-800",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
