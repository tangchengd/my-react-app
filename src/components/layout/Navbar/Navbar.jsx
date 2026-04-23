import { useEffect, useRef, useState } from "react";
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
// - hidden: 控制导航栏是否处于隐藏状态。
// 返回：顶部导航栏 JSX。
export default function Navbar({ pathname, hidden = false }) {
  // 功能：记录当前展开的下拉菜单路径。
  // 参数：初始值为 null，表示默认没有展开的菜单。
  // 返回：一个状态值和对应的更新函数。
  const [openMenu, setOpenMenu] = useState(null);

  // 功能：保存延迟关闭下拉菜单的定时器，避免鼠标从一级菜单移动到子菜单时立即关闭。
  // 参数：初始值为 null。
  // 返回：一个可变引用对象，current 中存放定时器 ID。
  const closeTimerRef = useRef(null);

  // 功能：当路由切换后自动收起所有下拉菜单。
  // 参数：依赖 pathname，当路径变化时触发。
  // 返回：无返回值，副作用是把 openMenu 重置为 null。
  useEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setOpenMenu(null);
  }, [pathname]);

  // 功能：组件卸载时清理关闭菜单的定时器，避免遗留异步副作用。
  // 参数：无。
  // 返回：清理函数。
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // 功能：展开当前一级菜单对应的下拉层。
  // 参数：menuPath，表示要展开的一级菜单路径。
  // 返回：无返回值，副作用是更新 openMenu。
  function handleOpenMenu(menuPath) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setOpenMenu(menuPath);
  }

  // 功能：延迟关闭当前打开的下拉层，给鼠标进入子菜单留出时间。
  // 参数：无。
  // 返回：无返回值，副作用是启动定时关闭逻辑。
  function handleScheduleCloseMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
      closeTimerRef.current = null;
    }, 128);
  }

  // 功能：点击子菜单后主动收起下拉菜单。
  // 参数：无。
  // 返回：无返回值，副作用是关闭下拉层。
  function handleChildLinkClick() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setOpenMenu(null);
  }

  return (
    <header className={`navbar-shell${hidden ? " navbar-shell-hidden" : ""}`}>
      {/* 左侧品牌区：显示项目名称和装饰标记。 */}
      <div className="navbar-brand">
        <span className="navbar-brand-mark" />
        <NavLink className="navbar-brand-link" to="/">
          My-react-app
        </NavLink>
      </div>

      {/* 中间菜单区：根据 navRoutes 动态生成普通菜单和下拉菜单。 */}
      <nav className="navbar-menu" aria-label="主导航">
        {navRoutes.map((route) => {
          // 功能：判断当前一级菜单是否应该高亮。
          // 参数：当前路径 pathname 和当前一级菜单路径 route.path。
          // 返回：布尔值，决定一级菜单样式。
          const active = isRouteActive(pathname, route.path);

          if (!route.children?.length) {
            return (
              // 没有 children 的一级菜单，直接渲染成普通 NavLink。
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

          const isOpen = openMenu === route.path;

          return (
            <div
              key={route.path}
              className={`navbar-dropdown${isOpen ? " navbar-dropdown-open" : ""}`}
              onMouseEnter={() => handleOpenMenu(route.path)}
              onMouseLeave={handleScheduleCloseMenu}
            >
              {/* 有 children 的一级菜单，渲染成受控下拉触发按钮。 */}
              <button
                type="button"
                className={`navbar-link navbar-dropdown-trigger${active ? " navbar-link-active" : ""}`}
                aria-expanded={isOpen}
                onClick={() => handleOpenMenu(route.path)}
              >
                {route.label}
              </button>

              {/* 下拉菜单面板：渲染当前一级菜单下的所有子路由。 */}
              <div className="navbar-dropdown-menu">
                {route.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    onClick={handleChildLinkClick}
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

      {/* 右侧辅助信息区：当前主要承担视觉平衡和轻量信息展示。 */}
      <div className="navbar-meta" aria-label="辅助信息">
        <span>React</span>
        <span>Study</span>
        <span>Playground</span>
      </div>
    </header>
  );
}
