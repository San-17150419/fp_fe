import { FieldApi } from "@tanstack/react-form";
import cn from "../../../util/cn";

type FieldInfoProps = {
  field: FieldApi<any, any, any, any>;
  className?: string;
};
export default function FieldInfo({ field, className }: FieldInfoProps) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className={cn("text-red-500", className)}>
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
