import { NavLink } from "react-router-dom";
import { navRoutes } from "../../../router/routes";
import "./Navbar.css";

// 功能：判断一级菜单是否应该处于激活状态。
// 参数：
// - pathname: 当前浏览器地址路径，例如 /study/hooks。
// - routePath: 一级菜单路径，例如 /study。
// 返回：
// - true：当前一级菜单应高亮。
// - false：当前一级菜单不高亮。
function isRouteActive(pathname, routePath) {
  if (routePath === "/") {
    return pathname === "/";
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

// 功能：渲染顶部固定导航栏，并根据 navRoutes 自动生成普通菜单和下拉菜单。
// 参数：
// - pathname: 当前页面路径，用于判断菜单激活状态。
// 返回：顶部导航栏 JSX。
export default function Navbar({ pathname }) {
  return (
    <header className="navbar-shell">
      <div className="navbar-brand">
        <span className="navbar-brand-mark" />
        <NavLink className="navbar-brand-link" to="/">
          My-react-app
        </NavLink>
      </div>

      <nav className="navbar-menu" aria-label="主导航">
        {navRoutes.map((route) => {
          // 功能：判断当前一级菜单是否应该高亮。
          // 参数：当前路径 pathname 和当前一级菜单路径 route.path。
          // 返回：布尔值，决定一级菜单样式。
          const active = isRouteActive(pathname, route.path);

          if (!route.children?.length) {
            return (
              <NavLink
                key={route.path}
                to={route.path}
                end={route.path === "/"}
                className={({ isActive }) =>
                  `navbar-link${isActive ? " navbar-link-active" : ""}`
                }
              >
                {route.label}
              </NavLink>
            );
          }

          return (
            <div key={route.path} className="navbar-dropdown">
              <button
                type="button"
                className={`navbar-link navbar-dropdown-trigger${active ? " navbar-link-active" : ""}`}
              >
                {route.label}
              </button>
              <div className="navbar-dropdown-menu">
                {route.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) =>
                      `navbar-dropdown-item${isActive ? " navbar-dropdown-item-active" : ""}`
                    }
                  >
                    <span>{child.label}</span>
                    <small>{child.description}</small>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="navbar-meta" aria-label="辅助信息">
        <span>React</span>
        <span>Study</span>
        <span>Playground</span>
      </div>
    </header>
  );
}
