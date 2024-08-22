import { useState } from "react";
import Modal from "../../Components/modd/Modal/NonDialogModal";

type MemoCellProps = {
  message: string;
};
export default function MemoCell({ message }: MemoCellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="m-2 rounded-md bg-black p-2 text-sm text-white"
      >
        備註
      </button>
      {
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form action="" className="w-full border border-red-400 p-4 outline">
            <textarea
              name=""
              placeholder="請輸入備註"
              id=""
              cols={30}
              rows={10}
              className="w-full border border-black p-2"
            >
              {message}
            </textarea>
          </form>
        </Modal>
      }
    </>
  );
}
