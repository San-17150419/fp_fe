import { FieldApi } from "@tanstack/react-form";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import FieldInfoBase from "./FieldInfo";
export default function FormField({
  field,
  span = 1,
  isRequired = false,
  labelStyle = "",
  children,
}: {
  field: FieldApi<any, any, any, any>;
  span: number;
  isRequired?: boolean;
  labelStyle?: string;
  // labelStyle?: React.CSSProperties;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <>
      <label
        htmlFor={field.name}
        className={`col-span-${span} $ relative flex flex-col justify-start gap-4 border-b-2 text-sm`}
      >
        <span className={`text-nowrap ${labelStyle}`}>
          {t(field.name)} {isRequired && "*"}
        </span>
        <span className="w-full pb-1">{children}</span>
        <FieldInfo field={field} />
      </label>
    </>
  );
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <FieldInfoBase
      field={field}
      className="absolute left-28 top-12 text-red-500"
    />
  );
}
