import { useState } from "react";
import { FormEvent } from "react";
import {
  type MoldInfoUpdateParams,
  type FilterData,
  type MoldInfoUpdateResponse,
} from "../types";
import axios from "axios";
import { Option } from "../../../Components/modd/Select/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import inferSecondSnNum from "../utils/inferSecondSnNum";


type Params = {
  data: FilterData["data"][number];
  makerOptions: Array<Option>;
  propertyOptions: Array<Option>;
  siteOptions: Array<Option>;
  statusOptions: Array<Option>;
};
export default function useUpdate({
  data,
  makerOptions,
  propertyOptions,
  siteOptions,
  statusOptions,
}: Params) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<MoldInfoUpdateParams>(
    (() => {
      // delete dutydate_last in data because it is not present in MoldInfoUpdateParams. Needs to temporarily extend MoldInfoUpdateParams to include dutydate_last and make this property optional. Otherwise, typescript will not allow it to be deleted
      const copy: MoldInfoUpdateParams & { dutydate_last?: string } =
        Object.assign({}, data);
      delete copy["dutydate_last"];
      return copy as MoldInfoUpdateParams;
    })(),
  );
  const isStateInPredefinedOptions = statusOptions.some(
    (option) => option.value === data.state,
  );

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: UpdateMoldData,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["preFilterData"],
        (oldData: FilterData["data"] | undefined) => {
          // Handle the case where oldData might be undefined
          if (!oldData) return oldData;
          const snNumOfUpdateTarget: string[] = [
            data.post.sn_num,
            ...(data.post.sys === "雙色系列"
              ? [inferSecondSnNum(data.post.sn_num)].filter(
                  (snNum) => snNum !== null,
                )
              : []),
          ];

          // Return a new array where the specific mold is updated (This is necessary to update the value in query cache)
          return oldData.map((mold) => {
            // Check if this is the mold we want to update
            if (snNumOfUpdateTarget.includes(mold.sn_num)) {
              // if (mold.sn_num === data.post.sn_num) {
              const postData = data.post;
              // Remove properties with null values to avoid updating them
              const sanitizedData = Object.keys(postData).reduce(
                (acc, key) => {
                  if (postData[key] !== null) {
                    acc[key as keyof FilterData["data"][number]] =
                      postData[key];
                  }
                  return acc;
                },
                {} as Partial<FilterData["data"][number]>,
              );
              // TODO: Might add another check to prevent fields like sys, sn_num, mold_num, hole_num, and id_ms from being updated becasue they are not supposed to be changed here.
              // Merge the updated properties with the old mold data
              return { ...mold, ...sanitizedData };
            }

            return mold;
          });
        },
      );
    },
  });

  const handleUpdateMoldInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };
  
  function handleChange(name: keyof MoldInfoUpdateParams, data: string) {
    setFormData((prev) => ({ ...prev, [name]: data }));
  }

  const selectConfig: SelectConfig = [
    { text: "位置", options: siteOptions, name: "site" },
    { text: "財產歸屬", options: propertyOptions, name: "property" },
    {
      text: "狀態",
      options: statusOptions,
      name: "state",
      disabled: !isStateInPredefinedOptions,
    },
    { text: "製造商代號", options: makerOptions, name: "maker" },
  ];
  const inputConfig: InputConfig = [
    { text: "名版", name: "prod_name_board", readOnly: false },
    { text: "機種", name: "prod_name_nocolor", readOnly: false },
    { text: "系列", name: "sys", readOnly: true },
    { text: "唯一碼", name: "sn_num", readOnly: true },
    { text: "模號", name: "mold_num", readOnly: true },
    { text: "模穴數", name: "hole_num", readOnly: true },
  ];

  return {
    handleUpdateMoldInfo,
    handleChange,
    isModalOpen,
    setIsModalOpen,
    selectConfig,
    inputConfig,
    setFormData,
  };
}

type SelectConfig = {
  name: Name;
  text: string;
  options: Array<Option>;
  disabled?: boolean;
}[];

type InputConfig = {
  name: Name;
  text: string;
  readOnly?: boolean;
}[];

type Name = keyof MoldInfoUpdateParams;

async function UpdateMoldData(
  moldData: MoldInfoUpdateParams,
): Promise<MoldInfoUpdateResponse> {
  const api =
    import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "mold-info-update/";
  const sys = moldData.sys;
  switch (sys) {
    case "雙色系列": {
      const sn_num1 = moldData.sn_num;
      if (!sn_num1) {
        throw new Error("雙色系列 sn_num is invalid");
      }
      const sn_num2 = inferSecondSnNum(sn_num1);
      if (!sn_num2) {
        throw new Error("雙色系列 second sn_num is invalid");
      }
      const promise1 = axios.post(api, {
        ...moldData,
        sn_num: sn_num1,
      });
      const promise2 = axios.post(api, {
        ...moldData,
        sn_num: sn_num2,
      });
      const response = await Promise.all([promise1, promise2]);

      const moldData1 = response[0].data;
      const moldData2 = response[1].data;

      for (const key in moldData1) {
        if (key !== "sn_num") {
          if (moldData1[key] !== moldData2[key]) {
            throw new Error("雙色系列 data of two mold is not equal");
          }
        }
      }

      return response[0].data;
    }
    default: {
      const response = await axios.post<MoldInfoUpdateResponse>(api, moldData);
      return response.data;
    }
  }
}
