import Sidebar from "./Components/modd/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/modd/Navbar/Navbar";
import { Suspense } from "react";
import Loading from "./Components/Loading";
import ButtonsGroup from "./Components/modd/ButtonsGroup";
function App() {
  return (
    <>
      <Navbar>
        <Navbar.Logo src="/logo_banner5.png" />
        <Navbar.Items className="w-full">
          <div className="mr-auto">
            <Navbar.Item className="text-xl" href="/">
              工廠日誌
            </Navbar.Item>
          </div>
          <div className="ml-auto flex gap-2">
            <ButtonsGroup />
          </div>
        </Navbar.Items>
      </Navbar>
      <div className="flex h-full overflow-auto bg-zinc-100">
        <Sidebar />
        <div className="relative w-full overflow-hidden">
          <div className="flex h-full flex-col gap-4 overflow-auto px-32 pt-20 lg:px-36 desktop:px-48">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
