import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { useTheme } from "../../../stores/ThemeContext";
import clsx from "clsx";
type ProductStatusProps = {
  value: number[];
  point: "ar" | "pamt_h";
};

const ProductStatus: React.FC<ProductStatusProps> = ({
  value,
  point,
}) => {
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

  useEffect(() => {
    setIsLowest(false);
    setIsLowerThanStandard(false);
    setIsLowerThanStandardConsecutively(false);
    setNumberOfConsecutiveLowerThanStandard(0);

    const calculateStatus = (data: number[]) => {
      // Filter out zero values as they represent missing data
      const nonZeroNumbers = data.filter((value) => value !== 0);

      // If there are no non-zero values, early return with default state updates
      if (nonZeroNumbers.length === 0) {
        setNumberOfConsecutiveLowerThanStandard(0);
        setIsLowerThanStandardConsecutively(false);
        setIsLowest(false);
        setIsLowerThanStandard(false);
        return;
      }

      // Find the lowest and the last non-zero value
      const lowest = Math.min(...nonZeroNumbers);
      const current = nonZeroNumbers[nonZeroNumbers.length - 1];

      // Count consecutive values lower than the standard (0.85)
      const consecutiveCount = nonZeroNumbers.reduceRight((count, value) => {
        return value < 0.85 ? count + 1 : 0;
      }, 0);

      // Update state based on the calculations
      setNumberOfConsecutiveLowerThanStandard(consecutiveCount);
      setIsLowerThanStandardConsecutively(consecutiveCount > 1);
      setIsLowest(current === lowest);
      setIsLowerThanStandard(current < 0.85 && current === lowest);
    };

    calculateStatus(value);
  }, [value]);

  const getStatusClassNames = (point: string) => {
    const baseClassNames =
      "rounded-full px-2 py-1 text-sm font-semibold shadow";

    if (point === "ar") {
      return isLowerThanStandard
        ? `bg-amber-500 text-white shadow-amber-700 ${baseClassNames}`
        : `bg-green-500 shadow-green-700 ${baseClassNames}`;
    }

    return `bg-red-500 text-white shadow-red-700 ${baseClassNames}`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {isLowest && (
        <p className={getStatusClassNames(point)}>
          {point === "pamt_h" ? t("最低機均產出") : t("最低達成率")}
        </p>
      )}
      {point === "ar" && isLowerThanStandardConsecutively && (
        <p className={getStatusClassNames(point)}>
          {t("連續低於標準")}
          {numberOfConsecutiveLowerThanStandard > 1 &&
            ` (${numberOfConsecutiveLowerThanStandard})`}
        </p>
      )}
    </div>
  );
};

export default ProductStatus;
