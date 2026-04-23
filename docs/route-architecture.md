# 项目路由渲染架构说明

## 目录

1. [目标](#目标)
2. [整体渲染流程](#整体渲染流程)
3. [核心文件职责](#核心文件职责)
4. [`main.jsx` 入口说明](#mainjsx-入口说明)
5. [`router/index.jsx` 路由渲染说明](#routerindexjsx-路由渲染说明)
6. [`router/routes.jsx` 路由配置说明](#routerroutesjsx-路由配置说明)
7. [`App.jsx` 布局路由说明](#appjsx-布局路由说明)
8. [`Navbar.jsx` 导航生成说明](#navbarjsx-导航生成说明)
9. [关键方法说明表](#关键方法说明表)
10. [关键字段说明表](#关键字段说明表)
11. [当前实际路由表](#当前实际路由表)
12. [新增页面时怎么扩展](#新增页面时怎么扩展)

## 目标

本项目的路由架构目标是：

1. 路由配置集中管理
2. 顶部导航和实际路由复用同一份配置数据
3. 页面支持懒加载
4. 所有页面共用同一个布局壳层
5. 后续新增页面时改动尽量少

## 整体渲染流程

```text
main.jsx
  -> 渲染 AppRouter
    -> AppRouter 创建 BrowserRouter
      -> Routes 根据当前 URL 匹配 Route
        -> 先渲染根布局 App
          -> App 渲染 Navbar + Outlet
            -> Outlet 显示当前页面组件
```

也可以理解成：

```text
地址栏变化
  -> BrowserRouter 感知变化
  -> Routes 重新匹配
  -> App 保持不变
  -> Outlet 切换当前页面内容
```

## 核心文件职责

| 文件 | 作用 |
| --- | --- |
| `src/main.jsx` | 应用入口，挂载 React 应用 |
| `src/router/index.jsx` | 把路由配置渲染成真正的 `<Route />` |
| `src/router/routes.jsx` | 定义导航结构和最终页面路由表 |
| `src/App.jsx` | 全局布局壳层，负责导航和页面内容出口 |
| `src/components/layout/Navbar/Navbar.jsx` | 根据路由配置动态生成顶部导航 |

## `main.jsx` 入口说明

代码：

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
```

### 说明

1. `createRoot()` 创建 React 根节点
2. `root.render()` 把整个应用渲染到页面
3. 真正被挂载的不是 `App`，而是 `AppRouter`
4. 说明整个项目的页面切换入口是在 `router` 目录

## `router/index.jsx` 路由渲染说明

代码结构：

```jsx
<BrowserRouter>
  <Suspense fallback={...}>
    <Routes>
      <Route path="/" element={<App />}>
        ...子路由
      </Route>
    </Routes>
  </Suspense>
</BrowserRouter>
```

### 渲染顺序

1. `BrowserRouter` 提供浏览器路由环境
2. `Suspense` 处理懒加载页面的等待状态
3. `Routes` 根据地址匹配页面
4. 先渲染 `App`
5. 再通过 `Outlet` 渲染当前页面

### 为什么根路由是 `App`

因为项目所有页面都共用：

1. 固定导航栏
2. 页面主内容区域
3. 同一套整体布局样式

所以要先渲染一个公共外壳，再把具体页面塞进外壳中。

## `router/routes.jsx` 路由配置说明

这个文件里有两套核心数据：

1. `navRoutes`
2. `routes`

### `navRoutes`

作用：

1. 描述顶部导航长什么样
2. 描述哪些菜单有下拉项
3. 给导航栏组件使用

示例：

```jsx
{
  path: "/study",
  label: "学习",
  icon: "study",
  showInTab: true,
  children: [
    {
      path: "/study/hooks",
      element: HooksPractice,
      label: "Hooks 练习",
      description: "常用 Hook 与交互练习",
    },
  ],
}
```

### `leafRoutes`

作用：

把 `navRoutes` 中真正能访问的页面提取成扁平数组。

例如：

```text
首页
学习
  React 基础
  Hooks 练习
游戏
  井字棋
```

会被处理成：

```text
/
/study/react-basic
/study/hooks
/study/components
/game/tic-tac-toe
```

### `routes`

作用：

最终给 `<Routes>` 使用的路由表。

包含：

1. 所有实际页面
2. 404 页面

## `App.jsx` 布局路由说明

代码结构：

```jsx
<div className="app-shell">
  <Navbar pathname={location.pathname} />
  <main className="app-main">
    <Outlet />
  </main>
</div>
```

### 作用

1. 让所有页面共享同一个导航栏
2. 让所有页面共享同一个内容区域
3. 真正变化的只有 `Outlet` 中的页面内容

### `Outlet` 的意义

`Outlet` 是子路由渲染出口。

例如：

1. 访问 `/`，`Outlet` 渲染 `Home`
2. 访问 `/study/hooks`，`Outlet` 渲染 `HooksPractice`
3. 访问 `/game/tic-tac-toe`，`Outlet` 渲染 `Game`

## `Navbar.jsx` 导航生成说明

导航不是手写出来的，而是通过 `navRoutes.map()` 动态生成的。

逻辑分两种：

### 普通菜单

如果没有 `children`：

```jsx
<NavLink to={route.path}>{route.label}</NavLink>
```

例如首页。

### 下拉菜单

如果有 `children`：

1. 一级菜单显示按钮
2. 二级菜单遍历 `children`
3. 每个子项用 `NavLink` 渲染

例如“学习”和“游戏”。

## 关键方法说明表

| 方法/函数 | 所在文件 | 功能 | 参数 | 返回 |
| --- | --- | --- | --- | --- |
| `createRoot(container)` | `main.jsx` | 创建 React 根节点 | `container: HTMLElement` | React Root 实例 |
| `root.render(element)` | `main.jsx` | 把应用渲染到页面 | `element: ReactNode` | 无 |
| `RouteElement({ element })` | `router/index.jsx` | 把组件引用渲染为真正 JSX | `element: ReactComponent` | `<Element />` |
| `AppRouter()` | `router/index.jsx` | 创建完整路由树 | 无 | 路由组件树 |
| `lazy(loader)` | `router/routes.jsx` | 懒加载页面组件 | `loader: () => Promise` | 懒加载组件 |
| `flatMap(callback)` | `router/routes.jsx` | 提取并拍平最终页面路由 | `callback: (route) => array` | 扁平数组 |
| `filter(callback)` | `router/routes.jsx` | 筛选导航项 | `callback: (route) => boolean` | 新数组 |
| `useLocation()` | `App.jsx` | 获取当前路由信息 | 无 | location 对象 |
| `isRouteActive(pathname, routePath)` | `Navbar.jsx` | 判断一级菜单是否高亮 | `pathname: string, routePath: string` | `boolean` |
| `NavLink` 的 `className` 回调 | `Navbar.jsx` | 判断链接是否激活并切换类名 | `{ isActive }` | 类名字符串 |

## 关键字段说明表

| 字段 | 所在对象 | 功能 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| `path` | 路由配置对象 | 页面路径 | `string` | 例如 `/study/hooks` |
| `element` | 路由配置对象 | 页面组件引用 | `ReactComponent` | 最终会被渲染成 JSX |
| `label` | 路由配置对象 | 导航显示文字 | `string` | 例如“首页” |
| `icon` | 路由配置对象 | 图标标识字段 | `string` | 当前主要做预留 |
| `showInTab` | 路由配置对象 | 是否显示在导航栏 | `boolean` | `true` 表示显示 |
| `children` | 一级导航对象 | 下拉菜单子项 | `Array` | 学习、游戏使用它 |
| `description` | 子路由对象 | 子菜单补充描述 | `string` | 用于下拉菜单说明文案 |
| `pathname` | location 对象 | 当前访问路径 | `string` | 例如 `/game/tic-tac-toe` |
| `isActive` | NavLink 回调参数 | 当前链接是否激活 | `boolean` | 控制高亮样式 |

## 当前实际路由表

### 一级导航

| 菜单 | 路径 | 类型 |
| --- | --- | --- |
| 首页 | `/` | 普通页面 |
| 学习 | `/study` | 下拉分组 |
| 游戏 | `/game` | 下拉分组 |

### 学习页面

| 页面 | 路径 |
| --- | --- |
| React 基础 | `/study/react-basic` |
| Hooks 练习 | `/study/hooks` |
| 组件通信 | `/study/components` |

### 游戏页面

| 页面 | 路径 |
| --- | --- |
| 井字棋 | `/game/tic-tac-toe` |

### 兜底页面

| 页面 | 路径 |
| --- | --- |
| 404 | `*` |

## 新增页面时怎么扩展

假设以后要新增一个学习页面“计数器练习”。

### 步骤 1

创建页面文件：

```text
src/view/study/CounterPractice.jsx
```

### 步骤 2

在 `routes.jsx` 中懒加载：

```jsx
const CounterPractice = lazy(() => import("../view/study/CounterPractice"));
```

### 步骤 3

添加到 `学习` 的 `children`：

```jsx
{
  path: "/study/counter",
  element: CounterPractice,
  label: "计数器练习",
  description: "useState 与事件处理",
}
```

### 完成后自动获得

1. 路由访问能力
2. 顶部下拉菜单入口
3. 懒加载页面拆包能力
