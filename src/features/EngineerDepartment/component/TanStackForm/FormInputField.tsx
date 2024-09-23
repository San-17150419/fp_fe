import FormField from "./FormField";
import Input, {
  type InputBaseProps,
} from "../../../../Components/modd/Input/InputBase";
import { type FieldApi } from "@tanstack/react-form";

type FormFieldProps = InputBaseProps & { field: FieldApi<any, any, any, any> };

export default function FormInputFiled({
  field,
  ...inputProps
}: FormFieldProps) {
  return (
    <FormField field={field}>
      <Input {...inputProps} />
    </FormField>
  );
}
