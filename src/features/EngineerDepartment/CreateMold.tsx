import { useState, type FormEvent, useEffect } from "react";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import withPreData from "./WithPreData";
import Input from "../../Components/modd/Input/InputBase";
import CreateMoldSubComponent from "./CreateMoldSubComponent";
import { type Sys } from "./types";
import Select, { type Option } from "../../Components/modd/Select/Select";
import useCreateMold from "./hooks/useCreateMold";
const CreateMoldSubComponentWithPreData = withPreData(CreateMoldSubComponent);

export type InputConfig = {
  readonly: boolean;
  name: string;
  text: string;
};

export type SelectConfig = {
  name: string;
  text: string;
  options: Array<Option>;
};

const regexforMoldNumInput = /^[A-Za-z]$|^A1$/;

export default function CreateMold({ seriesOptions }: PreFilterData) {
  const [showModal, setShowModal] = useState(false);
  const [sn_num_sub, setSnNumSub] = useState<string>("");
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const {
    setMoldNum,
    mold_num,
    setSys,
    sys,
    snNumData,
    isFetchingSnNumPending,
    clearForm,
    setUserIsStillEditing,
  } = useCreateMold();

  const [isMoldNumValid, setIsMoldNumValid] = useState<boolean>(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    // TODO: Remember to convert the input values for 模穴數 ,塞穴數 and 品牌 to number.
    console.log(data);
  };

  useEffect(() => {
    if (!showModal) {
      clearForm();
      setMoldNum("");
      setSys("");
      setIsMoldNumValid(false);
      setSnNumSub("");
    }
  }, [showModal]);

  return (
    <div className="mb-4 inline-block">
      <div
        role="button"
        onClick={() => setShowModal(true)}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        新增模具
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form
          action=""
          onSubmit={onSubmit}
          id="Create Mold"
          className="m-auto grid w-fit grid-flow-row grid-cols-2 gap-8 text-nowrap border p-2"
        >
          <label
            onBlur={() => setUserIsStillEditing(false)}
            onFocus={() => setUserIsStillEditing(true)}
            className="flex h-full items-center justify-between gap-4 p-2"
          >
            <span className="w-1/4">系列</span>
            <span className="w-3/4">
              <Select
                options={seriesOptions.filter(
                  (option) => option.text !== "模仁",
                )}
                disabled={!isFetchingSnNumPending}
                // unable to reset.
                required={true}
                value={seriesOptions.find((option) => option.text === sys)}
                onSelect={(option) => {
                  setSys(option.text as Sys);
                }}
              />
            </span>
          </label>

          <label
            className="flex h-full items-center justify-between gap-4 p-2"
            onBlur={() => setUserIsStillEditing(false)}
            onFocus={() => setUserIsStillEditing(true)}
          >
            <span className="w-1/4">模號</span>
            <span className="relative w-3/4">
              <Input
                type="text"
                maxLength={2}
                readOnly={!isFetchingSnNumPending}
                value={mold_num}
                onChange={(e) => {
                  setMoldNum(e.target.value);
                  setIsMoldNumValid(regexforMoldNumInput.test(e.target.value));
                }}
              />
              {mold_num && !isMoldNumValid && (
                <span className="absolute -left-1 top-8 p-2 text-red-500">
                  {/* mold_num is valid: {isMoldNumValid.toString()} */}
                  未符合定義格式
                </span>
              )}
            </span>
          </label>
          <label className="flex h-full items-center justify-between gap-4 p-2">
            <span className="w-1/4">系列唯一碼</span>
            <Input
              type="text"
              className="w-3/4"
              defaultValue={snNumData && snNumData[0]}
              readOnly
            />
          </label>
          {!isFetchingSnNumPending && (
            <CreateMoldSubComponentWithPreData
              isSnNumReady={!isFetchingSnNumPending}
              handleReset={clearForm}
              isFormSubmitted={isFormSubmitted}
              setIsFormSubmitted={setIsFormSubmitted}
            />
          )}
        </form>
      </Modal>
    </div>
  );
}
