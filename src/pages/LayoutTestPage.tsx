import { useState } from "react";
import Input from "../Components/modd/Input/Input";
import Select from "../Components/modd/Select/Select";
import Modal from "../Components/modd/Modal/NonDialogModal";
import TableContainer from "../Components/modd/Table/TableContainer";

export default function Skeleton() {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  return (
    <div className="flex grow flex-col flex-wrap gap-4 p-2 outline">
      <section className="grid min-h-[100px] grid-cols-4 gap-4 p-3 outline">
        <Input placeholder="很長的" name="很長的input" />

        <Select options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]} />
        <Input
          placeholder="很長的inputatbwebtwetbwebtwebtwebtwetbwesvfsav4"
          name="很長的input7"
        />
      </section>
      <section className="flex min-h-[100px] outline">
        <button
          className="m-2 h-10 rounded border border-gray-700 bg-gray-400 p-2 hover:bg-gray-500"
          onClick={() => {
            setIsModal1Open(true);
          }}
        >
          Open Modal 1
        </button>
        <button
          className="m-2 h-10 rounded border border-gray-700 bg-gray-400 p-2 hover:bg-gray-500"
          onClick={() => {
            setIsModal2Open(true);
          }}
        >
          Open Modal 2
        </button>
        <Modal
          onClose={() => setIsModal1Open(false)}
          openModal={isModal1Open}
        />
        <Modal
          onClose={() => setIsModal2Open(false)}
          enter="leftMiddle"
          openModal={isModal2Open}
        />
      </section>

      <TableContainer />
    </div>
  );
}
