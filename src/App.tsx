import Sidebar from "./Components/modd/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import logo from "./assets/logo_banner5.png";
import Navbar from "./Components/modd/Navbar/Navbar";
import { useTranslation } from "react-i18next";
import React, { useRef, useState, useEffect, Suspense } from "react";
import Loading from "./Components/Loading";

function App() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="mx-auto flex flex-col max-2xl:h-full lg:w-full desktop:min-h-[768px] desktop:min-w-[1366px] xl:max-h-[1080px] xl:max-w-[1920px] 2xl:h-[1080px] max-lg:portrait:max-h-[1280px] max-lg:portrait:min-h-[1024px] max-lg:portrait:min-w-[768px] max-lg:portrait:max-w-[800px] max-lg:landscape:h-[768px] max-lg:landscape:w-[1024px]">
      <Navbar>
        <Navbar.Logo src={logo} />
        <Navbar.Items>
          <Navbar.Item className="text-xl">工廠日誌</Navbar.Item>
        </Navbar.Items>
      </Navbar>
      <div className="relative flex h-full overflow-auto bg-zinc-100">
        <Sidebar />
        <div className="absolute right-8 top-4 flex w-full justify-end gap-3 text-xs">
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
        <div className="relative flex-grow border-4 pt-4">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>

      {/* <div className="absolute bottom-[50%] left-[50%] p-4 text-5xl">
        Width: {size.width}px, Height: {size.height}px
      </div> */}
    </div>
  );
}
export default App;
