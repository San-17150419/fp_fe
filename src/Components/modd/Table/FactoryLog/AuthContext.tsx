import { createContext, useContext, useState, type ReactNode } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  username: string | null;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
  setUsername: (username: string | null) => void;
  login: (
    username: string | null,
    token: string | null,
    refreshToken: string | null,
  ) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = (
    username: string | null,
    token: string | null,
    refreshToken: string | null,
  ) => {
    setToken(token);
    setUsername(username);
    setRefreshToken(refreshToken);
    localStorage.setItem("token", token || "");
    localStorage.setItem("refreshToken", refreshToken || "");
    localStorage.setItem("username", username || "");
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
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
