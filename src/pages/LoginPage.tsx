import React from "react";
import { useAuthContext } from "../Components/modd/Table/FactoryLog/AuthContext";
import Input from "../Components/modd/Input/Input";
import { useNavigate, useLocation } from "react-router-dom";
export default function LoginPage() {
  const { setToken, setUsername, login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    setUsername(username as string);
    const previousPath = location.state?.previousPath || "/";
    login(username as string, "token", "username");
    navigate(previousPath, { replace: true });
  };
  return (
    <div className="h-full w-full p-4">
      <form
        action=""
        className="mx-auto flex w-[400px] flex-col content-center items-center justify-center gap-4 px-2 py-4 outline"
        onSubmit={handleSubmit}
      >
        <section className="flex w-full justify-around">
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            autoComplete="off"
            className="border border-black"
            id="username"
            name="username"
          />
        </section>
        <section className="flex w-full justify-around">
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            className="border border-black"
            id="password"
            name="password"
          />
          {/* <input
            type="password"
            className="border border-black"
            id="password"
          /> */}
        </section>

        <button
          type="submit"
          className="ml-auto rounded border border-black bg-gray-400 px-2 py-1 hover:bg-gray-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}
