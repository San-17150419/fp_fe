import { useState } from "react";
import { GrSearch, GrDownload } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import axios from "axios";
import clsx from "clsx";
import Loading from "../../../Loading";

type FactoryButtonsProps = {
  factory?: string;
  duration?: { date_start: string; date_end: string }[];
};

export default function FactoryButtons({
  factory,
  duration,
}: FactoryButtonsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const DownloadExcel = async () => {
    if (factory !== "DL" || duration === undefined) return;
    setIsLoading(true);
    const url = "192.168.123.240:9000/api/fj/export-data/";
    const params = {
      factory: factory,
      duration: duration,
    };
    try {
      const response = await axios.post(
        url,
        { params },
        {
          responseType: "blob",
        },
      );

      const dataUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = dataUrl;
      link.setAttribute("download", "factory_log.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="ml-4 flex gap-4">
      <button
        title="Search"
        className="ml-auto mt-6 flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded bg-gray-400 text-xs shadow shadow-gray-500 hover:bg-gray-500 hover:text-white hover:shadow-gray-800 focus:shadow focus:shadow-gray-800 desktop:mt-8 desktop:h-9 desktop:w-9 desktop:text-sm"
        type="submit"
        form="form"
      >
        <GrSearch />
      </button>
      <button
        type="button"
        className={clsx(
          "ml-auto mt-6 flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded bg-gray-400 text-xs shadow shadow-gray-500 hover:bg-gray-500 hover:text-white hover:shadow-gray-800 focus:shadow focus:shadow-gray-800 desktop:mt-8 desktop:h-9 desktop:w-9 desktop:text-sm",
          factory !== "DL" && "cursor-not-allowed",
          !duration && "cursor-not-allowed",
        )}
        onClick={() => DownloadExcel()}
        aria-label="Download Excel"
      >
        <GrDownload />
      </button>
      {isLoading && (
        <Loading>
          <h2>{t("下載需要35秒到40秒")}</h2>
        </Loading>
      )}
    </div>
  );
}
