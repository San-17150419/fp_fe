import { useEffect, useState } from "react";
import Select from "../../../../Components/modd/Select/Select";
import FieldInfo from "./FieldInfo";
import Input from "../../../../Components/modd/Input/InputBase";
import { type PreFilterData } from "../../hooks/useENGDepartmentPreData";
import { Site, type MoldInfoInsertParams } from "../../types";
import Modal from "../../../../Components/modd/Modal/NonDialogModal";
import { useForm } from "@tanstack/react-form";
import useCreateMold from "../../hooks/useCreateMold";
import clsx from "clsx";
import FormInputFiled from "./FormInputField";
export default function CreateMoldTanstackForm({
  seriesOptions,
  makerOptions,
  propertyOptions,
  siteOptions,
  statusOptions,
}: PreFilterData) {
  const {
    setMoldNum,
    mold_num,
    setSys,
    sys,
    snNumData,
    isFetchingSnNumPending,
    setUserIsStillEditing,
    mutate,
    clearForm,
    setSnTarget,
  } = useCreateMold();
  const regexForMoldNumInput = /^[A-Za-z]$|^A1$/;
  const regexForNumberOnlyInput = /^[0-9]*$/;
  const [showModal, setShowModal] = useState(false);
  const form = useForm({
    defaultValues: {
      sys: sys,
      mold_num: mold_num,
      sn_target: "",
      sn_num: "",
      prod_name_board: "",
      prod_name_nocolor: "",
      hole_num: "",
      block_num: "",
      property_num: "",
      pnb_state: "",
      brand: 0,
      property: "",
      site: "",
      state: "",
      maker: "",
      dutydate_month: "0000-00-00",
      spare: "",
    },
    onSubmit: (values) => {
      if (snNumData === undefined) return;
      const newValues: MoldInfoInsertParams = {
        ...values.value,
        hole_num: Number(values.value["hole_num"]),
        block_num: Number(values.value.block_num),
        sys: values.value.sys as MoldInfoInsertParams["sys"],
        site: values.value.site as MoldInfoInsertParams["site"],
        state: values.value.state as MoldInfoInsertParams["state"],
        pnb_state: values.value.pnb_state as MoldInfoInsertParams["pnb_state"],
        //
        sn_num: snNumData[0],
      };
      // I am not sure if I need to using type guard here since the form already validates the value.
      mutate(newValues);
    },
  });
  const handleReset = () => {
    // call clearForm() first. Otherwise, the default value form.reset() reset to is still the old value.
    clearForm();
    form.reset();
  };
  useEffect(() => {
    if (!showModal) {
      handleReset();
    }
  }, [showModal]);
  return (
    <div className="mb-4 inline-block">
      <div
        role="button"
        onClick={() => setShowModal(true)}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        新增模具 with Tanstack
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid grid-flow-row grid-cols-2 gap-4 text-nowrap px-2 pt-2 pb-6"
        >
          <div>
            <form.Field
              name="sys"
              validators={{
                onBlur: ({ fieldApi }) => {
                  if ((fieldApi.state.value as any) === "") {
                    return "系統為必填";
                  }
                  if (!fieldApi.state.value) {
                    return "系統為必填";
                  }
                  return undefined;
                },
                onChange: ({ value }) => {
                  if ((value as any) === "") {
                    return "系統為必填";
                  }
                  if (!value) {
                    return "系統為必填";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor="mold_num"
                    className="relative flex h-full items-center justify-between gap-4 p-2"
                    onBlur={() => setUserIsStillEditing(false)}
                    onFocus={() => setUserIsStillEditing(true)}
                  >
                    <span className="w-1/4">系列 *</span>
                    <span className="w-3/4">
                      <Select<MoldInfoInsertParams["sys"]>
                        onChange={(e) => {
                          console.log(e);
                          field.handleChange(e.value);
                          setSys(e.value);
                        }}
                        onBlur={() => field.handleBlur()}
                        options={seriesOptions}
                        disabled={!!snNumData}
                        value={field.state.value}
                      />
                    </span>
                  </label>

                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>
          <div className={!sys || sys !== "模仁" ? "hidden" : ""}>
            <form.Field
              name="sn_target"
              validators={{
                onChangeListenTo: ["sys"],
                onBlur: ({ value, fieldApi }) => {
                  if (fieldApi.form.getFieldValue("sys") !== "模仁")
                    return undefined;
                  if (!value) {
                    return "目標唯一碼為必填";
                  }
                  return undefined;
                },
                onChange: ({ value, fieldApi }) => {
                  if (fieldApi.form.getFieldValue("sys") !== "模仁")
                    return undefined;
                  if (!value) {
                    return "目標唯一碼為必填";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor="sn_target"
                    className="relative flex h-full items-center justify-between gap-4 p-2"
                    onBlur={() => setUserIsStillEditing(false)}
                    onFocus={() => setUserIsStillEditing(true)}
                  >
                    <span className="w-1/4">目標唯一碼 *</span>
                    <span className="w-3/4">
                      <Input
                        type="text"
                        disabled={!!snNumData}
                        maxLength={2}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setSnTarget(e.target.value);
                        }}
                      />
                    </span>
                  </label>

                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>
          <div className={!sys || sys === "模仁" ? "hidden" : ""}>
            <form.Field
              name="mold_num"
              validators={{
                onChangeListenTo: ["sys"],
                onBlur: ({ value, fieldApi }) => {
                  if (fieldApi.form.getFieldValue("sys") === "模仁")
                    return undefined;
                  if (!regexForMoldNumInput.test(value as string)) {
                    return "模號格式錯誤";
                  }
                  return undefined;
                },
                onChange: ({ value, fieldApi }) => {
                  if (fieldApi.form.getFieldValue("sys") === "模仁")
                    return undefined;
                  if (!regexForMoldNumInput.test(value as string)) {
                    return "模號格式錯誤";
                  }
                  if ((value as any) === "") {
                    return "模號為必填";
                  }
                  if (!value) {
                    return "模號為必填";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor="mold_num"
                    className="relative flex h-full items-center justify-between gap-4 p-2"
                    onBlur={() => setUserIsStillEditing(false)}
                    onFocus={() => setUserIsStillEditing(true)}
                  >
                    <span className="w-1/4">模號 *</span>
                    <span className="w-3/4">
                      <Input
                        type="text"
                        disabled={!!snNumData}
                        maxLength={2}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setMoldNum(e.target.value);
                        }}
                      />
                    </span>
                  </label>

                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>

          {!isFetchingSnNumPending && (
            <>
              <div>
                <form.Field
                  name="sn_num"
                  children={(field) => (
                    <>
                      <label
                        htmlFor="sn_num"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">唯一碼 *</span>
                        <span className="w-3/4">
                          <Input
                            type="text"
                            readOnly
                            value={snNumData && snNumData[0]}
                            onChange={() => {
                              snNumData && field.handleChange(snNumData[0]);
                            }}
                            onBlur={() => {
                              snNumData && field.handleChange(snNumData[0]);
                            }}
                          />
                        </span>
                      </label>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="prod_name_board"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "名板為必填";
                      }
                      if (!value) {
                        return "名板為必填";
                      }
                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <FormInputFiled
                        field={field}
                        type="text"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="prod_name_nocolor"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "定義品名為必填";
                      }
                      if (!value) {
                        return "定義品名為必填";
                      }
                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <FormInputFiled
                        field={field}
                        type="text"
                        onChange={(e) =>
                          field.handleChange(e.target.value as string)
                        }
                        value={field.state.value}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="hole_num"
                  validators={{
                    onChange: ({ value }) => {
                      if (!regexForNumberOnlyInput.test(String(value))) {
                        return "模穴數需為數字";
                      }
                      if (!value) {
                        return "模穴數為必填";
                      }
                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <FormInputFiled
                        field={field}
                        type="text"
                        pattern="^[0-9]*$"
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        value={field.state.value}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="block_num"
                  validators={{
                    onChangeListenTo: ["hole_num"],
                    onChange: ({ value, fieldApi }) => {
                      if (!regexForNumberOnlyInput.test(value)) {
                        return "模穴數需為數字且不可小於0";
                      }
                      if (value === "") {
                        return "塞穴數為必填";
                      }
                      if (
                        Number(value) >
                        Number(fieldApi.form.getFieldValue("hole_num"))
                      ) {
                        return "塞穴數不可大於模穴數";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <FormInputFiled
                        field={field}
                        type="text"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        value={field.state.value}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="property_num"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "財產編號為必填";
                      }
                      if (!value) {
                        return "財產編號為必填";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <FormInputFiled
                        field={field}
                        type="text"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="pnb_state"
                  validators={{
                    onChange: ({ value }) => {
                      if (value === "") {
                        return "名版狀態為必填";
                      }
                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      {/*  */}
                      <label
                        htmlFor="pnb_state"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">名版狀態 *</span>
                        <span className="w-3/4">
                          <Select<"done" | "incomplete" | "">
                            onChange={(e) => field.handleChange(e.value)}
                            options={[
                              { id: "無", text: "無", value: "" },
                              {
                                id: "incomplete",
                                text: "未完成",
                                value: "incomplete",
                              },
                              { id: "done", text: "完成", value: "done" },
                            ]}
                            value={
                              field.state.value as "done" | "incomplete" | ""
                            }
                          />
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="brand"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "品牌為必填";
                      }
                      if (!value) {
                        return "品牌為必填";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="brand"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">品牌 *</span>
                        <span className="w-3/4">
                          <Select<number>
                            onChange={(e) => {
                              field.handleChange(e.value);
                            }}
                            value={field.state.value}
                            options={[
                              { id: "1", text: "無", value: 0 },
                              { id: "2", text: "第一品牌", value: 1 },
                              { id: "3", text: "第二品牌", value: 2 },
                            ]}
                          />
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="property"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "財產歸屬為必填";
                      }
                      if (!value) {
                        return "財產歸屬為必填";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="property"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">財產歸屬 *</span>
                        <span className="w-3/4">
                          <Select<string>
                            onChange={(e) => field.handleChange(e.value)}
                            options={propertyOptions}
                          />
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="site"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "位置為必填";
                      }
                      if (!value) {
                        return "位置為必填";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="property"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">位置 *</span>
                        <span className="w-3/4">
                          <Select<Site>
                            onChange={(e) => {
                              console.log(e);
                              console.log(e.value);
                              field.handleChange(e.value);
                            }}
                            options={siteOptions}
                            value={field.state.value as Site}
                          />
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="state"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "狀態為必填";
                      }
                      if (!value) {
                        return "狀態為必填";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="state"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">狀態 *</span>
                        <span className="w-3/4">
                          <Select<MoldInfoInsertParams["state"]>
                            onChange={(e) => field.handleChange(e.value)}
                            options={statusOptions}
                            value={
                              field.state.value as MoldInfoInsertParams["state"]
                            }
                          />
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="maker"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "狀態為必填";
                      }
                      if (!value) {
                        return "狀態為必填";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="maker"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">廠商代號 *</span>
                        <span className="w-3/4">
                          <Select<MoldInfoInsertParams["maker"]>
                            onChange={(e) => field.handleChange(e.value)}
                            options={makerOptions}
                            value={
                              field.state.value as MoldInfoInsertParams["maker"]
                            }
                          />
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>
              <div>
                <form.Field
                  name="dutydate_month"
                  children={(field) => (
                    <>
                      <FormInputFiled
                        field={field}
                        id="dutydate_month"
                        type="date"
                        name="dutydate_month"
                        value={
                          field.state.value === "0000-00-00"
                            ? ""
                            : field.state.value
                        }
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </>
                  )}
                />
              </div>
              {/* TODO: See if I need to create a new component. */}
              {/* TODO: The current component might need a new props to include how col-span affects its layout */}
              <div className="col-span-2">
                <form.Field
                  name="dutydate_month"
                  children={(field) => (
                    <>
                      <label
                        htmlFor="spare"
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        {/* 1/4 = 25% 25% / 2 = 12.5%  */}
                        <span className="w-[12.5%]">備註</span>
                        <span className="w-full">
                          <textarea
                            name="spare"
                            id="spare"
                            className="w-full rounded-md border"
                          ></textarea>
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>

              <div className="col-span-2 flex">
                <form.Subscribe
                  selector={(state) => ({
                    ...state,
                    canSubmit: state.canSubmit,
                    isSubmitting: state.isSubmitting,
                  })}
                  children={({ canSubmit, isSubmitting, isDirty }) => {
                    const isBTNDisabled =
                      !canSubmit || isSubmitting || !isDirty;
                    return (
                      <>
                        <button
                          type="submit"
                          disabled={isBTNDisabled}
                          className={clsx(
                            "ml-auto block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700",
                            {
                              "cursor-not-allowed opacity-50": isBTNDisabled,
                            },
                          )}
                        >
                          Submit
                        </button>
                        <button
                          type="reset"
                          className="ml-auto block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                          onClick={handleReset}
                        >
                          reset
                        </button>
                      </>
                    );
                  }}
                />
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
