import React, { useEffect, useRef } from "react";
import Input from "./Input";
import Button from "./Button";
import MessageBox from "./MessageBox";
type ModalProps = {
  children?: React.ReactNode;
  onClose: () => void;
  openModal: boolean;
  title?: string;
};

export default function Modal({ children, onClose, title }: ModalProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/30">
      <div className="z-50 m-2 flex min-h-[500px] min-w-[500px] flex-col rounded-md bg-white">
        <header className="relative m-2 flex min-h-12 items-center justify-center">
          <h1 className="flex-grow text-2xl font-bold">{title}</h1>
          <button
            className="absolute right-2 h-8 w-8 rounded-full hover:bg-gray-300"
            onClick={onClose}
          >
            X
          </button>
        </header>
        {/* TODO: */}
        <div className="flex-grow border-y-2 border-gray-300">
          <form id="myForm" className="z-50 m-4 flex" action="">
            {children}
          </form>
        </div>
        <div className="m-2 flex min-h-12 justify-end px-1 py-2">
          <Button mode="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button mode="submit" form="myForm" type="submit">
            {/* Use form attribute to link the button to the form */}
            Submit
          </Button>
          <Button>Default</Button>
        </div>
      </div>
    </div>
  );
}
