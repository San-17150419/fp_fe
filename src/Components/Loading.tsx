import { VscLoading } from "react-icons/vsc";
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex h-full flex-col items-center justify-center gap-5 text-3xl">
      <p className="loading">Loading ...</p>

      <VscLoading className="animate-spin text-5xl" />
    </div>
  );
}
