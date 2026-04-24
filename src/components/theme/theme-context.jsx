import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

// 功能：给任意组件读取当前主题上下文。
// 参数：无。
// 返回：当前 ThemeContext 的值。
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme 必须在 ThemeProvider 内部使用。");
  }

  return context;
}
