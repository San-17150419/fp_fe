import React from "react";
import { useAuthContext } from "../stores/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function LoginPage() {
  const { setUsername, login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    setUsername(username as string);
    const previousPath = location.state?.previousPath || "/";
    login(username as string, "token", "username");
    navigate(previousPath, { replace: true });
  };
  return (
    <div className="flex h-full w-full p-4">
      <form
        action=""
        className="mx-auto mt-24 flex h-fit min-h-[200px] w-[500px] flex-col rounded-md border-2 border-slate-300 bg-white px-12 py-4"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-8 text-center text-2xl font-bold">{t("Login")}</h1>
        <section className="mb-4 grid w-full grid-cols-4 grid-rows-2 items-center gap-4">
          <label htmlFor="username" className="col-span-1">
            {t("Username")}
          </label>
          <input
            className="col-span-3 my-auto block w-full rounded-md border border-black px-2 py-1"
            id="username"
            type="text"
            autoSave="off"
            required
            minLength={5}
            maxLength={20}
            onInvalid={(e) => {
              e.preventDefault();
              (e.target as HTMLInputElement).setCustomValidity(
                "請輸入5-20個字元",
              );
            }}
            onChange={(e) => {
              (e.target as HTMLInputElement).setCustomValidity("");
            }}
          />
          <label className="col-span-1" htmlFor="password">
            {t("Password")}
          </label>
          <input
            className="col-span-3 w-full place-self-center rounded-md border border-black px-2 py-1"
            type="password"
            id="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$"
            required
            // need to reset the setCustomValidity to empty when the input value is changed. Otherwise, the validation message will never go away.
            onInvalid={(e) => {
              (e.target as HTMLInputElement).setCustomValidity(
                "請輸入有效的密碼: 最少8個字符，至少1個大寫字母，1個小寫字母，1個數字和1個特殊字符",
              );
            }}
            onChange={(e) => {
              (e.target as HTMLInputElement).setCustomValidity("");
            }}
          />
        </section>

        <button
          type="submit"
          className="ml-auto rounded border border-black bg-gray-400 px-2 py-1 hover:bg-gray-300"
        >
          {t("Login")}
        </button>
      </form>
    </div>
  );
}
