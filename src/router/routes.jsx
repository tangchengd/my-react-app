import { lazy } from "react";

// 功能：懒加载首页页面组件。
// 参数：一个返回 import Promise 的函数。
// 返回：React 懒加载组件 Home。
const Home = lazy(() => import("../view/home/Home"));

// 功能：懒加载 React 基础页面组件。
// 参数：一个返回 import Promise 的函数。
// 返回：React 懒加载组件 ReactBasic。
const ReactBasic = lazy(() => import("../view/study/ReactBasic"));

// 功能：懒加载 Hooks 练习页面组件。
// 参数：一个返回 import Promise 的函数。
// 返回：React 懒加载组件 HooksPractice。
const HooksPractice = lazy(() => import("../view/study/HooksPractice"));

// 功能：懒加载组件通信页面组件。
// 参数：一个返回 import Promise 的函数。
// 返回：React 懒加载组件 ComponentCommunication。
const ComponentCommunication = lazy(() => import("../view/study/ComponentCommunication"));

// 功能：懒加载游戏页面组件。
// 参数：一个返回 import Promise 的函数。
// 返回：React 懒加载组件 Game。
const Game = lazy(() => import("../components/Game/Game"));

// 功能：懒加载 404 页面组件。
// 参数：一个返回 import Promise 的函数。
// 返回：React 懒加载组件 NotFound。
const NotFound = lazy(() => import("../view/notfound/NotFound"));

// 功能：定义导航栏所需的一级菜单与下拉菜单结构。
// 参数：无。
// 返回：导航配置数组，每一项都描述一个一级菜单或带 children 的菜单组。
export const navRoutes = [
  {
    // 功能：当前菜单对应的一级路径。
    // 参数：字符串路径，例如 /、/study、/game。
    // 返回：无，供导航跳转和菜单激活判断使用。
    path: "/",

    // 功能：当前路径真正对应的页面组件。
    // 参数：React 组件引用。
    // 返回：无，供 Route 渲染时使用。
    element: Home,

    // 功能：导航中显示的菜单文字。
    // 参数：字符串。
    // 返回：无，供 UI 展示使用。
    label: "首页",

    // 功能：当前菜单的图标标识字段，便于后续扩展图标系统。
    // 参数：字符串。
    // 返回：无，当前只作为描述字段保留。
    icon: "home",

    // 功能：控制当前项是否显示在顶部导航栏中。
    // 参数：布尔值。
    // 返回：无，true 表示显示，false 表示不显示。
    showInTab: true,
  },
  {
    path: "/study",
    label: "学习",
    icon: "study",
    showInTab: true,
    children: [
      {
        // 功能：学习子页面的访问路径。
        // 参数：字符串路径。
        // 返回：无，供页面匹配和导航跳转使用。
        path: "/study/react-basic",

        // 功能：学习子页面对应的组件引用。
        // 参数：React 组件引用。
        // 返回：无，供 Route 渲染时使用。
        element: ReactBasic,

        // 功能：下拉菜单中显示的标题。
        // 参数：字符串。
        // 返回：无，供 UI 展示使用。
        label: "React 基础",

        // 功能：下拉菜单中显示的补充说明。
        // 参数：字符串。
        // 返回：无，供 UI 展示使用。
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

// 功能：把导航结构中的“最终页面路由”提取成扁平数组，便于直接生成 Route。
// 参数：navRoutes 中的每一项 route。
// 返回：仅包含真正页面项的扁平数组，例如 /、/study/hooks、/game/tic-tac-toe。
const leafRoutes = navRoutes.flatMap((route) => {
  if (route.children?.length) {
    return route.children;
  }

  return route.element ? [route] : [];
});

// 功能：生成真正用于路由匹配与页面渲染的最终路由表。
// 参数：无。
// 返回：页面路由数组，包含所有可访问页面和 404 路由。
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

// 功能：筛选出需要显示在顶部导航栏中的一级菜单。
// 参数：无。
// 返回：仅包含 showInTab 为 true 的导航项数组。
export const tabRoutes = navRoutes.filter((route) => route.showInTab);
