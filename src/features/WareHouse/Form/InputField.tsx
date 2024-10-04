import { type InputHTMLAttributes } from "react";
import { type FieldApi } from "@tanstack/react-form";
import FormFieldContent from "./FormField";
import clsx from "clsx";

type FormInputFieldProps = {
  field: FieldApi<any, any, any, any>;
  span: number;
  isRequired?: boolean;
  valueType?: "number" | "string";
} & InputHTMLAttributes<HTMLInputElement>;
export default function FormInputField({
  field,
  span,
  isRequired = false,
  valueType = "string",
  ...inputProps
}: FormInputFieldProps) {
  return (
    // TODO: It is not connected to the form correctly. For example, the name is not restricted to the default values in the form. I can pass any name to the input field. And it won't give an error.

    <FormFieldContent field={field} span={span} isRequired={isRequired}>
      <input
        title={field.name}
        id={field.name}
        value={field.state.value}
        onChange={(e) =>
          field.handleChange(
            valueType === "number"
              ? Number(e.target.value)
              : e.target.value,
          )
        }
        {...inputProps}
        className={clsx("w-full outline-none", inputProps.className)}
      />
    </FormFieldContent>
  );
}