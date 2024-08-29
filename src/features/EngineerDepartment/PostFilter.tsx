import { useState, useReducer, useMemo } from "react";
import ComboBox from "./ComboBox";
import { type FilterData } from "./types";
import Loading from "../../Components/Loading";
import Table from "./Table";

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
    moldNumOptions: {
      text: string;
      value: string;
      id: string;
    }[];
  };
};

const reducer = (state: any, action: any) => {
  return action;
};

export default function PostFilter({
  data,
  isLoading,
  postFilterOptions,
}: PostFilterProps) {
  const [state, dispatch] = useReducer(reducer, data, () => {
    const state = {
      data: data,
      allSnNum: Object.keys(data.allData),
      visibleSnNum: (() => {
        const temp: { [key: string]: boolean } = {};
        Object.keys(data.allData).forEach((key) => {
          temp[key] = true;
        });
        return temp;
      })(),
    };
    return state;
  });
  const [mold_num, setMold_num] = useState("all");
  const [prod_name_board, setProd_name_board] = useState("all");
  const [sn_num, setSn_num] = useState("all");
  const { moldNumOptions, boardNameOptions, snNumOptions } = postFilterOptions;
  const memoizedResult = [{ text: "", value: "", id: "" }];
  const memoizedSn_numOptions = [{ text: "", value: "", id: "" }];
  return (
    <>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<String>
          options={moldNumOptions}
          onChange={(value) => setMold_num(value.text)}
          name="模號"
        />
      </div>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<String>
          options={memoizedResult}
          onChange={(value) => setProd_name_board(value.text)}
          name="名版"
        />
      </div>
      <div className="h-10 flex-grow basis-[100px]">
        <ComboBox<String>
          options={memoizedSn_numOptions}
          onChange={(value) => setSn_num(value.text)}
          name="模具唯一碼"
        />
      </div>
      <div className="order-last h-full min-w-full flex-shrink">
        {data ? (
          <Table
            data={(() => Object.values(data.allData))()}
            isLoading={isLoading}
          />
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}
