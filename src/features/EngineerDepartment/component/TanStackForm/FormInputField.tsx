import FormField from "./FormField";
import Input, {
  type InputBaseProps,
} from "../../../../Components/modd/Input/InputBase";
import { type FieldApi } from "@tanstack/react-form";

export type FormInputFieldProps = Omit<InputBaseProps, "value" | "onChange"> & {
  field: FieldApi<any, any, any, any>;
} & (
    | {
        value?: InputBaseProps["value"];
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }
    | {
        value: InputBaseProps["value"];
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }
  );
export default function FormInputFiled({
  field,
  ...inputProps
}: FormInputFieldProps) {
  return (
    <FormField field={field}>
      <Input
        {...inputProps}
        name={field.name}
        onChange={(e) => {
          field.handleChange(e.target.value);
          inputProps.onChange && inputProps.onChange(e);
        }}
        // the input value prioritizes the external `value` prop if available. Otherwise, the value of the field is used.
        value={inputProps.value && !inputProps.defaultValue ? inputProps.value : field.state.value}
      />
    </FormField>
  );
}
