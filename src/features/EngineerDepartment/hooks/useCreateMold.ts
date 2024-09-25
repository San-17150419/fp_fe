import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import {
  type MoldInfoInsertParams,
  type MoldInfoInsertSuccessResponse,
  type GetNewSNPForSysResponse,
  type GetNewSNPForSys,
  FilterData,
} from "../types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactFormApi, type FormApi } from "@tanstack/react-form";
const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "createSN/";

// TODO: Note! In `CreateMold` component, option for 模仁 in sys is not shown. This case required addtional api call. It is possible that I will be forced to write a separate function to get sn_num for 模仁 if I can't fit it into getNewSnNum function.
// TODO: I still have almost 2000 event listeners in the app.
// TODO: BUG! When switching between factory log and engineer department, the number of event listener and DOM Nodes skyrockets. It does drop down

type Form = FormApi<any, any> & ReactFormApi<any, any>;
export default function useCreateMold(form: Form) {
  const mold_num = form.useStore((state) => state.values.mold_num);
  const sys = form.useStore((state) => state.values.sys);
  const sn_target = form.useStore((state) => state.values.sn_target);
  const [userIsStillEditing, setUserIsStillEditing] = useState(false);
  const [isSnTargetValid, setIsSnTargetValid] = useState<boolean>(false);
  const canFetchSnNum =
    !!sys &&
    !userIsStillEditing &&
    (sys === "模仁" ? !!sn_target && isSnTargetValid : !!mold_num);
  const [newMoldParams, setNewMoldParams] =
    useState<MoldInfoInsertParams | null>(null);

  const queryClient = useQueryClient();
  const allMoldData = queryClient.getQueryData<FilterData>([
    "preFilterData",
    {
      mold_num: "",
      prod_name_board: "",
      property: "",
      site: "",
      sn_num: "",
      sys: "",
    },
  ])?.data;

  function isSnTargetInExistingData(sn_target: string) {
    if (!allMoldData) {
      setIsSnTargetValid(false);
      return false;
    }
    const isSnTargetValid = allMoldData.some((d) => d.sn_num === sn_target);
    setIsSnTargetValid(isSnTargetValid);
    return isSnTargetValid;
  }
  const {
    data: snNumData,
    // isLoading: isFetchingSnNum,
    isPending: isFetchingSnNumPending,
    // error: snNumError,
  } = useQuery<string[]>({
    queryKey: ["newMoldSnNum"],
    queryFn: () => {
      if (!sys) throw new Error("sys is empty");
      if (sys === "模仁" && !sn_target) {
        throw new Error("sn_target is empty");
      }
      if (sys !== "模仁" && !mold_num) {
        throw new Error("mold_num is empty when sys is not 模仁");
      }
      // if (!sys || !mold_num) return;
      if (sys === "模仁") {
        const params: GetNewSNPForSys<typeof sys> = {
          sys: sys,
          sn_target,
        };
        return getNewSnNum<typeof sys>(params);
      } else {
        return getNewSnNum<typeof sys>({ sys, mold_num });
      }
    },

    enabled: canFetchSnNum,
  });

  useEffect(() => {
    if (snNumData !== undefined) {
      form.setFieldValue("sn_num", snNumData.join(",")); // Update form state here
    }
  }, [snNumData, form]);
  // crud
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: createNewMold,
    onSuccess: ([responseData1, responseData2]) => {
      toast.success("新增成功", {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
      queryClient.setQueriesData(
        { queryKey: ["preFilterData"] },
        (oldData: FilterData | undefined) => {
          if (!oldData) return oldData;
          const newMolds: Array<FilterData["data"][number]> = [
            {
              ...responseData1.post,
              dutydate_last: "",
              id_ms: responseData1.info_insert.lastInsertedId,
            } as FilterData["data"][number],
          ];
          if (responseData2) {
            newMolds.push({
              ...responseData2.post,
              dutydate_last: "",
              id_ms: responseData2.info_insert.lastInsertedId,
            });
          }
          return {
            post: oldData.post,
            data: [...oldData.data, ...newMolds],
          };
        },
      );
    },

    onError: (error) => {
      const errorMessage = isAxiosError(error)
        ? error.response?.data.info_check.detail
        : error;
      toast.error(`新增失敗 ${errorMessage}`, {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    },
  });
  const clearForm = () => {
    form.reset();
    queryClient.removeQueries({ queryKey: ["newMoldSnNum"] });
  };
  return {
    isSuccess,
    newMoldParams,
    setNewMoldParams,
    mold_num, //
    sys, //
    sn_target,
    snNumData, //
    isFetchingSnNumPending, //
    clearForm, //
    setUserIsStillEditing, //
    mutate, //
    isPending,
    error,
    isSnTargetInExistingData,
  };
}

const getNewSnNum = async <T>(
  params: GetNewSNPForSys<T>,
): Promise<Array<string>> => {
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
  moldData: Array<MoldInfoInsertParams>,
): Promise<MoldInfoInsertSuccessResponse[]> {
  // TODO: dutydate_month is required?
  const api =
    import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "mold-info-insert/";
  if (moldData[0].sys === "雙色系列") {
    const promise1 = axios.post<MoldInfoInsertSuccessResponse>(
      api,
      moldData[0],
    );
    const promise2 = axios.post<MoldInfoInsertSuccessResponse>(
      api,
      moldData[1],
    );
    const response = await Promise.all([promise1, promise2]);
    return [response[0].data, response[1].data];
  } else {
    const response = await axios.post<MoldInfoInsertSuccessResponse>(
      api,
      moldData[0],
    );
    return [response.data];
  }
}
