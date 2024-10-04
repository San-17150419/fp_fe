import { type FilterData } from "./types";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import Select, { type Option } from "../../Components/modd/Select/Select";
import Input from "../../Components/modd/Input/InputBase";
import clsx from "clsx";
import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import { ReactNode } from "react";
import useUpdate from "./hooks/useUpdate";
import { getFilterConfig } from "./utils/getFilterConfig";
type UpdateProps = {
  currentMoldData: FilterData["data"][number];
} & PreFilterData;

// TODO: Disallow update value to undefined or empty
export default function Update({
  currentMoldData,
  makerOptions,
  propertyOptions,
  siteOptions,
  statusOptions,
}: UpdateProps) {
  const { handleUpdateMoldInfo, handleChange, isModalOpen, setIsModalOpen } =
    useUpdate({ currentMoldData });
  const { inputConfig, selectConfig } = getFilterConfig(
    currentMoldData,
    makerOptions,
    propertyOptions,
    siteOptions,
    statusOptions,
  );
  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-md bg-blue-600 p-2 text-white"
      >
        更新
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form
          className="m-auto grid w-fit grid-flow-row grid-cols-2 gap-8 text-nowrap border p-2"
          onSubmit={(e) => handleUpdateMoldInfo(e)}
        >
          {inputConfig.map(({ name, text, readOnly }) => (
            <InputField
              key={text}
              name={name as keyof FilterData["data"][number]}
              text={text}
              data={currentMoldData}
              readOnly={readOnly}
              onChange={(data) => handleChange(name, data)}
            />
          ))}
          {selectConfig.map(({ text, options, name, disabled }) => (
            <SelectField<(typeof options)[number]["value"]>
              key={text}
              name={name as keyof FilterData["data"][number]}
              text={text}
              options={options}
              data={currentMoldData}
              disabled={disabled}
              onChange={(option) => handleChange(name, option.value as string)}
            />
          ))}

          <InputField
            text="開模日期"
            name="dutydate_month"
            data={currentMoldData}
            readOnly={false}
            type="date"
            onChange={(data) => handleChange("dutydate_month", data)}
          />
          <div className="col-span-2">
            <button
              type="submit"
              className="col-span-2 ml-auto block rounded-md bg-blue-600 p-2 text-white"
            >
              更新
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

type FieldProps = {
  text: string;
  children?: ReactNode;
};

function Field({ text, children }: FieldProps) {
  // When input or select is inside of a label, their association is implicit. This way, we do not need to set the htmlFor prop explicitly. Therefore, avoid unintended interaction if other tag happened to have the same id.
  return (
    <label className="grid h-full grid-cols-3 items-center justify-start gap-8 p-2 text-lg">
      <span className="w-1/4 min-w-fit text-left font-medium">{text}</span>
      <span className="col-span-2 w-3/4">{children}</span>
    </label>
  );
}

type SelectFieldProps<T> = {
  name: keyof FilterData["data"][number];
  options: Option<T>[];
  data: FilterData["data"][number];
  onChange?: (option: Option<T>) => void;
  text: string;
  disabled?: boolean;
};

function SelectField<T>({
  name,
  text,
  options,
  data,
  onChange,
  disabled,
}: SelectFieldProps<T>) {
  return (
    <Field text={text}>
      <Select<T>
        name={name}
        className="font-normal"
        options={options}
        disabled={disabled}
        defaultValue={
          disabled
            ? { id: data.state, text: data.state, value: data.state as T }
            : options.find((option) => option.value === data[name]) ?? undefined
        }
        onChange={onChange}
      />
    </Field>
  );
}

type InputFieldProps = {
  name: keyof FilterData["data"][number];
  text: string;
  readOnly?: boolean;
  data: FilterData["data"][number];
  type?: "text" | "date";
  onChange?: (value: string) => void;
};

function InputField({
  name,
  text,
  data,
  readOnly,
  type,
  onChange,
}: InputFieldProps) {
  return (
    <Field text={text}>
      <Input
        className={clsx(
          readOnly
            ? "cursor-default border-none bg-white text-center shadow-none"
            : "",
        )}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        type={type}
        name={name}
        defaultValue={data?.[name]}
        readOnly={readOnly}
      />
    </Field>
  );
}
