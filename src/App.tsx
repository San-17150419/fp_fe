import Sidebar from "./Components/modd/Sidebar/Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Components/modd/Navbar/Navbar";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import Loading from "./Components/Loading";
import { useAuthContext } from "./stores/AuthContext";

function App() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const location = useLocation();
  const { token, username,  logout } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex flex-col max-2xl:h-full lg:w-full desktop:min-h-[768px] desktop:min-w-[1366px] xl:max-h-[1080px] xl:max-w-[1920px] 2xl:h-[1080px] max-lg:portrait:max-h-[1280px] max-lg:portrait:min-h-[1024px] max-lg:portrait:min-w-[768px] max-lg:portrait:max-w-[800px] max-lg:landscape:h-[768px] max-lg:landscape:w-[1024px]">
      <Navbar>
        <Navbar.Logo src="/logo_banner5.png" />
        <Navbar.Items>
          <Navbar.Item className="text-xl">工廠日誌</Navbar.Item>
        </Navbar.Items>
      </Navbar>
      <div className="flex h-full overflow-auto bg-zinc-100">
        <Sidebar />
        {/* TODO: Extract buttons to a component */}
        <div className="relative w-full overflow-hidden border">
          <div className="absolute left-10 top-4 flex w-full gap-4 text-base">
            <h2 className="my-auto text-xl underline">{username}</h2>
            {location.pathname !== "/login" && (
              <button
                type="button"
                className="rounded bg-stone-200 p-2 shadow-sm shadow-gray-400"
                // className="z-5 rounded bg-stone-200 p-2 shadow-sm shadow-gray-400"
                onClick={() => (token === null ? navigate("/login") : logout())}
              >
                {token === null ? "登入" : "登出"}
              </button>
            )}
          </div>
          <div className="absolute right-10 top-4 flex gap-4 text-base">
            <button
              type="button"
              aria-description="change language to traditional chinese"
              className="z-50 rounded bg-stone-200 p-2 shadow-sm shadow-gray-400"
              onClick={() => changeLanguage("zh-TW")}
            >
              {t("繁體")}
            </button>
            <button
              type="button"
              aria-description="change language to english"
              className="z-50 rounded bg-stone-200 p-2 shadow-sm shadow-gray-400"
              onClick={() => changeLanguage("en")}
            >
              {t("英文")}
            </button>
            <button
              type="button"
              aria-description="change language to simplified chinese"
              className="z-50 rounded bg-stone-200 p-2 shadow-sm shadow-gray-400"
              onClick={() => changeLanguage("zh-CN")}
            >
              {t("簡體")}
            </button>
          </div>
          {/* <main className="bg-black"> */}
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
          {/* </main> */}
        </div>
      </div>
    </div>
  );
}
export default App;
