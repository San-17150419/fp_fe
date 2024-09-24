import { FieldApi } from "@tanstack/react-form";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import FieldInfoBase from "./FieldInfo";

export default function FormField({
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
        className="relative flex h-full items-center justify-between gap-6 p-2"
      >
        <span className="w-1/4">{t(field.name)}</span>
        <span className="w-3/4">{children}</span>
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
