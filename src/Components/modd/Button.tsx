import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  mode?: "cancel" | "submit" | "default";
};

export default function Button({
  children,
  mode = "default",
  ...props
}: ButtonProps) {
  const getButton = (mode: "cancel" | "submit" | "default") => {
    switch (mode) {
      case "cancel":
        return "bg-red-500  hover:ring-red-300";
      case "submit":
        return "bg-blue-500 hover:ring-blue-300 ";
      default:
        return "bg-gray-500 hover:ring-gray-300 ";
    }
  };
  return (
    <button
      {...props}
      className={
        "mr-2 rounded-md px-4 py-2 text-white hover:ring " + getButton(mode)
      }
    >
      {children}
    </button>
  );
}
