import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar/Navbar";
import "./App.css";

export default function App() {
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
