import { FormEvent, useState } from "react";
import axios from "axios";
import {
  type MoldInfoInsertParams,
  type MoldInfoInsertSuccessResponse,
  type MoldInfoInsertErrorResponse,
  type Sys,
  type GetNewSNPForSysResponse,
  type GetNewSNPForSys,
  FilterData,
} from "../types";
import inferSecondSnNum from "../utils/inferSecondSnNum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// TODO: Note! In `CreateMold` component, option for 模仁 in sys is not shown. This case required addtional api call. It is possible that I will be forced to write a separate function to get sn_num for 模仁 if I can't fit it into getNewSnNum function.

// TODO: Incoporate  192.168.123.240:9000/api/engms/createSN/ to get sn_num before creating new mold

// TODO: I still have almost 2000 event listeners in the app.
// TODO: BUG! When switching between factory log and engineer department, the number of event listener and DOM Nodes skyrockets. It does drop down
export default function useCreateMold() {
  const [isLoading, setIsLoading] = useState(false);
  const [mold_num, setMoldNum] = useState<string>("");
  const [sys, setSys] = useState<Sys | "">("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sn_target, setSnTarget] = useState<string>("");
  const [message, setMessage] = useState("");
  const [userIsStillEditing, setUserIsStillEditing] = useState(false);
  const [newMoldParams, setNewMoldParams] =
    useState<MoldInfoInsertParams | null>(null);

  const queryClient = useQueryClient();
  const {
    data: snNumData,
    isLoading: isFetchingSnNum,
    isPending: isFetchingSnNumPending,
    error: snNumError,
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

  const { mutate, isPending } = useMutation({
    mutationFn: createNewMold,
    onSuccess: ([responseData1, responseData2]) => {
      // Not sure if I need to invalidate queries here
      // queryClient.invalidateQueries({ queryKey: ["newMoldSnNum"] });
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

  const testParams = {
    sn_num: "123",
    sys: "123",
    mold_num: "123",
    prod_name_board: "123",
    prod_name_nocolor: "123",
    hole_num: 123,
    block_num: 123,
    property_num: "123",
    brand: "123",
    property: "123",
    site: "GD",
    pnb_state: "done",
    maker: "123",
    state: "已報廢",
    dutydate_month: "123",
    spare: "123",
  };
  const handleCreateNewMold = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const api =
      import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "mold-info-insert/";
    console.log("request send");
    try {
      if (newMoldParams?.sys === "雙色系列") {
        console.log("雙色系列");
        const promise1 = axios.post<MoldInfoInsertSuccessResponse>(
          api,
          newMoldParams,
        );
        const promise2 = axios.post<MoldInfoInsertSuccessResponse>(
          api,
          testParams,
        );
        const response = await axios.all([promise1, promise2]);
        response.forEach((response) => {
          setIsSuccess(response.data.info_check.status);
          if ("info_insert" in response.data) {
            console.log(response.data.info_insert);
          }
          if (response.data.post) {
            console.log(response.data.post);
          }
        });
      } else {
        const response = await axios.post<MoldInfoInsertSuccessResponse>(
          api,
          newMoldParams,
        );
        setIsSuccess(response.data.info_check.status);
        if ("info_insert" in response.data) {
          console.log(response.data.info_insert);
        }
        if (response.data.post) {
          console.log(response.data.post);
        }
      }
    } catch (error) {
      setIsError(true);
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response
          ?.data as MoldInfoInsertErrorResponse;

        if (errorResponse) {
          console.log(errorResponse.info_check);
          if ("info_insert" in errorResponse) {
            console.log(errorResponse.info_insert);
          }
          if (errorResponse.post) {
            console.log(errorResponse.post);
          }
        } else {
          console.error("Unexpected error:", error);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const clearForm = () => {
    //
    queryClient.removeQueries({ queryKey: ["newMoldSnNum"] });
    setSnTarget("");
    setMoldNum("");
    setSys("");
  };
  return {
    isLoading,
    isError,
    isSuccess,
    message,
    newMoldParams,
    setNewMoldParams,
    handleCreateNewMold,
    mold_num,
    setMoldNum,
    sys,
    setSys,
    sn_target,
    setSnTarget,
    snNumData,
    isFetchingSnNumPending,
    clearForm,
    setUserIsStillEditing,
    mutate,
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
  const api =
    import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "mold-info-insert/";
  if (moldData.sys === "雙色系列") {
    console.log("雙色系列");
    const moldDataForSecondMold = {
      ...moldData,
      sn_num: inferSecondSnNum(moldData.sn_num),
    };
    const promise1 = axios.post<MoldInfoInsertSuccessResponse>(api, moldData);
    const promise2 = axios.post<MoldInfoInsertSuccessResponse>(
      api,
      moldDataForSecondMold,
    );
    const response = await axios.all([promise1, promise2]);
    return [response[0].data, response[1].data];
  } else {
    console.log("非雙色系列");
    const response = await axios.post<MoldInfoInsertSuccessResponse>(
      api,
      moldData,
    );
    return [response.data];
  }
}
