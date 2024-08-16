import { useState } from "react";
import { type Factory, type Duration } from "./types";
import { useTranslation } from "react-i18next";
import { downloadExcelFile } from "./utils/downloadExcel";
import FactoryBaseButton from "./FactoryBaseButton";
import { GrDownload } from "react-icons/gr";
import clsx from "clsx";
import Loading from "../../Loading";
type FactoryButtonsProps = {
  // If either factory or duration is undefined, the button will be disabled. The `handleClick` function will not be called. Even if it is called, it will return early when one of the two is undefined.
  factory: Factory | undefined;
  duration: Duration[] | undefined;
};
export default function DownloadExcelButton({
  factory,
  duration,
}: FactoryButtonsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!factory || !duration) return;
    // for now, only DL can be downloaded
    if (factory !== "DL") return;
    setIsLoading(true);
    const url = "http://192.168.123.240:9000/api/fj/export-data/";
    const params = {
      factory: factory,
      duration: duration,
    };
    await downloadExcelFile(url, params, "factory_log").then(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <FactoryBaseButton
        type="button"
        className={clsx(
          factory !== "DL" && "cursor-not-allowed",
          !duration && "cursor-not-allowed",
        )}
        disabled={factory !== "DL" || !duration}
        onClick={() => handleClick()}
        aria-label="Download Excel"
      >
        <GrDownload />
      </FactoryBaseButton>
      {isLoading && (
        <Loading>
          <h2>{t("下載需要35秒到40秒")}</h2>
        </Loading>
      )}
    </>
  );
}
