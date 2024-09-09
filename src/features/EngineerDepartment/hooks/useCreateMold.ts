import { FormEvent, useState } from "react";
import axios from "axios";
import {
  type MoldInfoInsertParams,
  type MoldInfoInsertSuccessResponse,
  type MoldInfoInsertErrorResponse,
} from "../types";

// TODO: Incoporate  192.168.123.240:9000/api/engms/createSN/ to get sn_num before creating new mold
export default function useCreateMold() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [newMoldParams, setNewMoldParams] =
    useState<MoldInfoInsertParams | null>(null);
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
  return {
    isLoading,
    isError,
    isSuccess,
    message,
    newMoldParams,
    setNewMoldParams,
    handleCreateNewMold,
  };
}

// required value includes: sn_num, sys, mold_num
