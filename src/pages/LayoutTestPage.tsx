import { useState, useRef, useEffect } from "react";
import TableFetcher from "../Components/modd/Table/TableFetcher";
import { getTableData } from "../Components/modd/Table/api";
import Input from "../Components/modd/Input";
import Select from "../Components/modd/Select/Select";
import Modal from "../Components/modd/NonDialogModal";
import ModalAnimationTest from "../Components/modd/Modal/ModalAnimationTest";

export default function Skeleton() {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableContainerWidth, setTableContainerWidth] = useState<number>();
  const [tableContainerHeight, setTableContainerHeight] = useState<number>();
  const [isTableReady, setIsTableReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (tableContainerRef.current) {
        const rect = tableContainerRef.current.getBoundingClientRect();
        setTableContainerHeight(rect.height);
        setTableContainerWidth(rect.width);
        setIsTableReady(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex grow flex-col flex-wrap gap-4 p-2 outline">
      <section className="grid min-h-[100px] grid-cols-4 gap-4 p-3 outline">
        <Input placeholder="很長的" name="很長的input" />
        <Input placeholder="很長的inputasvfsav3" name="很長的input3" />
        <Input placeholder="很長的inputasvfsav4" name="很長的input4" />
        <Input
          placeholder="很長的inputatbwebtwetbwebtwebtwebtwetbwesvfsav4"
          name="很長的input4"
        />

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
        <ModalAnimationTest />
      </section>

      <section
        className="relative flex-grow outline outline-lime-400"
        ref={tableContainerRef}
      >
        {isTableReady && (
          <div
            className="absolute inset-0 overflow-auto"
            style={{
              maxWidth: `${tableContainerWidth}px`,
              maxHeight: `${tableContainerHeight}px`,
            }}
          >
            <TableFetcher fetchData={getTableData}></TableFetcher>
          </div>
        )}
      </section>
    </div>
  );
}
