import React, { ButtonHTMLAttributes } from "react";
import ModalButton from "./ModalButton";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default ({ children, ...props }: ButtonProps) => (
  <ModalButton  variant="submit" {...props}>
    {children}
  </ModalButton>
);
