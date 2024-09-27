import { FormContext } from "./Form";
import { useContext, type InputHTMLAttributes } from "react";
import { type DeepKeys } from "@tanstack/react-form";
import FormFieldContent from "./FormField";

type FormInputFieldProps<T> = {
  fieldName: DeepKeys<T>;
  span: number;
} & InputHTMLAttributes<HTMLInputElement>;
export default function FormInputField<T>({
  fieldName,
  span,
  ...inputProps
}: FormInputFieldProps<T>) {
  const form = useContext(FormContext);

  if (!form) {
    throw new Error("FormField must be used within a Form component");
  }

  return (
    // TODO: It is not connected to the form correctly. For example, the name is not restricted to the default values in the form. I can pass any name to the input field. And it won't give an error.
    <form.Field
      name={fieldName.toString()}
      children={(field) => (
        <FormFieldContent field={field} span={span}>
          <input
            title={fieldName.toString()}
            id={fieldName.toString()}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            {...inputProps}
            className="outline"
          />
        </FormFieldContent>
      )}
    />
  );
}
