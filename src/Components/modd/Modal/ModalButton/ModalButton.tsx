import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "cancel"
    | "submit"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "link";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: `bg-blue-500 text-white hover:bg-blue-700`,
  secondary: `bg-gray-500 text-white hover:bg-gray-700`,
  cancel: `bg-red-500 text-white hover:bg-red-700`,
  submit: `bg-green-500 text-white hover:bg-green-700`,
  danger: `bg-red-600 text-white hover:bg-red-800`,
  success: `bg-green-600 text-white hover:bg-green-800`,
  warning: `bg-yellow-500 text-white hover:bg-yellow-700`,
  info: `bg-blue-300 text-white hover:bg-blue-500`,
  link: `bg-transparent text-blue-500 hover:text-blue-700`,
};

const sizeStyles = {
  sm: `py-1 px-2 text-sm`,
  md: `py-2 px-4 text-base`,
  lg: `py-3 px-6 text-lg`,
};

export default function ModalButton({
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx("rounded-md", variantStyles[variant], sizeStyles[size])}
    />
  );
}
