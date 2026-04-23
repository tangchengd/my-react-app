import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar/Navbar";
import "./App.css";

// 功能：渲染全站共用布局，包含固定导航栏和页面内容出口。
// 参数：无。
// 返回：应用布局 JSX，当前页面内容会渲染到 Outlet 中。
export default function App() {
  // 功能：读取当前路由信息。
  // 参数：无。
  // 返回：location 对象，这里主要使用 pathname 字段判断导航高亮。
  const location = useLocation();
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  // 功能：根据页面滚动方向控制导航栏隐藏或展示。
  // 参数：依赖当前路径，每次切页时都会重新初始化滚动监听。
  // 返回：无返回值，副作用是更新导航栏显示状态。
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    setIsNavbarHidden(false);

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY < 40) {
        setIsNavbarHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 8) {
        setIsNavbarHidden(true);
      } else if (delta < -8) {
        setIsNavbarHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar pathname={location.pathname} hidden={isNavbarHidden} />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
