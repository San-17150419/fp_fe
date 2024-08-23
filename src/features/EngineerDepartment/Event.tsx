import { useState } from "react";
import {
  type Site,
  type ENGDepartmentPostData,
  type ENGDepartmentPostDataParams,
} from "./types/EngineerDepartmentTypes";
import axios, { isAxiosError } from "axios";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { useTranslation } from "react-i18next";
// Don't know what to name this
type EventProps = {
  sn_num: string;
  site: Site;
  dutydate_last: string;
};

export default function Event({ sn_num, site, dutydate_last }: EventProps) {
  const [open, setOpen] = useState(false);
  const [postData, setPostData] = useState<ENGDepartmentPostData | null>(null);
  const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "event-data/";
  const { t } = useTranslation();
  const params: ENGDepartmentPostDataParams = {
    sn_num: sn_num,
    site: site,
    dutydate_last: dutydate_last,
  };

  //
  const fetchPostData = async () => {
    try {
      const response = await axios.post<ENGDepartmentPostData>(api, params);
      setPostData(response.data);
    } catch (error) {
      console.error(error);
      isAxiosError(error) && console.error(error.response?.data);
    }
  };

  const handleOpen = () => {
    fetchPostData();
    setOpen(true);
  };
  return (
    <>
      <div onClick={() => handleOpen()} className="cursor-pointer p-2">
        {dutydate_last}
      </div>
      {open && (
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {/* <p>{JSON.stringify(postData, null, 2)}</p> */}
          {postData && (
            <div className="mx-auto w-full px-1 py-4">
              <div className="relative mx-auto max-h-[80vh] max-w-full overflow-auto px-2">
                {/* <div className="mx-auto max-w-[90%] max-h-[80vh] bg-red-200 overflow-auto"> */}
                <table className="h-full w-full table-auto border-separate border-spacing-0">
                  <thead className="sticky top-0 z-10 backdrop-opacity-0">
                    <tr>
                      {postData.data[0] &&
                        Object.keys(postData.data[0]).map((key) => (
                          <th
                            key={key}
                            className="border border-gray-300 bg-zinc-200 p-3 text-blue-600"
                          >
                            {t(key)}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="text-center text-black">
                    {postData &&
                      postData.data.map((item, index) => (
                        <tr key={`${item.sn_num}-${index}`}>
                          {Object.keys(item).map((key) => (
                            <td
                              key={key}
                              className="border border-gray-300 p-2"
                            >
                              {item[key as keyof typeof item]}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
