import React, { ButtonHTMLAttributes } from "react";
import tw from "twin.macro";
import ModalButton from "./ModalButton";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default ({ children, ...props }: ButtonProps) => (
  <ModalButton hasHover varian="cancel" {...props}>
    {children}
  </ModalButton>
);
