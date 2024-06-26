import ModalButton from "./ModalButton";
import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export default ({ children, ...props }: ButtonProps) => (
  <ModalButton hasHover varian="primary" {...props}>
    {children}
  </ModalButton>
);
