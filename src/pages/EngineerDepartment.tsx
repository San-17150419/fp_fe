import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import useENGDepartmentPreData from "../features/EngineerDepartment/hooks/useENGDepartmentPreData";
import Loading from "../Components/Loading";
export default function EngineerDepartment() {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("zh-TW");
  }, []);

  // call useENGDepartmentPreData at the highest level to ensure data is ready before children render.
  // should not use useENGDepartmentPreData in the children component. Everytime useENGDepartmentPreData is called, the useQuery will be called again, which will cause the component to rerender, even if the data is not changed.
  const { isPending } = useENGDepartmentPreData();
  return (
    <div className="-mx-16 -mt-4">
      {isPending && <Loading />}
      <Outlet />
      {/* {isPending ? <Loading text="Data loading" /> : <Outlet />} */}
    </div>
  );
}
