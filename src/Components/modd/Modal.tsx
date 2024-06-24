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

export default function Modal({
  children,
  onClose,
  title,
  openModal = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // useEffect(() => {
  //   if (openModal) {
  //     dialogRef.current?.showModal();
  //   } else {
  //     dialogRef.current?.close();
  //   }
  // }, [dialogRef]);

  return (
    <dialog
      open={openModal}
      className="relative flex min-h-[500px] min-w-[500px] flex-col rounded-lg shadow-2xl shadow-black"
      onClose={onClose}
      ref={dialogRef}
    >
      <header className="relative flex min-h-12 items-center justify-center">
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
        <form id="myForm" className="z-50 m-2 flex justify-center" action="">
          {children}
        </form>
        <select name="" id="">
          <option value="">1</option>
          <option value="">2</option>
          <option value="">3</option>
        </select>
      </div>
      <div className="flex min-h-12 justify-end px-1 py-2">
        <Button mode="cancel" onClick={onClose}>
          Cancel
        </Button>
        <Button mode="submit" form="myForm" type="submit">
          {/* Use form attribute to link the button to the form */}
          Submit
        </Button>
        <MessageBox displayMessage="This is a message box"></MessageBox>
        <Button>Default</Button>
      </div>
    </dialog>
  );
}
