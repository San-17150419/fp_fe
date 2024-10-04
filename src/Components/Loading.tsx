import { useTranslation } from "react-i18next";
import Loader from "./Loader";
type LoadingProps = {
  children?: React.ReactNode;
  text?: string;
  fullScreen?: boolean;
};
export default function Loading({
  children,
  text,
  fullScreen = true,
}: LoadingProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`z-50 flex h-full w-full flex-col items-center justify-center gap-5 bg-gray-200/50 text-5xl ${fullScreen ? "fixed inset-0 backdrop-blur-sm" : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
    >
      {/* <div className="fixed inset-0 z-50 flex h-full flex-col items-center justify-center gap-5 bg-gray-200/50 text-5xl backdrop-blur-sm"> */}
      {text && <p className="loading font-bold">{t(text)}</p>}
      {children}
      <Loader />
    </div>
  );
}
