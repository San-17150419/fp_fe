import { useState, useLayoutEffect, useRef } from "react";
import TableFetcher from "../Components/modd/Table/TableFetcher";
import { getTableData } from "../Components/modd/Table/api";
import useWindowDimensions from "../hooks/useWindowDimensions";
import Input from "../Components/modd/Input";
import Select from "../Components/modd/Select/Select";

export default function Skeleton() {
  const { width } = useWindowDimensions();
  const [tableContainerWidth, setTableContainerWidth] = useState<string>("");
  const [tableContainerHeight, setTableContainerHeight] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTableReady, setIsTableReady] = useState(false);

  const calculateDimensions = () => {
    const fontSize =
      width >= 1366 ? 18 : width >= 1024 ? 16 : width >= 800 ? 15 : 14;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      const containerWidth = rect.width;
      const containerHeight = rect.height;

      setTableContainerWidth(`${containerWidth - fontSize}px`);
      setTableContainerHeight(
        `${containerHeight - 100 - 100 - 3 * fontSize}px`,
      );
    }
  };

  useLayoutEffect(() => {
    calculateDimensions();
    setIsTableReady(true);

    const handleResize = () => {
      calculateDimensions();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, containerRef]);

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-4 p-2 outline">
      <section className="grid min-h-[100px] grid-cols-3 gap-4 p-3 outline lg:grid-cols-4">
        <Input placeholder="很長的" name="很長的input" />
        <Input placeholder="很長的inputasvfsav2" name="很長的input2" />
        <Input placeholder="很長的inputasvfsav3" name="很長的input3" />
        <Input
          placeholder="很長的inputatbwebtwetbwebtwebtwebtwetbwesvfsav4"
          name="很長的input4"
        />

        {/* <Select options={[1, 2, 3]} /> */}
      </section>
      <section className="min-h-[100px] outline">2</section>
      <section
        className="flex-grow overflow-auto outline outline-lime-400"
        style={{
          maxHeight: tableContainerHeight,
          maxWidth: tableContainerWidth,
        }}
      >
        {isTableReady && <TableFetcher fetchData={getTableData} />}
      </section>
    </div>
  );
}

// 800 x 1024
// 1024 x 768 (padding = 75px)
