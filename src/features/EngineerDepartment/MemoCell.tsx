import { useState, type FormEvent } from "react";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { type FilterData } from "./types";
import axios from "axios";

type MemoCellProps = {
  data: FilterData["data"][number];
};
const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "mold-info-update/";
export default function MemoCell({ data }: MemoCellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string>(data.spare);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(api, {
        ...data,
        spare: message,
      });
      setIsModalOpen(false);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
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
          <form className="flex w-[35vw] flex-col -mb-6" onSubmit={onSubmit}>
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
