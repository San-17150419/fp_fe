import { useMemo, useState } from "react";
import ComboBox from "./ComboBox";
import Table from "./Table";
import { type FilterDataDictionary } from "./utils/createDictionary";
import { type OptionDictionary } from "./hooks/usePreFilter";
import Loading from "../../Components/Loading";

// TODO: Centrailize type

type PostFilterProps = {
  data: FilterDataDictionary;
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

  const visibleList: Array<string> = useMemo(() => {
    if (currentSnNum !== "") return [currentSnNum];
    const nameBoardSet = new Set(
      data["boardNameToId"][currentBoardName === "" ? "all" : currentBoardName],
    );

    const moldNumSet = new Set(
      data["moldNumToId"][currentMoldNum === "" ? "all" : currentMoldNum],
    );
    const intersection = nameBoardSet.intersection(moldNumSet);
    return Array.from(intersection);
  }, [currentBoardName, currentMoldNum, currentSnNum, data]);

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
      {isLoading ? (
        <Loading />
      ) : (
        <div className="order-last flex h-[70vh] min-w-full flex-shrink flex-col">
          <Table data={Object.values(data.allData)} visibleList={visibleList} />
        </div>
      )}
    </>
  );
}
