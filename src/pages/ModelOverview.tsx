import Filter from "../features/EngineerDepartment/Filter";
import CreateMold from "../features/EngineerDepartment/CreateMold";
import WithPreData from "../features/EngineerDepartment/WithPreData";
import axios, { isAxiosError } from "axios";
import { lazy } from "react";
import { toast } from "react-toastify";
const CreateMoldTanstackForm = lazy(
  () =>
    import(
      "../features/EngineerDepartment/component/TanStackForm/CreateMoldTanstackForm"
    ),
);

const CreateMoldTanstackFormWithPreData = WithPreData(CreateMoldTanstackForm);
export default function ModelOverview() {
  // TODO: Refactor FactoryLogFilter to make it reusable. I should consider using compound component pattern. In that way, you don't need to pre-define the number of select or input. May I need a small context
  // TODO: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
  // TODO: Add toastify to login
  // Integrate this to Auth context
  // const { isLoading } = useENGDepartmentContext();
  const FilterWithPreData = WithPreData(Filter);
  const CreateMoldWithPreData = WithPreData(CreateMold);
  const onClick = () => {
    const api = "https://192.168.123.240:9000/api/lic/login/";
    const params = {
      account: "TPEGMO_SAN",
      password: "123",
    };
    const fetchLogin = async () => {
      try {
        const response = await axios.post(api, params);
        const refreshToken = response.data.refresh_token;

        toast.success("Login Success");
        window.localStorage.setItem("refreshToken", refreshToken);
        // const getRefreshToken = window.localStorage.getItem("refreshToken");
      } catch (e) {
        console.error(e);
        toast.error("Login failed");
      }
    };
    fetchLogin();
  };

  const checkLoginStatus = async () => {
    const api = "https://192.168.123.240:9000/api/lic/checkToken/";
    axios.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    try {
      const response = await axios(api, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        fetchOptions: {
          credentials: "include",
          // mode: "cors",
        },
      });
      // toast.success(`${"Login Success"} `);
      toast.success(`${"Login Success"} ${response.data.dep_info}`);

      console.log(response);
    } catch (e) {
      console.error(e);
      if (isAxiosError(e)) {
        toast.error(`${"Login failed"} ${e.response?.data.message}`);
      }
    }
  };

  const checkLoginStatusWithFetch = async () => {
    const api = "https://192.168.123.240:9000/api/lic/checkToken/";

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      toast.success(`${"Login Success"} ${data.dep_info}`);
      console.log(data);
    } catch (e) {
      toast.error(`${"Login failed"} ${e}`);
      console.error(e);
    }
  };

  return (
    <>
      <div className="">
        {/* <div className="flex gap-4 mb-4 hidden"> */}
        <button className="rounded-md bg-blue-400 p-2" onClick={onClick}>
          登入
        </button>
        <button
          className="rounded-md bg-blue-400 p-2"
          onClick={checkLoginStatusWithFetch}
        >
          {/* <button className="" onClick={checkLoginStatus}> */}
          refresh_token with fetch
        </button>
        <button
          className="rounded-md bg-blue-400 p-2"
          onClick={checkLoginStatus}
        >
          refresh_token with axios
        </button>
      </div>
      <CreateMoldTanstackFormWithPreData />
      <CreateMoldWithPreData />
      <FilterWithPreData />
    </>
  );
}
