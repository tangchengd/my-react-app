import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router";
import "./index.css";

// 功能：创建 React 应用根节点，作为整个组件树的挂载入口。
// 参数：document.getElementById("root")，类型为 HTMLElement，表示页面中的根 DOM 节点。
// 返回：React Root 实例，后续通过它调用 render() 渲染应用。
const root = createRoot(document.getElementById("root"));

// 功能：把整个 React 应用渲染到根节点中。
// 参数：一个 React 组件树，这里是 StrictMode 包裹的 AppRouter。
// 返回：无返回值，执行后页面开始显示应用内容。
root.render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
