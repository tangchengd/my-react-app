import { NavLink } from "react-router-dom";
import { navRoutes } from "../../../router/routes";
import "./Navbar.css";

function isRouteActive(pathname, routePath) {
  if (routePath === "/") {
    return pathname === "/";
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

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
