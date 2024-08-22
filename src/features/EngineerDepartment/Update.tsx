import { useState } from "react";
import { type ENGDepartmentFilterData } from "./types/EngineerDepartmentTypes";
import Modal from "../../Components/modd/Modal/NonDialogModal";
type UpdateProps = {
  id_ms: ENGDepartmentFilterData["data"][0]["id_ms"];
};
export default function Update({ id_ms }: UpdateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-md bg-blue-600 p-2 text-white"
      >
        更新
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="min-h-full">
          {id_ms}
          <form
            action=""
            className="grid grid-flow-row grid-cols-2 gap-8 border bg-red-400 p-2"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex h-full justify-around gap-4 p-2 outline"
              >
                <label htmlFor={String(i)}>{i}</label>
                <input
                  type="text"
                  id={String(i)}
                  className="border border-black"
                />
              </div>
            ))}
          </form>
        </div>
      </Modal>
    </>
  );
}
