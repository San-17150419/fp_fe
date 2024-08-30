import { useState, useReducer, useMemo } from "react";
import ComboBox from "./ComboBox";
import { type FilterData } from "./types";
import Loading from "../../Components/Loading";
import Table from "./Table";
import clsx from "clsx";

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

function reducer(state: InitialStateType, action: any) {
  switch (action.type) {
    case "SET_MOLD_NUM":
      return {
        ...state,
        visibleSnNum:
          action.payload === ""
            ? state.defaultVisibleSnNum
            : state.data.moldNumToId[action.payload].reduce(
                (acc: { [key: string]: boolean }, cur) => {
                  acc[cur] = true;
                  return acc;
                },
                {},
              ),
      };
    case "SET_PROD_NAME_BOARD":
      return {
        ...state,
        visibleSnNum:
          action.payload === ""
            ? state.allSnNum.reduce((acc: { [key: string]: boolean }, cur) => {
                acc[cur] = true;
                return acc;
              }, {})
            : state.data.boardNameToId[action.payload].reduce(
                (acc: { [key: string]: boolean }, cur) => {
                  acc[cur] = true;
                  return acc;
                },
                {},
              ),
      };
    case "SET_SN_NUM":
      return {
        ...state,
        visibleSnNum:
          action.payload === ""
            ? state.allSnNum.reduce((acc: { [key: string]: boolean }, cur) => {
                acc[cur] = true;
                return acc;
              }, {})
            : (() => {
                const temp = state.visibleSnNum;
                state["allSnNum"].forEach((key) => {
                  if (key === action.payload) {
                    temp[key] = true;
                  } else {
                    temp[key] = false;
                  }
                });
                return temp;
              })(),
      };
    default:
      return state;
  }
}

type InitialStateType = {
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
  allSnNum: string[];
  visibleSnNum: { [key: string]: boolean };
  defaultVisibleSnNum: { [key: string]: boolean };
};

const initFunction = (data: InitialStateType["data"]): InitialStateType => {
  return {
    data: data,
    allSnNum: Object.keys(data.allData),
    visibleSnNum: (() => {
      const temp: { [key: string]: boolean } = {};
      Object.keys(data.allData).forEach((key) => {
        temp[key] = true;
      });
      return temp;
    })(),
    defaultVisibleSnNum: (() => {
      const temp: { [key: string]: boolean } = {};
      Object.keys(data.allData).forEach((key) => {
        temp[key] = true;
      });
      return temp;
    })(),
  };
};

export default function PostFilter({
  data,
  isLoading,
  postFilterOptions,
}: PostFilterProps) {
  const [state, dispatch] = useReducer<
    React.Reducer<InitialStateType, any>,
    InitialStateType["data"]
  >(reducer, data, initFunction);
  const { moldNumOptions, boardNameOptions, snNumOptions } = postFilterOptions;

  const handleMoldNumChange = (selectedMoldNum: string) => {
    dispatch({
      type: "SET_MOLD_NUM",
      payload: selectedMoldNum,
    });
  };

  const handleProdNameBoardChange = (selectedProdNameBoard: string) => {
    console.log(selectedProdNameBoard);
    dispatch({
      type: "SET_PROD_NAME_BOARD",
      payload: selectedProdNameBoard,
    });
  };

  const handleSnNumChange = (selectedSnNum: string) => {
    console.log(selectedSnNum);
    dispatch({
      type: "SET_SN_NUM",
      payload: selectedSnNum,
    });
  };

  const visibleList = useMemo(() => {
    return Object.keys(state.visibleSnNum).filter(
      (key) => state.visibleSnNum[key],
    );
  }, [state.visibleSnNum]);

  const filteredData = useMemo(() => {
    return visibleList.map((curr) => state.data.allData[curr]);
  }, [visibleList, state.data.allData]);

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
          // options={memoizedSnNumOptions}
          onChange={(value) => handleSnNumChange(value.value)}
          name="模具唯一碼"
        />
      </div>
      <div className="order-last flex h-full min-w-full flex-shrink flex-col">
        {data &&
        Object.keys(state.data.allData).length > 0 &&
        visibleList.length > 0 ? (
          <Table
            data={Object.values(state.data.allData)}
            visibleList={visibleList}
            isLoading={isLoading}
          />
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}
