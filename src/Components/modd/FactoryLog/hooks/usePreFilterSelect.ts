import {
  type FactoryLogPreData,
  type FactoryLogPreFilterAction,
  type FactoryLogPreFilterState,
} from "../types/factoryLogDataType";
import { useReducer } from "react";
function factoryLogPreFilterReducer(
  state: FactoryLogPreFilterState,
  action: FactoryLogPreFilterAction,
) {
  switch (action.type) {
    case "setSelectedFactory":
      return { ...state, selectedFactory: action.payload };
    case "setSelectedDateType":
      return { ...state, selectedDateType: action.payload };
    case "setSelectedPoint":
      return { ...state, selectedPoint: action.payload };
    case "setDateStart":
      return { ...state, dateStart: action.payload };
    case "setIsLoading":
      return { ...state, isLoading: action.payload };
    case "setFactoryLogRawData":
      return { ...state, factoryLogRawData: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
}

const factoryLogPreFilterInitialState: FactoryLogPreFilterState = {
  selectedFactory: "GD",
  selectedDateType: "half-year",
  selectedPoint: "ar",
  dateStart: new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0],
  progress: 0,
  isLoading: false,
  factoryLogRawData: null,
};

export default function usePreFilterSelect(
  preData: FactoryLogPreData["preData"],
) {
  const [state, dispatch] = useReducer(
    factoryLogPreFilterReducer,
    factoryLogPreFilterInitialState,
  );
  
  console.log(preData)

  const {
    selectedFactory,
    selectedDateType,
    selectedPoint,
    dateStart,
    isLoading,
    factoryLogRawData,
  } = state;
  return {
    selectedFactory,
    selectedDateType,
    selectedPoint,
    dateStart,
    isLoading,
    factoryLogRawData,
    dispatch,
  };
}
