import { useEffect, useState } from "react";
import Select from "../../../../Components/modd/Select/Select";
import Input from "../../../../Components/modd/Input/InputBase";
import { type PreFilterData } from "../../hooks/useENGDepartmentPreData";
import { Site, type MoldInfoInsertParams } from "../../types";
import Modal from "../../../../Components/modd/Modal/NonDialogModal";
import { useForm, type FieldApi } from "@tanstack/react-form";
import useCreateMold from "../../hooks/useCreateMold";
import clsx from "clsx";
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
  } = useCreateMold();
  const regexForMoldNumInput = /^[A-Za-z]$|^A1$/;
  const regexForNumberOnlyInput = /^[0-9]*$/;
  const [showModal, setShowModal] = useState(false);
  const form = useForm({
    defaultValues: {
      sys: sys,
      mold_num: mold_num,
      sn_num: snNumData ? snNumData[0] : "",
      prod_name_board: "",
      prod_name_nocolor: "",
      hole_num: 0,
      block_num: 0,
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
      // I am not sure if I need to using type guard here since the form already validates the value.
      mutate(values.value as unknown as MoldInfoInsertParams);
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
          className="grid grid-flow-row grid-cols-2 gap-8 text-nowrap p-2"
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
                          field.handleChange(e.value);
                        }}
                        onSelect={(e) => {
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
          <div>
            <form.Field
              name="mold_num"
              validators={{
                onBlur: ({ value }) => {
                  if (!regexForMoldNumInput.test(value as string)) {
                    return "模號格式錯誤";
                  }
                  return undefined;
                },
                onChange: ({ value }) => {
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
                        defaultValue={snNumData && snNumData[0]}
                        readOnly
                        onChange={(e) => {
                          field.handleChange(e.target.value);
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
                      <label
                        htmlFor="prod_name_board"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">名板 *</span>
                        <span className="w-3/4">
                          <Input
                            type="text"
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
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
                      <label
                        htmlFor="prod_name_nocolor"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">定義品名 *</span>
                        <span className="w-3/4">
                          <Input
                            type="text"
                            onChange={(e) =>
                              field.handleChange(e.target.value as string)
                            }
                            value={field.state.value}
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
                  name="hole_num"
                  validators={{
                    onChange: ({ value }) => {
                      if (
                        !regexForNumberOnlyInput.test(
                          value as unknown as string,
                        )
                      ) {
                        return "模穴數格式錯誤";
                      }
                      if ((value as any) === "") {
                        return "模穴數為必填";
                      }
                      if (!value) {
                        return "模穴數為必填";
                      }
                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="hole_num"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">模穴數 *</span>
                        <span className="w-3/4">
                          <Input
                            type="text"
                            pattern="^[0-9]*$"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!!value)
                                if (!!Number(value)) {
                                  field.handleChange(Number(value));
                                }
                            }}
                            value={field.state.value}
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
                  name="block_num"
                  validators={{
                    onChangeListenTo: ["hole_num"],
                    onChange: ({ value, fieldApi }) => {
                      if (
                        !regexForNumberOnlyInput.test(
                          value as unknown as string,
                        )
                      ) {
                        return "模穴數格式錯誤";
                      }
                      if ((value as any) === "") {
                        return "塞穴數為必填";
                      }
                      if (value !== 0 && !value) {
                        return "塞穴數為必填";
                      }
                      if (value < 0) {
                        return "塞穴數不可為負數";
                      }
                      if (value > fieldApi.form.getFieldValue("hole_num")) {
                        return "塞穴數不可大於模穴數";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="block_num"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">塞穴數 *</span>
                        <span className="w-3/4">
                          <Input
                            type="text"
                            pattern="[0-9]*"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!!value)
                                if (!!Number(value)) {
                                  field.handleChange(Number(value));
                                }
                            }}
                            placeholder={field.state.value === 0 ? "" : "0"}
                            value={field.state.value}
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
                      <label
                        htmlFor="property_num"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">財產編號 *</span>
                        <span className="relative w-3/4">
                          <Input
                            type="text"
                            onChange={(e) => field.handleChange(e.target.value)}
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
                  name="pnb_state"
                  validators={{
                    onChange: ({ value }) => {
                      if ((value as any) === "") {
                        return "名版狀態為必填";
                      }
                      if (!value) {
                        return "名版狀態為必填";
                      }

                      if (value !== "done" && value !== "incomplete") {
                        return "名版狀態為必填";
                      }

                      return undefined;
                    },
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor="pnb_state"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">名版狀態 *</span>
                        <span className="w-3/4">
                          <Select<"done" | "incomplete" | "">
                            onSelect={(e) => field.handleChange(e.value)}
                            options={[
                              { id: "1", text: "無", value: "" },
                              {
                                id: "incomplete",
                                text: "未完成",
                                value: "incomplete",
                              },
                              { id: "done", text: "完成", value: "done" },
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
                            onSelect={(e) => field.handleChange(Number(e))}
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
                            onSelect={(e) => field.handleChange(e.value)}
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
                            onSelect={(e) => field.handleChange(e.value)}
                            options={siteOptions}
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
                            onSelect={(e) => field.handleChange(e.value)}
                            options={statusOptions}
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
                            onSelect={(e) => field.handleChange(e.value)}
                            options={makerOptions}
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
                      <label
                        htmlFor="dutydate_month"
                        className="relative flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">開模日期</span>
                        <span className="w-3/4">
                          <Input
                            id="dutydate_month"
                            type="date"
                            name="dutydate_month"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </span>
                        <FieldInfo field={field} />
                      </label>
                    </>
                  )}
                />
              </div>
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

              <div className="col-span-2">
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
                        <button type="reset" onClick={handleReset}>
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

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="absolute left-24 top-12 text-red-500">
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

// function requiredValidator(value: any) {
//   if (!value) {
//     return "必填";
//   }
//   return undefined;
// }

// function renderSelectField(
//   field: FieldApi<any, any, any>,
//   label: string,
//   options: Option[],
//   setFunc: Function,
// ) {
//   return (
//     <div>
//       <label htmlFor={field.name}>{label}</label>
//       <Select
//         value={field.state.value}
//         onChange={(e) => field.handleChange(e.text)}
//         onSelect={(e) => {
//           field.handleChange(e.text);
//           setFunc((prev: any) => {
//             return { ...prev, [field.name]: e.text };
//           });
//         }}
//         onBlur={field.handleBlur}
//         options={options}
//       />
//       <FieldInfo field={field} />
//     </div>
//   );
// }
// function renderInputField(
//   field: FieldApi<any, any, any>,
//   label: string,
//   readOnly = false,
// ) {
//   return (
//     <div>
//       <label htmlFor={field.name}>{label}</label>
//       <Input
//         id={field.name}
//         value={field.state.value}
//         readOnly={readOnly}
//         onBlur={field.handleBlur}
//         onChange={(e) => field.handleChange(e.target.value)}
//       />
//       <FieldInfo field={field} />
//     </div>
//   );
// }
