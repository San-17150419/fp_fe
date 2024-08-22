import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { useTheme } from "../../../stores/ThemeContext";
import clsx from "clsx";
type ProductStatusProps = {
  value: number[];
  point: "ar" | "pamt_h";
};

const ProductStatus: React.FC<ProductStatusProps> = ({ value, point }) => {
  const { t } = useTranslation();
  const [isLowest, setIsLowest] = useState(false);
  const [isLowerThanStandard, setIsLowerThanStandard] = useState(false);
  const [
    isLowerThanStandardConsecutively,
    setIsLowerThanStandardConsecutively,
  ] = useState(false);
  const [
    numberOfConsecutiveLowerThanStandard,
    setNumberOfConsecutiveLowerThanStandard,
  ] = useState(0);
  // const { isSemiBold, isTextBase } = useTheme();
  useEffect(() => {
    function findLastNonZeroValue(data: number[]) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i] !== 0) {
          return { value: data[i], index: i };
        }
      }
      return { value: 0, index: -1 };
    }
    const calculateStatus = (data: number[]) => {
      const { value: current, index: startIndex } = findLastNonZeroValue(data);
      let consecutiveCount = 0;
      // Technically, when point is pamt_h, I don't need this check 
      // Check for consecutive values lower than standard (85)
      for (let i = startIndex; i >= 0; i--) {
        //
        if (data[i] < 0.85) {
          consecutiveCount++;
        } else {
          break;
        }
      }

      setNumberOfConsecutiveLowerThanStandard(consecutiveCount);
      setIsLowerThanStandardConsecutively(consecutiveCount > 1);

      // Filter out 0 values (0 means no data) and find the lowest number
      const nonZeroNumbers = data.filter((v) => v !== 0);
      const lowest = Math.min(...nonZeroNumbers);
      if (current === lowest) {
        if (current < 0.85) {
          setIsLowerThanStandard(true);
        }
        setIsLowest(current === lowest);
      }
    };

    calculateStatus(value);
  }, [value]);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {isLowest && (
        <p
          className={clsx(
            "rounded-full px-2 py-1 text-sm font-semibold shadow",
            point === "ar" && isLowerThanStandard
              ? "bg-amber-500 text-white shadow-amber-700"
              : "bg-green-500 shadow-green-700",
            point === "pamt_h" && "bg-red-500 text-white shadow-red-700",
          )}
        >
          {point === "pamt_h" ? t("最低機均產出") : t("最低達成率")}
        </p>
      )}
      {point === "ar" && isLowerThanStandardConsecutively && (
        <p
          className={clsx(
            "rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow shadow-red-700",
            // isTextBase ? "text-base" : "text-sm",
          )}
        >
          {t("連續低於標準")}
          {numberOfConsecutiveLowerThanStandard > 1 &&
            ` (${numberOfConsecutiveLowerThanStandard})`}
        </p>
      )}
    </div>
  );
};

export default ProductStatus;
