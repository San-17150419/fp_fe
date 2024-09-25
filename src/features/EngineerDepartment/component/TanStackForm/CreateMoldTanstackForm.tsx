import { useEffect, useState } from "react";
import FieldInfo from "./FieldInfo";
import FormSelectField from "./FormSelectField";
import { type PreFilterData } from "../../hooks/useENGDepartmentPreData";
import { type MoldInfoInsertParams } from "../../types";
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
  const regexForMoldNumInput = /^[A-Za-z]$|^A1$/;
  const regexForNumberOnlyInput = /^[0-9]*$/;
  const [showModal, setShowModal] = useState(false);
  const form = useForm({
    defaultValues: {
      sys: "",
      mold_num: "",
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
      const sn_nums = values.value.sn_num.split(",");
      const moldDataArray: MoldInfoInsertParams[] = [
        {
          ...values.value,
          hole_num: Number(values.value["hole_num"]),
          block_num: Number(values.value.block_num),
          sys: values.value.sys as MoldInfoInsertParams["sys"],
          site: values.value.site as MoldInfoInsertParams["site"],
          state: values.value.state as MoldInfoInsertParams["state"],
          pnb_state: values.value
            .pnb_state as MoldInfoInsertParams["pnb_state"],
          sn_num: sn_nums[0],
        },
      ];

      if (sn_nums.length > 1) {
        moldDataArray.push({
          ...values.value,
          hole_num: Number(values.value["hole_num"]),
          block_num: Number(values.value.block_num),
          sys: values.value.sys as MoldInfoInsertParams["sys"],
          site: values.value.site as MoldInfoInsertParams["site"],
          state: values.value.state as MoldInfoInsertParams["state"],
          pnb_state: values.value
            .pnb_state as MoldInfoInsertParams["pnb_state"],
          sn_num: sn_nums[1],
        });
      }
      moldDataArray.forEach((moldData) => {
        if ("sn_target" in moldData) {
          delete moldData.sn_target;
        }
      });
      // console.log(moldDataArray);
      mutate(moldDataArray);
    },
  });

  const {
    isFetchingSnNumPending,
    setUserIsStillEditing,
    mutate,
    clearForm,
    isSnTargetInExistingData,
    snNumData,
    sys,
  } = useCreateMold(form);
  const handleReset = () => {
    // call clearForm() first. Otherwise, the default value form.reset() reset to is still the old value.
    clearForm();
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
          className="grid grid-flow-row grid-cols-2 gap-4 text-nowrap px-2 pb-6 pt-2"
        >
          <div
            onBlur={() => setUserIsStillEditing(false)}
            onFocus={() => setUserIsStillEditing(true)}
          >
            {/* 系統 */}
            <form.Field
              name="sys"
              validators={{
                onBlur: ({ fieldApi }) => {
                  if (!fieldApi.state.value) {
                    return "系統為必填";
                  }
                  return undefined;
                },
                onChange: ({ value }) => {
                  if (!value) {
                    return "系統為必填";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <FormSelectField
                  field={field}
                  disabled={!!snNumData}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.value);
                  }}
                  options={seriesOptions}
                />
              )}
            />
          </div>
          {/* 目標唯一碼 */}
          <div
            className={!sys || sys !== "模仁" ? "hidden" : ""}
            onBlur={() => setUserIsStillEditing(false)}
            onFocus={() => setUserIsStillEditing(true)}
          >
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
                  if (!isSnTargetInExistingData(value)) {
                    return "目標唯一碼不存在";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <FormInputFiled
                  field={field}
                  type="text"
                  disabled={snNumData?.length === 0}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                />
              )}
            />
          </div>
          {/* 模號 */}
          <div
            className={!sys || sys === "模仁" ? "hidden" : ""}
            onBlur={() => setUserIsStillEditing(false)}
            onFocus={() => setUserIsStillEditing(true)}
          >
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
                  if (!value) {
                    return "模號為必填";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <FormInputFiled
                  field={field}
                  type="text"
                  disabled={!!snNumData}
                  maxLength={2}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                />
              )}
            />
          </div>
          {/* 模具唯一碼 */}
          <div>
            <form.Field
              name="sn_num"
              children={(field) => (
                <FormInputFiled
                  field={field}
                  type="text"
                  readOnly
                  defaultValue={snNumData ? String(snNumData) : ""}
                  // value={snNum ? String(snNum) : ""}
                  // onChange={() => {
                  //   field.handleChange(snNum ? String(snNum) : "");
                  // }}
                />
              )}
            />
          </div>
          {!isFetchingSnNumPending && snNumData && (
            <>
              {/* 名板 */}
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
                    <FormInputFiled
                      field={field}
                      type="text"
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 定義品名 */}
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
                    <FormInputFiled
                      field={field}
                      type="text"
                      onChange={(e) =>
                        field.handleChange(e.target.value as string)
                      }
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 模穴數 */}
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
                    <FormInputFiled
                      field={field}
                      type="text"
                      pattern="^[0-9]*$"
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 塞穴數 */}
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
                    <FormInputFiled
                      field={field}
                      type="text"
                      pattern="[0-9]*"
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 財產編號 */}
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
                    <FormInputFiled
                      field={field}
                      type="text"
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 名版狀態 */}
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
                    <FormSelectField
                      field={field}
                      value={field.state.value}
                      options={[
                        { id: "無", text: "無", value: "" },
                        {
                          id: "incomplete",
                          text: "未完成",
                          value: "incomplete",
                        },
                        { id: "done", text: "完成", value: "done" },
                      ]}
                      onChange={(e) => field.handleChange(e.value)}
                    />
                  )}
                />
              </div>
              {/* 品牌 */}
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
                    <FormSelectField
                      field={field}
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
                  )}
                />
              </div>
              {/* 財產歸屬 */}
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
                    <FormSelectField
                      field={field}
                      onChange={(e) => field.handleChange(e.value)}
                      options={propertyOptions}
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 位置 */}
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
                    <FormSelectField
                      field={field}
                      onChange={(e) => field.handleChange(e.value)}
                      options={siteOptions}
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 狀態 */}
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
                    <FormSelectField
                      field={field}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.value)}
                      options={statusOptions}
                    />
                  )}
                />
              </div>
              {/* 製造商代號 */}
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
                    <FormSelectField<MoldInfoInsertParams["maker"]>
                      field={field}
                      onChange={(e) => field.handleChange(e.value)}
                      options={makerOptions}
                      value={field.state.value}
                    />
                  )}
                />
              </div>
              {/* 最後上機 */}
              <div>
                <form.Field
                  name="dutydate_month"
                  children={(field) => (
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
                  )}
                />
              </div>
              {/* TODO: See if I need to create a new component. */}
              {/* TODO: The current component might need a new props to include how col-span affects its layout */}
              {/* 備註 */}
              <div className="col-span-2">
                <form.Field
                  name="spare"
                  children={(field) => (
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
                          className="w-full rounded-md border p-2"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        ></textarea>
                      </span>
                      <FieldInfo field={field} />
                    </label>
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
