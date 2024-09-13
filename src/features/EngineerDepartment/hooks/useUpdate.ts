import { useState } from "react";
import { FormEvent } from "react";
import {
  type MoldInfoUpdateParams,
  type FilterData,
  type MoldInfoUpdateResponse,
} from "../types";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import inferSecondSnNum from "../utils/inferSecondSnNum";

type Params = {
  currentMoldData: FilterData["data"][number];
};
export default function useUpdate({ currentMoldData }: Params) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const preFilterData = queryClient.getQueryData<FilterData["data"]>([
    "preFilterData",
  ]);
  // TODO: Separate UI logic from API logic

  const [formData, setFormData] = useState<MoldInfoUpdateParams>(
    (() => {
      // delete dutydate_last in data because it is not present in MoldInfoUpdateParams. Needs to temporarily extend MoldInfoUpdateParams to include dutydate_last and make this property optional. Otherwise, typescript will not allow it to be deleted
      const copy: MoldInfoUpdateParams & { dutydate_last?: string } =
        Object.assign({}, currentMoldData);
      delete copy["dutydate_last"];
      return copy as MoldInfoUpdateParams;
    })(),
  );
  const isStateInPredefinedOptions = statusOptions.some(
    (option) => option.value === currentMoldData.state,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateMoldData,
    onSuccess: ([response1, response2]) => {
      queryClient.setQueriesData(
        { queryKey: ["preFilterData"] },
        (oldData: FilterData | undefined) => {
          if (!oldData) return oldData;

          const { data: oldDataFromFilterData, post } = oldData;
          const dataOfUpdatedMolds = [response1.post];

          if (response2) {
            dataOfUpdatedMolds.push(response2.post);
          }

          // Check if the updated mold was already in the cache
          const moldInCacheBeforeUpdate = !!oldDataFromFilterData.find(
            (mold) => mold.sn_num === dataOfUpdatedMolds[0].sn_num,
          );

          // Check if the mold should still be in the cache after the update
          const moldInCacheAfterUpdate =
            dataOfUpdatedMolds[0].site === post.site &&
            dataOfUpdatedMolds[0].property === post.property;

          // Handle all possible cases:
          if (moldInCacheBeforeUpdate && moldInCacheAfterUpdate) {
            // **Update existing mold data**:
            const updatedFilterData = oldDataFromFilterData.map((mold) => {
              const updatedMold = dataOfUpdatedMolds.find(
                (updated) => updated.sn_num === mold.sn_num,
              );

              if (updatedMold) {
                const sanitizedData = Object.keys(updatedMold).reduce(
                  (acc, key) => {
                    if (updatedMold[key as keyof typeof updatedMold] !== null) {
                      acc[key as keyof FilterData["data"][number]] =
                        updatedMold[key as keyof typeof updatedMold];
                    }
                    return acc;
                  },
                  {} as Partial<FilterData["data"][number]>,
                );
                return { ...mold, ...sanitizedData };
              }
              return mold;
            });

            return { post, data: updatedFilterData };
          } else if (moldInCacheBeforeUpdate && !moldInCacheAfterUpdate) {
            // **Remove mold from the cache**:
            const updatedFilterData = oldDataFromFilterData.filter(
              (mold) => mold.sn_num !== dataOfUpdatedMolds[0].sn_num,
            );
            return { post, data: updatedFilterData };
          } else if (!moldInCacheBeforeUpdate && moldInCacheAfterUpdate) {
            // **Add new mold to the cache**:
            const sanitizedNewMoldData = Object.keys(
              dataOfUpdatedMolds[0],
            ).reduce(
              (acc, key) => {
                if (
                  dataOfUpdatedMolds[0][
                    key as keyof (typeof dataOfUpdatedMolds)[0]
                  ] !== null
                ) {
                  acc[key as keyof FilterData["data"][number]] =
                    dataOfUpdatedMolds[0][
                      key as keyof (typeof dataOfUpdatedMolds)[0]
                    ];
                }
                return acc;
              },
              {} as Partial<FilterData["data"][number]>,
            );

            return {
              post,
              data: [
                ...oldDataFromFilterData,
                sanitizedNewMoldData as FilterData["data"][number],
              ],
            };
          } else {
            // **Do nothing if the mold wasn't in the cache and shouldn't be there**:
            return oldData;
          }
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

  return {
    handleUpdateMoldInfo,
    isModalOpen,
    setIsModalOpen,
    setFormData,
    handleChange,
    mutate,
    isPending,
    error,
  };
}
