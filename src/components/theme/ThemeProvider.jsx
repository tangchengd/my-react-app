import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context";

const STORAGE_KEY = "theme-mode";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

// 功能：读取浏览器中保存的主题模式。
// 参数：无。
// 返回：light、dark、system 三者之一，非法值会退回到 system。
function getStoredThemeMode() {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (["light", "dark", "system"].includes(storedValue)) {
    return storedValue;
  }

  return "system";
}

// 功能：把用户选择的主题模式解析为真正生效的主题。
// 参数：themeMode，表示当前用户选择的主题模式。
// 返回：最终生效的 light 或 dark。
function resolveTheme(themeMode) {
  if (themeMode !== "system") {
    return themeMode;
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

// 功能：提供全局主题状态，并把最终主题同步到 html 节点的 data-theme 上。
// 参数：children，应用组件树。
// 返回：包裹 ThemeContext.Provider 的 JSX。
export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => getStoredThemeMode());
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(getStoredThemeMode()));

  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    function syncTheme() {
      setResolvedTheme(resolveTheme(themeMode));
    }

    syncTheme();

    if (themeMode === "system") {
      mediaQuery.addEventListener("change", syncTheme);
    }

    return () => {
      mediaQuery.removeEventListener("change", syncTheme);
    };
  }, [themeMode]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = resolvedTheme;
    root.dataset.themeMode = themeMode;
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      resolvedTheme,
      setThemeMode,
    }),
    [themeMode, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
