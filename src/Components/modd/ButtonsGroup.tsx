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
    <div className="flex pt-6 px-24">
      <div className="flex w-full gap-4 text-sm lg:text-base">
        <h2 className="my-auto text-xl underline">{username}</h2>
        {location.pathname !== "/login" && (
          <BaseButton
            type="button"
            className=""
            // className="z-5 rounded bg-stone-200 p-2 shadow-sm shadow-gray-400"
            onClick={() => (token === null ? navigate("/login") : logout())}
          >
            {token === null ? t("登入") : t("登出")}
          </BaseButton>
        )}
      </div>

      <LanguageBtn />
    </div>
  );
}
