/** @jsxImportSource @emotion/react */
import { ButtonHTMLAttributes } from "react";
import { css } from "@emotion/react";
import tw from "twin.macro";

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
  primary: tw`bg-blue-500 text-white hover:bg-blue-700`,
  secondary: tw`bg-gray-500 text-white hover:bg-gray-700`,
  cancel: tw`bg-red-500 text-white hover:bg-red-700`,
  submit: tw`bg-green-500 text-white hover:bg-green-700`,
  danger: tw`bg-red-600 text-white hover:bg-red-800`,
  success: tw`bg-green-600 text-white hover:bg-green-800`,
  warning: tw`bg-yellow-500 text-white hover:bg-yellow-700`,
  info: tw`bg-blue-300 text-white hover:bg-blue-500`,
  link: tw`bg-transparent text-blue-500 hover:text-blue-700`,
};

const sizeStyles = {
  sm: tw`py-1 px-2 text-sm`,
  md: tw`py-2 px-4 text-base`,
  lg: tw`py-3 px-6 text-lg`,
};

export default function ModalButton({
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      css={css`
        ${tw`rounded-md`}
        ${tw`m-1`}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    />
  );
}
