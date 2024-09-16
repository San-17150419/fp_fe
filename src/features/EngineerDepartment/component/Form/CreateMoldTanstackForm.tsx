import { Dispatch, useState } from "react";
import Select, { type Option } from "../../../../Components/modd/Select/Select";
import Input from "../../../../Components/modd/Input/InputBase";
import { type PreFilterData } from "../../hooks/useENGDepartmentPreData";
import { PnbState, Site, type MoldInfoInsertParams } from "../../types";
import Modal from "../../../../Components/modd/Modal/NonDialogModal";
import { useForm, type FieldApi } from "@tanstack/react-form";
import useCreateMold from "../../hooks/useCreateMold";
import regexValidator from "../../../../util/regexValidator";
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
    setNewMoldParams,
  } = useCreateMold();
  const regexforMoldNumInput = /^[A-Za-z]$|^A1$/;
  const [showModal, setShowModal] = useState(false);
  const fieldConfig: Array<{
    name: keyof MoldInfoInsertParams;
    label: string;
    type: "input" | "select";
    options?: any;
    readOnly?: boolean;
    validator?: (value: any) => string | undefined;
  }> = [
    { name: "sys", label: "系列", type: "select", options: seriesOptions },
    {
      name: "mold_num",
      label: "模號",
      type: "input",
      validator: regexValidator(regexforMoldNumInput, "模號格式錯誤"),
    },
    { name: "sn_num", label: "系列唯一碼", type: "input", readOnly: true },
  ];
  const form = useForm({
    defaultValues: {
      sys: sys,
      mold_num: mold_num,
      sn_num: "" as MoldInfoInsertParams["sn_num"],
      prod_name_board: "" as MoldInfoInsertParams["prod_name_board"],
      prod_name_nocolor: "" as MoldInfoInsertParams["prod_name_nocolor"],
      hole_num: 0 as MoldInfoInsertParams["hole_num"],
      block_num: 0 as MoldInfoInsertParams["block_num"],
      property_num: "" as MoldInfoInsertParams["property_num"],
      pnb_state: "" as MoldInfoInsertParams["pnb_state"],
      brand: 0 as MoldInfoInsertParams["brand"],
      property: "" as MoldInfoInsertParams["property"],
      site: "" as MoldInfoInsertParams["site"],
      state: "" as MoldInfoInsertParams["state"],
      maker: "" as MoldInfoInsertParams["maker"],
      dutydate_month: "" as MoldInfoInsertParams["dutydate_month"],
      spare: "" as MoldInfoInsertParams["spare"],
    },

  });
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
            console.log(form.handleSubmit);
            form.handleSubmit();
          }}
          className="m-auto grid w-fit grid-flow-row grid-cols-2 gap-8 text-nowrap border p-2"
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
                    className="flex h-full items-center justify-between gap-4 p-2"
                    onBlur={() => setUserIsStillEditing(false)}
                    onFocus={() => setUserIsStillEditing(true)}
                  >
                    <span className="w-1/4">系列</span>
                    <span className="w-3/4">
                      <Select
                        onChange={(e) => {
                          field.handleChange(
                            e.text as MoldInfoInsertParams["sys"],
                          );
                        }}
                        onSelect={(e) => {
                          field.handleChange(
                            e.text as MoldInfoInsertParams["sys"],
                          );
                          setSys(e.text as MoldInfoInsertParams["sys"]);
                        }}
                        onBlur={() => field.handleBlur()}
                        options={seriesOptions}
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
                  if (!regexforMoldNumInput.test(value as string)) {
                    return "模號格式錯誤";
                  }
                  return undefined;
                },
                onChange: ({ value }) => {
                  console.log(value);
                  if (!regexforMoldNumInput.test(value as string)) {
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
                    className="flex h-full items-center justify-between gap-4 p-2"
                    onBlur={() => setUserIsStillEditing(false)}
                    onFocus={() => setUserIsStillEditing(true)}
                  >
                    <span className="w-1/4">模號</span>
                    <span className="relative w-3/4">
                      <Input
                        type="text"
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
                    className="flex h-full items-center justify-between gap-4 p-2"
                  >
                    <span className="w-1/4">模號</span>
                    <span className="relative w-3/4">
                      <Input
                        type="text"
                        value={snNumData && snNumData[0]}
                        readOnly
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">名板</span>
                        <span className="relative w-3/4">
                          <Input
                            type="text"
                            onChange={(e) => field.handleChange(e.target.value)}
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">定義品名</span>
                        <span className="relative w-3/4">
                          <Input
                            type="text"
                            onChange={(e) =>
                              field.handleChange(e.target.value as string)
                            }
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
                  name="hole_num"
                  validators={{
                    onChange: ({ value }) => {
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">模穴數</span>
                        <span className="relative w-3/4">
                          <Input
                            type="text"
                            pattern="[0-9]*"
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
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
                  name="block_num"
                  validators={{
                    onChangeListenTo: ["hole_num"],
                    onChange: ({ value, fieldApi }) => {
                      if ((value as any) === "") {
                        return "塞穴數為必填";
                      }
                      if (!value) {
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">塞穴數</span>
                        <span className="relative w-3/4">
                          <Input
                            type="text"
                            pattern="[0-9]*"
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">財產編號</span>
                        <span className="relative w-3/4">
                          <Input
                            type="text"
                            onChange={(e) => field.handleChange(e.target.value)}
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">名版狀態</span>
                        <span className="relative w-3/4">
                          <Select
                            onSelect={(e) =>
                              field.handleChange(e.value as PnbState)
                            }
                            options={[
                              { id: "1", text: "無", value: 0 },
                              {
                                id: "incomplete",
                                text: "未完成",
                                value: "incomplete",
                              },
                              { id: "done", text: "完成", value: "done" },
                            ]}
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">品牌</span>
                        <span className="relative w-3/4">
                          <Select
                            onSelect={(e) =>
                              field.handleChange(Number(e.value))
                            }
                            options={[
                              { id: "1", text: "無", value: 0 },
                              { id: "2", text: "第一品牌", value: 1 },
                              { id: "3", text: "第二品牌", value: 2 },
                            ]}
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">財產歸屬</span>
                        <span className="relative w-3/4">
                          <Select
                            onSelect={(e) =>
                              field.handleChange(e.value as string)
                            }
                            options={propertyOptions}
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">位置</span>
                        <span className="relative w-3/4">
                          <Select
                            onSelect={(e) =>
                              field.handleChange(e.value as Site)
                            }
                            options={siteOptions}
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">狀態</span>
                        <span className="relative w-3/4">
                          <Select
                            onSelect={(e) =>
                              field.handleChange(
                                e.value as MoldInfoInsertParams["state"],
                              )
                            }
                            options={statusOptions}
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
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">廠商代號</span>
                        <span className="relative w-3/4">
                          <Select
                            onSelect={(e) =>
                              field.handleChange(
                                e.value as MoldInfoInsertParams["maker"],
                              )
                            }
                            options={makerOptions}
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
                  name="dutydate_month"
                  children={(field) => (
                    <>
                      <label
                        htmlFor="dutydate_month"
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">開模日期</span>
                        <span className="relative w-3/4">
                          <Input
                            id="dutydate_month"
                            type="date"
                            name="dutydate_month"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
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
                  name="dutydate_month"
                  children={(field) => (
                    <>
                      <label
                        htmlFor="spare"
                        className="flex h-full items-center justify-between gap-4 p-2"
                      >
                        <span className="w-1/4">備註</span>
                        <span className="relative w-3/4">
                          <textarea
                            name="spare"
                            id="spare"
                            className="rounded-md border"
                          ></textarea>
                        </span>
                      </label>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              <div className="col-span-2 outline">
                <form.Subscribe
                  selector={(state) => ({
                    ...state,
                    canSubmit: state.canSubmit,
                    isSubmitting: state.isSubmitting,
                  })}
                  children={({ canSubmit, isSubmitting }) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="ml-auto rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  )}
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
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function requiredValidator(value: any) {
  if (!value) {
    return "必填";
  }
  return undefined;
}

function renderSelectField(
  field: FieldApi<any, any, any>,
  label: string,
  options: Option[],
  setFunc: Function,
) {
  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <Select
        value={field.state.value}
        onChange={(e) => field.handleChange(e.text)}
        onSelect={(e) => {
          field.handleChange(e.text);
          setFunc((prev: any) => {
            return { ...prev, [field.name]: e.text };
          });
        }}
        onBlur={field.handleBlur}
        options={options}
      />
      <FieldInfo field={field} />
    </div>
  );
}
function renderInputField(
  field: FieldApi<any, any, any>,
  label: string,
  readOnly = false,
) {
  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <Input
        id={field.name}
        value={field.state.value}
        readOnly={readOnly}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </div>
  );
}
