import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { ENGDepartmentProvider } from "../features/EngineerDepartment/store/ENGDepartmentContext";
export default function EngineerDepartment() {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("zh-TW");
  }, []);

  return (
    <ENGDepartmentProvider>
      <Outlet />
    </ENGDepartmentProvider>
  );
}
