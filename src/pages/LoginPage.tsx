import { useAuthContext } from "../stores/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import FormInputFiled from "../features/EngineerDepartment/component/TanStackForm/FormInputField";
import { LoginInfo } from "../stores/types/authTypes";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
export default function LoginPage() {
  const { login, setToken, setUsername } = useAuthContext();
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (data: LoginInfo) => {
      return login(data);
    },
    onSuccess: (data) => {
      toast.success(`Login Success ${data.dep_info}`);
      console.log(data.access_token);
      setToken(data.access_token);
      setUsername(data.dep_info);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      if (isAxiosError(error) && error.response) {
        console.error("Login failed:", error.message);
        toast.error(`Login failed ${error.message}`);
      } else {
        console.error("Login failed:", error.message);
        toast.error(`Login failed ${error.message}`);
      }
    },
  });
  const form = useForm({
    defaultValues: {
      account: "",
      password: "",
    },
    onSubmit: (values) => {
      mutate(values.value);
    },
  });
  // const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mx-auto flex flex-col gap-4 rounded-md bg-white p-4"
      >
        {/* <div> */}
        <form.Field
          name="account"
          children={(field) => <FormInputFiled field={field} />}
        />
        <form.Field
          name="password"
          children={(field) => <FormInputFiled type="password" field={field} />}
        />
        <form.Subscribe
          selector={(state) => ({
            ...state,
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={({ canSubmit, isSubmitting, isDirty }) => {
            const isBTNDisabled = !canSubmit || isSubmitting || !isDirty;
            return (
              <>
                <button
                  type="submit"
                  disabled={isBTNDisabled}
                  className={clsx(
                    "mx-2 ml-auto block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700",
                    {
                      "cursor-not-allowed opacity-50": isBTNDisabled,
                    },
                  )}
                >
                  {t("login")}
                </button>
              </>
            );
          }}
        />
      </form>
    </>
  );
}
