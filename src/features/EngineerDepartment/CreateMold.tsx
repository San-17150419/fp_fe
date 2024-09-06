import { useState, type FormEvent, useEffect } from "react";
// import useCreateMold from "./hooks/useCreateMold";
import Modal from "../../Components/modd/Modal/NonDialogModal";
import { type PreFilterData } from "./hooks/useENGDepartmentPreData";
import withPreData from "./WithPreData";
import Input from "../../Components/modd/Input/InputBase";
import CreateMoldSubComponent from "./CreateMoldSubComponent";
import { type Sys } from "./types";
import Select, { type Option } from "../../Components/modd/Select/Select";
import axios from "axios";
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
  // const { handleCreateNewMold } = useCreateMold();
  const [moldNum, setMoldNum] = useState<string>("");
  const [sys, setSys] = useState<Sys>("");
  const [sn_num, setSnNum] = useState<string>("");
  const [isSnNumReady, setIsSnNumReady] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  // I thihk it make sense to use a dedicated state for tracking the validity of the mold_num input. It's value is used in many places like conditional rendering, css styles and so on. It does not make sense to run regex on every place where it's used.
  // I want to attach the validation logic to onChange on the Input component. So users can get feedback about the validity of the input right away.
  // But I want to make sure that a request is only made when the input is valld and the select or input element looses focus.
  // Because currently, sys, mold_num and sn_num are locked immediately after the request is made.
  // TODO: server 500 error when mold_num is A1 which is a valid input.
  const [isMoldNumValid, setIsMoldNumValid] = useState<boolean>(false);

  const onBlur = () => {
    if (!moldNum || !sys || !isMoldNumValid) return;
    handleGetNewSnNum();
  };

  const handleReset = () => {
    setIsSnNumReady(false);
    setMoldNum("");
    setSys("");
    setSnNum("");
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  useEffect(() => {
    if (!showModal) {
      setSnNum("");
      setIsSnNumReady(false);
      setMoldNum("");
      setSys("");
    }
  }, [showModal]);

  const handleGetNewSnNum = async () => {
    if (!sys || !moldNum) return;
    if (isSnNumReady) return;
    const api = "http://192.168.123.240:9000/api/engms/createSN/";
    const params = {
      sys: sys,
      mold_num: moldNum,
      sn_target: "",
    };
    try {
      const response = await axios.post(api, { ...params });
      setSnNum(response.data.sn_num);
      setIsSnNumReady(true);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {});
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
            onBlur={onBlur}
            className="flex h-full items-center justify-between gap-4 p-2"
          >
            {/* <label htmlFor="sys"> */}
            <span className="w-1/4">系列</span>
            <Select
              options={seriesOptions.filter((option) => option.text !== "模仁")}
              className="w-3/4"
              disabled={isSnNumReady}
              // unable to reset.
              required={true}
              // if I want to make this Select
              value={seriesOptions.find((option) => option.text === sys)}
              onSelect={(option) => {
                setSys(option.text as string);
              }}
            />
          </label>

          <label
            className="flex h-full items-center justify-between gap-4 p-2"
            onBlur={onBlur}
          >
            <span className="w-1/4">模號</span>
            <span className="relative w-3/4">
              <Input
                type="text"
                maxLength={2}
                readOnly={isSnNumReady}
                value={moldNum}
                onChange={(e) => {
                  setMoldNum(e.target.value);
                  setIsMoldNumValid(regexforMoldNumInput.test(e.target.value));
                }}
              />
              {moldNum && !isMoldNumValid && (
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
              defaultValue={sn_num}
              readOnly
            />
          </label>
          {/* <CreateMoldSubComponentWithPreData
            isSnNumReady={isSnNumReady}
            handleReset={handleReset}
          /> */}

          {isSnNumReady && (
            <CreateMoldSubComponentWithPreData
              isSnNumReady={isSnNumReady}
              handleReset={handleReset}
              isFormSubmitted={isFormSubmitted}
              setIsFormSubmitted={setIsFormSubmitted}
            />
          )}
          {/* <Select name="maker" options={makerOptions} /> */}
        </form>
      </Modal>
    </div>
  );
}
