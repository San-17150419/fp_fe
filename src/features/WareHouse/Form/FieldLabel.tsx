import { FieldApi } from "@tanstack/react-form";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import FieldInfoBase from "./FieldInfo";

export default function FormLabel({
  field,
  children,
}: {
  field: FieldApi<any, any, any, any>;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <>
      <label
        htmlFor={field.name}
        className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
      >
        <span className="w-[30%]">{t(field.name)}</span>
        <span className="w-[70%]">{children}</span>
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