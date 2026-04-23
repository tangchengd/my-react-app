import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import { routes } from "./routes";

// 功能：把路由配置对象中的组件引用渲染成真正的 JSX 组件。
// 参数：
// - element: React 组件引用，例如 Home、Game、NotFound。
// 返回：对应的页面组件实例，例如 <Home />。
function RouteElement({ element: Element }) {
  return <Element />;
}

// 功能：创建整个项目的浏览器路由系统，并把 routes 配置渲染为 Route 组件。
// 参数：无。
// 返回：完整的路由组件树，包含 BrowserRouter、Suspense、Routes 和 Route。
export default function AppRouter() {
  return (
    <BrowserRouter>
      {/*
        功能：在 lazy 懒加载页面还未加载完成时显示占位内容。
        参数：fallback，类型为 ReactNode，这里是 Loading... 文本。
        返回：加载中时显示 fallback，加载完成后显示真正页面。
      */}
      <Suspense fallback={<div className="app-loading">Loading...</div>}>
        <Routes>
          {/*
            功能：定义根布局路由，所有页面都会先进入 App 布局组件。
            参数：
            - path="/"：根路径。
            - element={<App />}：匹配到后先渲染 App。
            返回：一个布局型 Route，子页面会渲染到 App 内部的 Outlet 中。
          */}
          <Route path="/" element={<App />}>
            {routes.map((route) => {
              if (route.path === "/") {
                // 功能：把路径为 / 的页面注册成 index 路由，也就是首页默认内容。
                // 参数：
                // - key：当前路由的唯一路径字符串。
                // - index：布尔值，表示这是父路由下的默认子路由。
                // - element：当前首页组件。
                // 返回：首页对应的 Route 元素。
                return <Route key={route.path} index element={<RouteElement element={route.element} />} />;
              }

              // 功能：把普通页面路由或 404 路由注册成可匹配的 Route。
              // 参数：
              // - key：当前路由的唯一路径字符串。
              // - path：真实匹配路径，普通路由会去掉开头的 /，404 保留 *。
              // - element：当前页面组件。
              // 返回：普通页面或兜底页面对应的 Route 元素。
              return (
                <Route
                  key={route.path}
                  path={route.path === "*" ? "*" : route.path.slice(1)}
                  element={<RouteElement element={route.element} />}
                />
              );
            })}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
