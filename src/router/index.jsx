import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import { routes } from "./routes";

function RouteElement({ element: Element }) {
  return <Element />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="app-loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />}>
            {routes.map((route) => {
              if (route.path === "/") {
                return <Route key={route.path} index element={<RouteElement element={route.element} />} />;
              }

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
