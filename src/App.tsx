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
        <Navbar.Items>
          <Navbar.Item className="text-xl">工廠日誌</Navbar.Item>
        </Navbar.Items>
      </Navbar>
      <div className="flex h-full overflow-auto bg-zinc-100">
        <Sidebar />
        {/* TODO: Extract buttons to a component */}
        <div className="relative w-full overflow-hidden border ">
          <ButtonsGroup />
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
}
export default App;
