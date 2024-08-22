import { useAuthContext } from "../../stores/AuthContext";
import { useNavigate } from "react-router-dom";
import BaseButton from "./Button/BaseButton";
import { useTranslation } from "react-i18next";
import LanguageBtn from "./LanguageBtn";
export default function ButtonsGroup() {
  const { token, username, logout } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex w-full gap-4 text-sm lg:text-base">
        <h2 className="my-auto text-xl text-white underline">{username}</h2>
        {location.pathname !== "/login" && (
          <BaseButton
            type="button"
            className="h-12 w-12 border border-transparent bg-transparent duration-200 hover:border hover:border-gray-300 hover:bg-transparent/40"
            onClick={() => (token === null ? navigate("/login") : logout())}
          >
            {token === null ? t("登入") : t("登出")}
          </BaseButton>
        )}
      </div>

      <LanguageBtn />
    </>
  );
}
