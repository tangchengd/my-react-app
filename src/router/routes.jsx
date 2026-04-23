import { lazy } from "react";

const Home = lazy(() => import("../view/home/Home"));
const ReactBasic = lazy(() => import("../view/study/ReactBasic"));
const HooksPractice = lazy(() => import("../view/study/HooksPractice"));
const ComponentCommunication = lazy(() => import("../view/study/ComponentCommunication"));
const Game = lazy(() => import("../components/Game/Game"));
const NotFound = lazy(() => import("../view/notfound/NotFound"));

export const navRoutes = [
  {
    path: "/",
    element: Home,
    label: "首页",
    icon: "home",
    showInTab: true,
  },
  {
    path: "/study",
    label: "学习",
    icon: "study",
    showInTab: true,
    children: [
      {
        path: "/study/react-basic",
        element: ReactBasic,
        label: "React 基础",
        description: "组件、JSX、状态与渲染",
      },
      {
        path: "/study/hooks",
        element: HooksPractice,
        label: "Hooks 练习",
        description: "常用 Hook 与交互练习",
      },
      {
        path: "/study/components",
        element: ComponentCommunication,
        label: "组件通信",
        description: "props、状态提升与 context",
      },
    ],
  },
  {
    path: "/game",
    label: "游戏",
    icon: "game",
    showInTab: true,
    children: [
      {
        path: "/game/tic-tac-toe",
        element: Game,
        label: "井字棋",
        description: "当前已完成的棋盘练习",
      },
    ],
  },
];

const leafRoutes = navRoutes.flatMap((route) => {
  if (route.children?.length) {
    return route.children;
  }

  return route.element ? [route] : [];
});

export const routes = [
  ...leafRoutes,
  {
    path: "*",
    element: NotFound,
    label: "404",
    icon: "404",
    showInTab: false,
  },
];

export const tabRoutes = navRoutes.filter((route) => route.showInTab);
