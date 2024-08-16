import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../stores/AuthContext";
import { useNavigate } from "react-router-dom";
import BaseButton from "./Button/BaseButton";
export default function ButtonsGroup() {
  const { token, username, logout } = useAuthContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <>
      <div className="absolute left-10 top-4 flex w-full gap-4 text-base">
        <h2 className="my-auto text-xl underline">{username}</h2>
        {location.pathname !== "/login" && (
          <BaseButton
            type="button"
            className=""
            // className="z-5 rounded bg-stone-200 p-2 shadow-sm shadow-gray-400"
            onClick={() => (token === null ? navigate("/login") : logout())}
          >
            {token === null ? "登入" : "登出"}
          </BaseButton>
        )}
      </div>
      <div className="absolute right-10 top-4 flex gap-4 text-base">
        <BaseButton
          type="button"
          aria-description="change language to traditional chinese"
          className="z-50"
          onClick={() => changeLanguage("zh-TW")}
        >
          {t("繁體")}
        </BaseButton>
        <BaseButton
          type="button"
          aria-description="change language to english"
          className="z-50"
          onClick={() => changeLanguage("en")}
        >
          {t("英文")}
        </BaseButton>
        <BaseButton
          type="button"
          aria-description="change language to simplified chinese"
          className="z-50"
          onClick={() => changeLanguage("zh-CN")}
        >
          {t("簡體")}
        </BaseButton>
      </div>
    </>
  );
}
