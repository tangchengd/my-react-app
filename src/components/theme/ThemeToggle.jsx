import { useEffect, useRef, useState } from "react";
import autoIcon from "../../assets/theme/auto.svg";
import moonIcon from "../../assets/theme/moon.svg";
import sunIcon from "../../assets/theme/sun.svg";
import { useTheme } from "./theme-context";
import "./ThemeToggle.css";

const THEME_OPTIONS = [
  { value: "light", label: "浅色", hint: "明亮背景", icon: sunIcon },
  { value: "dark", label: "深色", hint: "夜间氛围", icon: moonIcon },
  { value: "system", label: "跟随系统", hint: "自动切换", icon: autoIcon },
];

// 功能：渲染主题切换器，支持浅色、深色和跟随系统三种模式。
// 参数：无。
// 返回：主题切换按钮和下拉菜单 JSX。
export default function ThemeToggle() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentOption = THEME_OPTIONS.find((option) => option.value === themeMode);
  const resolvedThemeIcon = resolvedTheme === "dark" ? moonIcon : sunIcon;
  const resolvedThemeLabel = resolvedTheme === "dark" ? "Dark" : "Light";

  return (
    <div className="theme-toggle" ref={containerRef}>
      <button
        type="button"
        className="theme-toggle-button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <span className="theme-toggle-button-icon-wrap" aria-hidden="true">
          <img
            className={`theme-toggle-button-icon${themeMode === "light" ? " theme-toggle-button-icon-original" : ""}`}
            src={currentOption?.icon || resolvedThemeIcon}
            alt=""
          />
        </span>
        <span className="theme-toggle-button-mode">{resolvedThemeLabel}</span>
        <span className="theme-toggle-button-label">{currentOption?.label || "主题"}</span>
      </button>

      {open ? (
        <div className="theme-toggle-menu" role="menu" aria-label="主题切换菜单">
          <div className="theme-toggle-menu-title">Theme</div>

          {THEME_OPTIONS.map((option) => {
            const active = themeMode === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`theme-toggle-option${active ? " theme-toggle-option-active" : ""}`}
                onClick={() => {
                  setThemeMode(option.value);
                  setOpen(false);
                }}
              >
                <span className="theme-toggle-option-main">
                  <span className="theme-toggle-option-icon-wrap" aria-hidden="true">
                    <img
                      className={`theme-toggle-option-icon${option.value === "light" ? " theme-toggle-option-icon-original" : ""}`}
                      src={option.icon}
                      alt=""
                    />
                  </span>
                  <span className="theme-toggle-option-copy">
                    <span className="theme-toggle-option-label">{option.label}</span>
                    <span className="theme-toggle-option-hint">{option.hint}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
