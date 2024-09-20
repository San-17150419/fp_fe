import { useState, type FormEvent, useEffect } from "react";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import withPreData from "./WithPreData";
import Input from "../../Components/modd/Input/InputBase";
import CreateMoldSubComponent from "./CreateMoldSubComponent";
import {
  type Sys,
  type MoldInfoInsertParams,
  Site,
  MoldStatus,
  PnbState,
} from "./types";
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
  options: Array<Option<unknown>>;
};

const regexforMoldNumInput = /^[A-Za-z]$|^A1$/;

export default function CreateMold({ seriesOptions }: PreFilterData) {
  const [showModal, setShowModal] = useState(false);
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
    mutate,
  } = useCreateMold();

  const [isMoldNumValid, setIsMoldNumValid] = useState<boolean>(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    function isString(data: FormDataEntryValue | null): data is string {
      {
        return data !== null && typeof data === "string";
      }
    }
    event.preventDefault();
    if (!snNumData) return;
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const blockNum = Number(data.block_num);
    const holeNnum = Number(data.hole_num);
    // TODO: This check is temporary. It should be checked earlier.
    if (holeNnum <= 0) {
      alert("模穴數不得小於或等於0");
      return;
    }
    if (blockNum < 0) {
      alert("塞穴數不得小於0");
      return;
    }
    if (blockNum > holeNnum) {
      alert("塞穴數不得大於模穴數");
      return;
    }
    const params: MoldInfoInsertParams = {
      sn_num: snNumData[0],
      site: data.site as string as Site,
      state: data.state as string as MoldStatus,
      sys: sys as Sys,
      property: data.property as string, // 財產歸屬
      brand: Number(data.brand),
      prod_name_board: data.prod_name_board as string,
      pnb_state: data.pnb_state as string as PnbState,
      prod_name_nocolor: data.prod_name_nocolor as string,
      mold_num: mold_num,
      hole_num: holeNnum,
      block_num: blockNum,
      property_num: data.property_num as string, // 財產編號
      maker: data.maker as string,
      spare: isString(data.spare) ? data.spare : "",
      dutydate_month: isString(data.dutydate_month) ? data.dutydate_month : "",
    };

    // TODO: Remember to convert the input values for 模穴數 ,塞穴數 and 品牌 to number.
    mutate(params);
  };

  useEffect(() => {
    if (!showModal) {
      clearForm();
      setMoldNum("");
      setSys(undefined);
      setIsMoldNumValid(false);
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
          autoComplete="off"
          className="grid w-fit grid-flow-row grid-cols-2 gap-8 text-nowrap border p-2"
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
                value={seriesOptions.find((option) => option.text === sys)?.value}
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
