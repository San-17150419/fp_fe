import Sidebar from "./Components/modd/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import logo from "./assets/logo_banner5.png";
import Navbar from "./Components/modd/Navbar/Navbar";
import { useTranslation } from "react-i18next";
import React, { useRef, useState, useEffect } from "react";

function App() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  // const ref = useRef<HTMLDivElement>(null);
  // const [size, setSize] = useState({ width: 0, height: 0 });
  // const updateSize = () => {
  //   if (ref.current) {
  //     setSize({
  //       width: ref.current.offsetWidth,
  //       height: ref.current.offsetHeight,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   updateSize();
  //   window.addEventListener("resize", updateSize);
  //   return () => {
  //     window.removeEventListener("resize", updateSize);
  //   };
  // }, []);

  return (
    <div
      // ref={ref}
      className="mx-auto flex flex-col max-2xl:h-full lg:w-full desktop:min-h-[768px] desktop:min-w-[1366px] xl:max-h-[1080px] xl:max-w-[1920px] 2xl:h-[1080px] max-lg:portrait:max-h-[1280px] max-lg:portrait:min-h-[1024px] max-lg:portrait:min-w-[768px] max-lg:portrait:max-w-[800px] max-lg:landscape:h-[768px] max-lg:landscape:w-[1024px]"
    >
      <Navbar>
        <Navbar.Logo src={logo} />
        <Navbar.Items>
          <Navbar.Item className="text-xl">工廠日誌</Navbar.Item>
        </Navbar.Items>
      </Navbar>
      <div className="flex h-full overflow-auto bg-zinc-100">
        <Sidebar />
        <div className="relative flex-grow border-4 px-5 pt-5 tabletP:px-20 tabletP:pt-10 desktop:px-40 desktop:pt-20">
          <div className="absolute right-5 top-0 flex w-full justify-end gap-3 text-xs">
            <button
              type="button"
              aria-description="change language to traditional chinese"
              className="rounded border border-gray-400 p-2"
              onClick={() => changeLanguage("zh-TW")}
            >
              {t("繁體")}
            </button>
            <button
              type="button"
              aria-description="change language to english"
              className="rounded border border-gray-400 p-2"
              onClick={() => changeLanguage("en")}
            >
              {t("英文")}
            </button>
            <button
              type="button"
              aria-description="change language to simplified chinese"
              className="rounded border border-gray-400 p-2"
              onClick={() => changeLanguage("zh-CN")}
            >
              {t("簡體")}
            </button>
          </div>
          <Outlet />
        </div>
      </div>

      {/* <div className="absolute bottom-[50%] left-[50%] p-4 text-5xl">
        Width: {size.width}px, Height: {size.height}px
      </div> */}
    </div>
  );
}
export default App;
