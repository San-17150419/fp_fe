import { createContext, useContext, useState, type ReactNode } from "react";
import {
  AuthContextType,
  LoginInfo,
  LoginResponseData,
} from "./types/authTypes";
import axios from "axios";
import { toast } from "react-toastify";
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  async function login(loginInfo: LoginInfo): Promise<LoginResponseData> {
    // TODO: Refine error handling to distinguish errors from first and second requests (one is account does not existm the other is refresh token missing)
    const api = import.meta.env.VITE_POWER_FACTORY_URL + "/lic/login/";
    // Step 1: Login request to obtain refresh token
    await axios.post(api, loginInfo, {
      withCredentials: true,
    });
    // Step 2: Request access token using refresh token
    const getAccessTokenAPI =
      import.meta.env.VITE_POWER_FACTORY_URL + "/lic/checkToken/";

    const response = await axios<LoginResponseData>({
      url: getAccessTokenAPI,
      method: "POST",
      withCredentials: true,
    });
    return response.data;
  }

  // TODO: I don't have a way to actaully logout yet( I think I need to be able to clear refresh token from the server). I can't just clear the token from the local storage. I need to clear it from the server as well.
  const logout = () => {
    setToken(null);
    setUsername("");
    setRefreshToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    toast.success("Logout Successful");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        username,
        setUsername,
        login,
        logout,
        refreshToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}