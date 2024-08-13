import { createContext, useContext, useState } from "react";

type ThemeContextType = {
  isTextBase: boolean;
  isSemiBold: boolean;
  setIsTextBase: (value: boolean) => void;
  setIsSemiBold: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTextBase, setIsTextBase] = useState<boolean>(true);
  const [isSemiBold, setIsSemiBold] = useState<boolean>(true);
  return (
    <ThemeContext.Provider
      value={{
        isTextBase,
        isSemiBold,
        setIsTextBase,
        setIsSemiBold,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
