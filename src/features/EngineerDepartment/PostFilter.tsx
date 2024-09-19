import { useState } from "react";
import ComboBox from "./ComboBox";
import { type FilterData } from "./types";
import Loading from "../../Components/Loading";
import Table from "./Table";

// TODO
// TODO: Centrailize type
type OptionDictionary = {
  [key: string]: { text: string; value: string; id: string };
};

type PostFilterProps = {
  data: {
    allData: {
      [key: string]: FilterData["data"][number];
    };
    moldNumToId: {
      [key: string]: Array<FilterData["data"][number]["sn_num"]>;
    };
    boardNameToId: {
      [key: string]: Array<FilterData["data"][number]["sn_num"]>;
    };
  };
  isLoading: boolean;
  postFilterOptions: {
    snNumOptions: OptionDictionary;
    boardNameOptions: OptionDictionary;
    moldNumOptions: OptionDictionary;
  };
};

export default function PostFilter({
  data,
  isLoading,
  postFilterOptions,
}: PostFilterProps) {
  const { moldNumOptions, boardNameOptions, snNumOptions } = postFilterOptions;
  const [currentBoardName, setCurrentBoardName] = useState<string>("");
  const [currentMoldNum, setCurrentMoldNum] = useState<string>("");
  const [currentSnNum, setCurrentSnNum] = useState<string>("");

  const handleMoldNumChange = (selectedMoldNum: string) => {
    setCurrentMoldNum(selectedMoldNum);
  };

  const handleProdNameBoardChange = (selectedProdNameBoard: string) => {
    setCurrentBoardName(selectedProdNameBoard);
  };

  const handleSnNumChange = (selectedSnNum: string) => {
    setCurrentSnNum(selectedSnNum);
  };

  const visibleList: Array<string> = (() => {
    if (currentSnNum !== "") return [currentSnNum];
    const nameBoardSet = new Set(
      data["boardNameToId"][currentBoardName === "" ? "all" : currentBoardName],
    );

    const moldNumSet = new Set(
      data["moldNumToId"][currentMoldNum === "" ? "all" : currentMoldNum],
    );
    const intersection = nameBoardSet.intersection(moldNumSet);
    return Array.from(intersection);
  })();

  return (
    <>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<string>
          options={visibleList.map((key) => moldNumOptions[key])}
          onChange={(value) => handleMoldNumChange(value.value)}
          name="模號"
        />
      </div>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<string>
          options={visibleList.map((key) => boardNameOptions[key])}
          onChange={(value) => handleProdNameBoardChange(value.value)}
          name="名版"
        />
      </div>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<string>
          options={visibleList.map((key) => snNumOptions[key])}
          onChange={(value) => handleSnNumChange(value.value)}
          name="模具唯一碼"
        />
      </div>
      <div className="order-last flex h-full min-w-full flex-shrink flex-col">
        <Table
          data={Object.values(data.allData)}
          visibleList={visibleList}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
