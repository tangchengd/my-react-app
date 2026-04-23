# 路由渲染超白话版

## 目录

1. [一句话理解](#一句话理解)
2. [先记住 4 个角色](#先记住-4-个角色)
3. [`BrowserRouter` 到底干嘛](#browserrouter-到底干嘛)
4. [`Routes` 和 `Route` 到底干嘛](#routes-和-route-到底干嘛)
5. [`App` 为什么不是具体页面](#app-为什么不是具体页面)
6. [`Outlet` 到底干嘛](#outlet-到底干嘛)
7. [`NavLink` 到底干嘛](#navlink-到底干嘛)
8. [点菜单时到底发生了什么](#点菜单时到底发生了什么)
9. [为什么导航会自动生成](#为什么导航会自动生成)
10. [为什么学习和游戏会高亮](#为什么学习和游戏会高亮)
11. [你以后新增页面时到底要改哪里](#你以后新增页面时到底要改哪里)

## 一句话理解

这个项目的路由逻辑就是：

**浏览器地址变了，`BrowserRouter` 知道了，`Routes` 重新匹配，先显示公共外壳 `App`，再把真正页面塞进 `Outlet`，而导航栏 `Navbar` 则根据路由配置自动生成菜单。**

## 先记住 4 个角色

你可以把它们想成一套商场结构：

### 1. `BrowserRouter`

像商场总前台。

作用：
负责盯着地址栏变化，告诉整个项目“现在到哪个页面了”。

### 2. `Routes`

像导览系统。

作用：
根据当前地址，判断应该显示哪个页面。

### 3. `App`

像商场公共装修。

作用：
所有页面共用的外壳，不管去哪一层，导航栏和大布局都还是那套。

### 4. `Outlet`

像店铺展示位。

作用：
具体是哪一家店，要渲染到这里。

## `BrowserRouter` 到底干嘛

它最核心的工作就一句话：

**监听地址栏路径，并把这个路径告诉 React Router。**

例如你地址栏是：

```text
/
```

它就知道你在首页。

如果地址栏变成：

```text
/study/hooks
```

它就知道你进了学习模块下的 Hooks 页面。

### 功能

给整个应用提供路由上下文。

### 参数

无业务参数，主要是把其他路由组件包起来。

### 返回

一个可用的路由环境。

## `Routes` 和 `Route` 到底干嘛

### `Routes`

你可以理解成“匹配中心”。

它负责：

1. 看当前地址是多少
2. 找到最合适的 `Route`
3. 渲染对应页面

### `Route`

你可以理解成“某条具体规则”。

例如：

```jsx
<Route path="/" element={<App />}>
```

意思就是：

“如果地址匹配 `/` 这一套规则，就先显示 `App`。”

## `App` 为什么不是具体页面

因为 `App` 不是首页本身，它是“公共外壳”。

它里面放的是：

1. 顶部固定导航栏
2. 页面主区域
3. `Outlet`

也就是说：

你去首页时，先渲染 `App`
你去游戏页时，也先渲染 `App`

变化的不是 `App`，变化的是 `Outlet` 里面装什么页面。

## `Outlet` 到底干嘛

这个最重要。

你可以把 `Outlet` 理解成：

**“真正页面内容插进去的位置。”**

比如：

```jsx
<main className="app-main">
  <Outlet />
</main>
```

意思就是：

1. 外面这一层 `main` 永远都在
2. 里面装什么页面，由当前路由决定

### 例子 1

访问：

```text
/
```

那 `Outlet` 里放的是：

```jsx
<Home />
```

### 例子 2

访问：

```text
/game/tic-tac-toe
```

那 `Outlet` 里放的是：

```jsx
<Game />
```

所以你可以直接记：

**`Outlet = 当前页面内容显示口`**

### 功能

显示当前匹配到的子页面。

### 参数

无。

### 返回

当前子路由对应的页面组件。

## `NavLink` 到底干嘛

`NavLink` 本质上是“会跳转的链接”，但比普通 `<a>` 更强。

它多了一个核心能力：

**它知道自己现在是不是当前页面。**

例如：

```jsx
<NavLink
  to="/"
  className={({ isActive }) =>
    `navbar-link${isActive ? " navbar-link-active" : ""}`
  }
>
  首页
</NavLink>
```

意思是：

1. 点击它会跳到 `/`
2. 如果当前确实在 `/`
3. 那么 `isActive === true`
4. 就会加上高亮类名

### 功能

创建带激活态判断的路由链接。

### 参数

1. `to`
   跳转地址
2. `className`
   可以传函数，根据 `isActive` 返回不同样式类名
3. `end`
   是否必须精确匹配

### 返回

一个可跳转、可高亮的链接组件。

## 点菜单时到底发生了什么

以点击“游戏 -> 井字棋”为例：

### 第一步

你点击 `NavLink`：

```text
/game/tic-tac-toe
```

### 第二步

`BrowserRouter` 发现地址变了。

### 第三步

`Routes` 开始重新匹配。

### 第四步

先匹配到根布局：

```jsx
<Route path="/" element={<App />}>
```

所以 `App` 继续存在。

### 第五步

`Outlet` 决定这次应该显示：

```jsx
<Game />
```

### 最终结果

页面看到的是：

1. 顶部导航还在
2. 内容区变成井字棋页面

## 为什么导航会自动生成

因为 `Navbar.jsx` 不是手写死菜单，而是这样来的：

```jsx
navRoutes.map((route) => ...)
```

也就是说：

你在 `routes.jsx` 里加一个菜单项，导航就会跟着变。

所以后面扩展页面时，不需要再单独维护第二份菜单数组。

## 为什么学习和游戏会高亮

因为“学习”和“游戏”本身不是最终页面，而是一级菜单分组。

例如你现在访问：

```text
/study/hooks
```

虽然不是 `/study` 页面本身，顶部“学习”还是应该高亮。

所以项目里专门写了这个方法：

```jsx
function isRouteActive(pathname, routePath) {
  if (routePath === "/") {
    return pathname === "/";
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}
```

意思是：

1. 如果是首页 `/`，必须精确匹配
2. 如果是 `/study`
   那么 `/study/hooks`、`/study/components` 也算“学习菜单激活”

### 功能

判断一级菜单是否高亮。

### 参数

1. `pathname`
   当前真实地址
2. `routePath`
   当前一级菜单路径

### 返回

`boolean`

## 你以后新增页面时到底要改哪里

就记这几步：

### 第一步

创建页面组件文件。

例如：

```text
src/view/study/CounterPractice.jsx
```

### 第二步

在 `routes.jsx` 里懒加载：

```jsx
const CounterPractice = lazy(() => import("../view/study/CounterPractice"));
```

### 第三步

把它加进 `navRoutes` 的某个菜单下：

```jsx
{
  path: "/study/counter",
  element: CounterPractice,
  label: "计数器练习",
  description: "useState 与事件处理",
}
```

### 然后就结束了

它会自动获得：

1. 路由访问能力
2. 顶部菜单入口
3. 页面懒加载
4. 正常显示在 `Outlet`

所以你可以把当前架构理解成：

**`routes.jsx` 是总开关，`router/index.jsx` 负责把它变成可运行路由，`App.jsx` 负责公共壳层，`Outlet` 负责显示当前页面。`**
