import { useState, type FormEvent } from "react";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { type FilterData } from "./types";
import useUpdate from "./hooks/useUpdate";

type MemoCellProps = {
  currentMoldData: FilterData["data"][number];
};
export default function MemoCell({ currentMoldData }: MemoCellProps) {
  const { mutate } = useUpdate({ currentMoldData });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string>(currentMoldData.spare);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const moldData = { ...currentMoldData, spare: message };
    mutate(moldData);
  };
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
          <form className="-mb-6 flex w-[35vw] flex-col" onSubmit={onSubmit}>
            <textarea
              name=""
              placeholder="請輸入備註"
              id=""
              cols={30}
              rows={10}
              defaultValue={message}
              className="w-full border border-black p-2"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="my-4 ml-auto block rounded-md bg-blue-400 p-2"
              type="submit"
            >
              儲存
            </button>
          </form>
        </Modal>
      }
    </>
  );
}
