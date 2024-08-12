import { VscLoading } from "react-icons/vsc";
import { useTranslation } from "react-i18next";

type LoadingProps = {
  children?: React.ReactNode;
};
export default function Loading({ children }: LoadingProps) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex backdrop-blur-sm h-full flex-col items-center justify-center gap-5 bg-gray-200/50 text-3xl">
      <p className="loading">{t("Loading")}...</p>

      <VscLoading className="animate-spin text-5xl" />
      {children}
    </div>
  );
}
