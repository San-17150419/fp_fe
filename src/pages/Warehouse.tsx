import { NavLink, Outlet } from "react-router-dom";
export default function Warehouse() {
  // const
  const links = [
    { label: "退貨驗收單", path: "/Warehouse/product-return-form" },
    { label: "交貨驗收單", path: "/Warehouse/product-recieve-form" },
    { label: "檢索驗收單", path: "/Warehouse/deliver-history-query" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "rounded-md bg-blue-500 px-4 py-2 text-white"
                : "rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="-mx-24 mb-5 flex justify-center gap-2">
        <Outlet />
      </div>
    </div>
  );
}
