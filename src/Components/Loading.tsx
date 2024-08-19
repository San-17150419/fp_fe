import { useTranslation } from "react-i18next";
import Loader from "./Loader";
type LoadingProps = {
  children?: React.ReactNode;
  text?: string;
};
export default function Loading({ children, text }: LoadingProps) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex h-full flex-col items-center justify-center gap-5 bg-gray-200/50 text-5xl backdrop-blur-sm">
      {text && <p className="loading font-bold">{t(text)}</p>}
      {children}
      <Loader />
    </div>
  );
}
