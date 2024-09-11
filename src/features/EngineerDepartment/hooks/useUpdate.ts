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
  const queryClient = useQueryClient();
  const preFilterData = queryClient.getQueryData<FilterData["data"]>([
    "preFilterData",
  ]);

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

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateMoldData,
    onSuccess: ([moldData1, moldData2]) => {
      queryClient.setQueryData(
        ["preFilterData"],
        (oldData: FilterData["data"] | undefined) => {
          if (!oldData) return oldData;

          const updatedMolds = [moldData1];
          if (moldData2) {
            updatedMolds.push(moldData2);
          }

          return oldData.map((mold) => {
            // Check if the current mold matches either of the updated molds
            const updatedMold = updatedMolds.find(
              (updated) => updated.post.sn_num === mold.sn_num,
            );

            if (updatedMold) {
              const postData = updatedMold.post;

              // Sanitize and merge the updated data with the existing mold data
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

              return { ...mold, ...sanitizedData };
            }

            return mold; // Return the mold unchanged if it wasn't updated
          });
        },
      );
    },
  });
  async function UpdateMoldData(
    moldData: MoldInfoUpdateParams,
  ): Promise<MoldInfoUpdateResponse[]> {
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

        const idMsForMold2 = preFilterData?.find(
          (mold) => mold.sn_num === sn_num2,
        );

        if (!idMsForMold2) {
          throw new Error("雙色系列 idMsForMold2 is invalid");
        }
        const promise1 = axios.post(api, {
          ...moldData,
          sn_num: sn_num1,
        });
        const promise2 = axios.post(api, {
          ...moldData,
          sn_num: sn_num2,
          idMs: idMsForMold2,
        });
        const response = await Promise.all([promise1, promise2]);

        const moldData1 = response[0].data;
        console.log(moldData1);
        const moldData2 = response[1].data;
        console.log(moldData2);

        for (const key in moldData1) {
          if (key !== "sn_num") {
            if (moldData1[key] !== moldData2[key]) {
              throw new Error("雙色系列 data of two mold is not equal");
            }
          }
        }

        return response.map((res) => res.data) as MoldInfoUpdateResponse[];
      }
      default: {
        const response = await axios.post<MoldInfoUpdateResponse>(
          api,
          moldData,
        );
        return [response.data];
      }
    }
  }

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
