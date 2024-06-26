import React, { ButtonHTMLAttributes } from "react";
import ModalButton from "./ModalButton";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default ({ children, ...props }: ButtonProps) => (
  <ModalButton hasHover varian="submit" {...props}>
    {children}
  </ModalButton>
);
