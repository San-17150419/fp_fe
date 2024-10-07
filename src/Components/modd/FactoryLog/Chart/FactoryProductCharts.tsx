import { useState } from "react";
import Modal from "../../Modal/NonDialogModal";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  Factory,
  type FactoryEventResponse,
} from "../types/factoryLogDataType";
import BubbleChart from "./BubbleChart";
import { useTheme } from "../../../../stores/ThemeContext";
import clsx from "clsx";
import ColumnLineChart from "./ColumnLineChart";
type ProductChartProps = {
  factory: Factory;
  duration: { date_start: string; date_end: string }[];
  postData: Record<string, any>;
  title: string;
  department: string;
};

// This component is responsible for fetching the event data from the server.
export default function ProductChart({
  factory,
  postData,
  duration,
  title: sysName,
  department,
}: ProductChartProps) {
  const [eventData, setEventData] = useState<FactoryEventResponse | null>(null);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isSemiBold, isTextBase } = useTheme();

  const listOfDeparmentThatSupportBubbleChart: Record<Factory, string[]> = {
    GD: ["INJ", "T1", "T2"],
    HP: ["INJ", "T1", "T2", "T3"],
    DL: ["INJ", "ASM"],
  };

  const fetchEventData = async () => {
    try {
      const response = await axios.post(
        "https://192.168.123.240:9000/api/fj/event-data/",
        {
          factory: factory,
          department,
          sys: sysName,
          date_start: duration[0].date_start,
          date_end: duration[0].date_end,
        },
      );
      setEventData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <span>
      <button
        type="button"
        className={clsx(
          "cursor-pointer underline shadow-sm hover:shadow-md focus:text-red-500",
          isSemiBold ? "font-semibold" : "font-normal",
          isTextBase ? "text-base" : "text-sm",
        )}
        onClick={() => {
          setIsOpen(true);
          fetchEventData();
        }}
      >
        {t(sysName)}
      </button>

      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <div className="flex flex-col items-center justify-center gap-4 px-1 py-2">
          <ColumnLineChart
            duration={duration}
            postData={postData}
            title={sysName}
          />
          {eventData && department === "INJ" ? (
            <BubbleChart eventData={eventData} keyForData="data_mold" />
          ) : (
            listOfDeparmentThatSupportBubbleChart[factory].includes(
              department,
            ) &&
            eventData && <BubbleChart eventData={eventData} keyForData="data" />
          )}
        </div>
      </Modal>
    </span>
  );
}
