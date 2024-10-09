import Select, {
  type SelectProps,
} from "../../../Components/modd/Select/Select";
import { type FieldApi } from "@tanstack/react-form";
import FormFieldContent from "./FormField";

type FormInputFieldProps<T> = {
  field: FieldApi<any, any, any, any>;
  span: number;
  labelStyle?: string;
  text?: string;
  isRequired?: boolean;
} & SelectProps<T>;
// TODO: I need to decrease the height of the select
export default function FormInputField<T>({
  field,
  span,
  labelStyle,
  isRequired = false,
  text,
  ...selectProps
}: FormInputFieldProps<T>) {
  return (
    <FormFieldContent
      field={field}
      span={span}
      isRequired={isRequired}
      labelStyle={labelStyle}
      text={text}
    >
      <Select
        value={field.state.value}
        onChange={(e) => field.handleChange(e.value)}
        withBorder={false}
        className="w-full border-none bg-transparent outline-none"
        {...selectProps}
      />
    </FormFieldContent>
  );
}
