import { type FieldApi } from "@tanstack/react-form";
import FormField from "./FormField";
import Select, {
  type SelectProps as BaseSelectProps,
  type Option,
} from "../../../../Components/modd/Select/Select";

export type FormSelectFieldProps<T> = Omit<
  BaseSelectProps<T>,
  "value" | "onChange"
> & {
  field: FieldApi<any, any, any, any>;
} & (
    | {
        value?: Option<T>["value"];
        onChange?: (value: Option<T>) => void;
      }
    | {
        value: Option<T>["value"];
        onChange: (value: Option<T>) => void;
      }
  );

export default function FormSelectField<T>({
  field,
  ...selectProps
}: FormSelectFieldProps<T>) {
  return (
    <FormField field={field}>
      <Select
        {...selectProps}
        // By default, the `value` of the select is the `value` of the field. But we can override that with the `value` prop if the consumer wants to control the value of the select.(for examlpe, add specific logic to control the value of the select when the field changes)

        //
        value={selectProps.value ?? field.state.value}
        // By default, the `value` is updated internally, so the value of field and select are the same. This cannot be overridden. But if the consumer needs to keep the value in sync with an external state, they can use the `onChange` prop to do that.
        onChange={(e) => {
          field.handleChange(e.value);
          selectProps.onChange?.(e);
        }}
      />
    </FormField>
  );
}
