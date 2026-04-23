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

  return (
    <div className="app-shell">
      <Navbar pathname={location.pathname} />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
