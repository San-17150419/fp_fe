import React from "react";
import ModalButton from "../Components/modd/Modal/ModalButton/ModalButton";
export default function ButtonPage() {
  return (
    <div>
      <h1>ButtonPage</h1>
      <div>
        <ModalButton className="m-4" variant="primary">
          Button
        </ModalButton>
        <ModalButton variant="secondary" size="sm">
          Button
        </ModalButton>
        <ModalButton variant="cancel">Button</ModalButton>
        <ModalButton variant="submit">Button</ModalButton>
        <ModalButton variant="danger">Button</ModalButton>
        <ModalButton variant="success">Button</ModalButton>
        <ModalButton variant="warning">Button</ModalButton>
        <ModalButton variant="link">Button</ModalButton>
        <ModalButton variant="info">Button</ModalButton>
      </div>
    </div>
  );
}
