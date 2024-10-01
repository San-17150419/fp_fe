import Select, {
  type SelectProps,
} from "../../../Components/modd/Select/Select";
import { type FieldApi } from "@tanstack/react-form";
import FormFieldContent from "./FormField";
import clsx from "clsx";

type FormInputFieldProps<T> = {
  field: FieldApi<any, any, any, any>;
  span: number;
} & SelectProps<T>;
export default function FormInputField<T>({
  field,
  span,
  ...selectProps
}: FormInputFieldProps<T>) {
  return (
    <FormFieldContent field={field} span={span}>
      <Select
        value={field.state.value}
        onChange={(e) => field.handleChange(e.value)}
        className="w-full border-none bg-transparent outline-none"
        {...selectProps}
      />
    </FormFieldContent>
  );
}
