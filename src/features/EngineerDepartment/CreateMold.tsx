import { useState, type FormEvent, useEffect } from "react";
import useCreateMold from "./hooks/useCreateMold";
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

export default function CreateMold({
  makerOptions,
  propertyOptions,
  siteOptions,
  seriesOptions,
}: PreFilterData) {
  const [showModal, setShowModal] = useState(false);
  const { handleCreateNewMold } = useCreateMold();
  const [moldNum, setMoldNum] = useState<string>("");
  const [sys, setSys] = useState<Sys>("");
  const [sn_num, setSnNum] = useState<string>("");
  const [isSnNumReady, setIsSnNumReady] = useState<boolean>(false);

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
          // onSubmit={handleCreateNewMold}
          onSubmit={onSubmit}
          id="Create Mold"
          className="m-auto grid w-fit grid-flow-row grid-cols-2 gap-8 text-nowrap border p-2"
        >
          <label
            onBlur={() => {
              if (sys !== "" && moldNum) handleGetNewSnNum();
            }}
            className="flex h-full items-center justify-between gap-4 p-2"
            // htmlFor="sys"
          >
            {/* <label htmlFor="sys"> */}
            <span className="w-1/4">系列</span>
            <Select
              options={seriesOptions}
              className="w-3/4"
              disabled={isSnNumReady}
              // unable to reset.
              // if I want to make this Select
              value={seriesOptions.find((option) => option.text === sys)}
              onSelect={(option) => {
                setSys(option.text as string);
              }}
            />
          </label>

          <label
            className="flex h-full items-center justify-between gap-4 p-2"
            onBlur={() => {
              if (sys !== "" && moldNum) handleGetNewSnNum();
            }}
          >
            <span className="w-1/4">模號</span>
            <Input
              type="text"
              className="w-3/4"
              readOnly={isSnNumReady}
              value={moldNum}
              onChange={(e) => {
                setMoldNum(e.target.value);
              }}
            />
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
          <CreateMoldSubComponentWithPreData
            isSnNumReady={isSnNumReady}
            handleReset={handleReset}
          />
          {/* {isSnNumReady && <CreateMoldSubComponentWithPreData isSnNumReady />} */}
          {/* <Select name="maker" options={makerOptions} /> */}
        </form>
      </Modal>
    </div>
  );
}
