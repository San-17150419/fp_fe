import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function EngineerDepartment() {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("zh-TW");
  }, []);

  return (
      <div className="-mx-10">
        <Outlet />
      </div>
  );
}
