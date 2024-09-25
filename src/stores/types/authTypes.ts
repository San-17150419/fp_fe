export type LoginInfo = {
  account: string;
  password: string;
};
export type LoginResponseData = {
  access_token: string;
  token_type: string;
  department: string;
  dep_info: string;
  tier: number;
};

export type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  username: string | null;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
  setUsername: (username: string) => void;
  login: (loginInfo: LoginInfo) => Promise<LoginResponseData>;
  logout: () => void;
};
