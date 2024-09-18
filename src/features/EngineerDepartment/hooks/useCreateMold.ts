import { useState } from "react";
import axios from "axios";
import {
  type MoldInfoInsertParams,
  type MoldInfoInsertSuccessResponse,
  type Sys,
  type GetNewSNPForSysResponse,
  type GetNewSNPForSys,
  FilterData,
} from "../types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import inferSecondSnNum from "../utils/inferSecondSnNum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// TODO: Note! In `CreateMold` component, option for 模仁 in sys is not shown. This case required addtional api call. It is possible that I will be forced to write a separate function to get sn_num for 模仁 if I can't fit it into getNewSnNum function.

// TODO: Incoporate  192.168.123.240:9000/api/engms/createSN/ to get sn_num before creating new mold

// TODO: I still have almost 2000 event listeners in the app.
// TODO: BUG! When switching between factory log and engineer department, the number of event listener and DOM Nodes skyrockets. It does drop down
// TODO: I am considering separating this hook into two hooks. One for fetching `sn_num` and another for `createMold`
export default function useCreateMold() {
  const [mold_num, setMoldNum] = useState<string>("");
  const [sys, setSys] = useState<Sys | "">("");
  const [sn_target, setSnTarget] = useState<string>("");
  const [userIsStillEditing, setUserIsStillEditing] = useState(false);
  const [newMoldParams, setNewMoldParams] =
    useState<MoldInfoInsertParams | null>(null);

  const queryClient = useQueryClient();
  const {
    data: snNumData,
    // isLoading: isFetchingSnNum,
    isPending: isFetchingSnNumPending,
    // error: snNumError,
  } = useQuery<string[]>({
    queryKey: ["newMoldSnNum"],
    queryFn: () => {
      if (!sys || !mold_num) {
        throw new Error(
          " This should not be triggered when sys or mold_num is empty",
        );
      }
      // if (!sys || !mold_num) return;
      if (sys === "模仁") {
        const params: GetNewSNPForSys<typeof sys> = {
          sys: sys,
          mold_num: "",
          sn_target,
        };
        return getNewSnNum<typeof sys>(params);
      } else {
        return getNewSnNum<typeof sys>({ sys, mold_num, sn_target: "" });
      }
    },
    enabled: !!sys && !!mold_num && !userIsStillEditing,
  });
  // crud
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: createNewMold,
    onSuccess: ([responseData1, responseData2]) => {
      // In Update componet, I need to worry about for the cache I am updating, is it add, delete, update or do nothing? In there, it's always add.

      const notify = () =>
        toast.success("新增成功", {
          position: "top-center",
          autoClose: 5000,
          closeButton: true,
        });
      notify();
      queryClient.setQueriesData(
        { queryKey: ["preFilterData"] },
        (oldData: FilterData["data"] | undefined) => {
          const newMolds = [
            {
              ...responseData1.post,
              dutydate_last: "",
              id_ms: responseData1.info_insert.lastInsertedId,
            },
          ];
          if (responseData2) {
            newMolds.push({
              ...responseData2.post,
              dutydate_last: "",
              id_ms: responseData2.info_insert.lastInsertedId,
            });
          }
          if (!oldData) return newMolds;

          return [...(oldData || []), ...newMolds];
        },
      );
    },
  });

  const clearForm = () => {
    //
    queryClient.removeQueries({ queryKey: ["newMoldSnNum"] });
    setSnTarget("");
    setMoldNum("");
    setSys("");
  };
  return {
    isSuccess,
    newMoldParams,
    setNewMoldParams,
    mold_num, //
    setMoldNum, //
    sys, //
    setSys, //
    sn_target,
    setSnTarget,
    snNumData, //
    isFetchingSnNumPending, //
    clearForm, //
    setUserIsStillEditing, //
    mutate, //
    isPending,
    error,
  };
}

const getNewSnNum = async <T>(
  params: GetNewSNPForSys<T>,
): Promise<Array<string>> => {
  const api = "http://192.168.123.240:9000/api/engms/createSN/";
  const response = await axios.post<GetNewSNPForSysResponse<T>>(api, params);
  if ("sn_num_sub" in response.data) {
    return [response.data.sn_num, response.data.sn_num_sub];
  } else {
    return [response.data.sn_num];
  }
};

// TODO: Add error handling. See MoldInfoInsertErrorResponse. I am not sure how it interacts with react query.
// 像是missing key, duplicate key 或是多次寫入
async function createNewMold(
  moldData: MoldInfoInsertParams,
): Promise<MoldInfoInsertSuccessResponse[]> {
  // TODO: dutydate_month is required?
  const api =
    import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "mold-info-insert/";
  if (moldData.sys === "雙色系列") {
    const moldDataForSecondMold = {
      ...moldData,
      sn_num: inferSecondSnNum(moldData.sn_num),
    };
    const promise1 = axios.post<MoldInfoInsertSuccessResponse>(api, moldData);
    const promise2 = axios.post<MoldInfoInsertSuccessResponse>(
      api,
      moldDataForSecondMold,
    );
    const response = await Promise.all([promise1, promise2]);
    return [response[0].data, response[1].data];
  } else {
    const response = await axios.post<MoldInfoInsertSuccessResponse>(
      api,
      moldData,
    );
    return [response.data];
  }
}
