import { useState } from "react";
import { type Site, type PostData } from "./types";
import axios from "axios";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { useTranslation } from "react-i18next";
import Loading from "../../Components/Loading";
import { useQuery } from "@tanstack/react-query";
// Don't know what to name this
type EventProps = {
  sn_num: string;
  site: Site;
  dutydate_last: string;
};

// TODO: Data is fetched upon demand. So data is not always ready when modal is fully rendered. The issue is I am not sure why certain table takes longer to render. Even if other table has significantly more data. 1. Add visual cue to inform users data is being fetched. 2. Check the time for table to be ready is caused by the time it takes to fetch data or something else.
// This is for 最後上機
// TODO: If Loading component is shown, it should be shown at least for 1 second(or less). Because sometimes, the data is ready almost immediately. The UX is very inconsistent.
export default function LogData({ sn_num, site, dutydate_last }: EventProps) {
  const [open, setOpen] = useState(false);
  const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "event-data/";
  const {
    data: logData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [sn_num, site, dutydate_last],
    queryFn: async () => {
      const response = await axios.post<PostData>(api, {
        sn_num: sn_num,
        site: site,
        dutydate_last: dutydate_last,
      });
      return response.data;
    },
    enabled: open === true,
  });
  const { t } = useTranslation();

  const handleOpen = () => {
    setOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div
        onClick={() => handleOpen()}
        className="cursor-pointer p-2 text-blue-400"
      >
        {dutydate_last}
      </div>
      {open && (
        // TODO: animation is a bit janky. Especially when site is D08.
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {/* <p>{JSON.stringify(postData, null, 2)}</p> */}
          {isSuccess && (
            <div className="mx-auto min-w-[60vw] px-1 py-4">
              <div className="relative mx-auto max-h-[70vh] max-w-full overflow-auto px-2">
                <table className="h-full w-full table-auto border-separate border-spacing-0">
                  <thead className="sticky top-0 z-10 backdrop-opacity-0">
                    <tr>
                      {logData.data[0] &&
                        Object.keys(logData.data[0]).map((key) => (
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
                    {isSuccess &&
                      logData.data.map((item, index) => (
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
