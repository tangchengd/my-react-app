# 项目目录结构说明

## 目录

1. [目标](#目标)
2. [当前项目结构](#当前项目结构)
3. [根目录文件说明](#根目录文件说明)
4. [`src` 目录说明](#src-目录说明)
5. [`components` 目录说明](#components-目录说明)
6. [`view` 目录说明](#view-目录说明)
7. [`router` 目录说明](#router-目录说明)
8. [`docs` 目录说明](#docs-目录说明)
9. [为什么这样拆分](#为什么这样拆分)
10. [后面继续扩展时的建议](#后面继续扩展时的建议)

## 目标

这份文档主要讲清楚这个项目现在的目录分工，让你能快速知道：

1. 每个文件夹是干什么的
2. 页面应该放哪里
3. 组件应该放哪里
4. 路由配置应该改哪里
5. 样式文件应该放哪里

## 当前项目结构

```text
my-react-app/
├── docs/
├── dist/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── DigitalClock/
│   │   ├── Game/
│   │   └── layout/
│   ├── router/
│   ├── view/
│   │   ├── home/
│   │   ├── notfound/
│   │   └── study/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## 根目录文件说明

| 文件/目录 | 作用 |
| --- | --- |
| `docs/` | 放项目说明文档 |
| `dist/` | 打包后的产物目录 |
| `node_modules/` | npm 安装的依赖 |
| `public/` | 静态资源目录 |
| `src/` | 项目源码主目录 |
| `index.html` | Vite 入口 HTML |
| `package.json` | 项目依赖和脚本配置 |
| `vite.config.js` | Vite 配置文件 |

## `src` 目录说明

`src` 是你平时最常操作的目录，核心代码都在这里。

### 当前核心文件

| 文件/目录 | 作用 |
| --- | --- |
| `main.jsx` | 应用启动入口 |
| `App.jsx` | 全局布局壳层 |
| `App.css` | 全局布局样式 |
| `index.css` | 全局基础样式 |
| `components/` | 可复用组件 |
| `view/` | 页面级组件 |
| `router/` | 路由配置与渲染入口 |

## `components` 目录说明

这个目录放“偏可复用”的组件。

### 当前结构

```text
src/components/
├── DigitalClock/
│   ├── DigitalClock.jsx
│   └── DigitalClock.css
├── Game/
│   ├── Game.jsx
│   └── Game.css
└── layout/
    └── Navbar/
        ├── Navbar.jsx
        └── Navbar.css
```

### 每个目录的作用

| 目录 | 作用 |
| --- | --- |
| `DigitalClock/` | 数字时钟功能组件 |
| `Game/` | 井字棋功能组件 |
| `layout/Navbar/` | 页面布局用的导航栏组件 |

### 什么时候放到 `components`

如果一个内容更像“功能组件”或“布局组件”，就更适合放这里。

例如：

1. 导航栏
2. 数字时钟
3. 游戏棋盘
4. 可复用卡片
5. 通用按钮

## `view` 目录说明

这个目录放“页面级组件”。

### 当前结构

```text
src/view/
├── home/
│   ├── Home.jsx
│   └── Home.css
├── notfound/
│   ├── NotFound.jsx
│   └── NotFound.css
└── study/
    ├── ComponentCommunication.jsx
    ├── HooksPractice.jsx
    ├── ReactBasic.jsx
    ├── StudyPlaceholder.jsx
    └── StudyPlaceholder.css
```

### 每个目录的作用

| 目录 | 作用 |
| --- | --- |
| `home/` | 首页页面 |
| `notfound/` | 404 页面 |
| `study/` | 学习模块下的页面 |

### 什么时候放到 `view`

如果一个文件直接对应“某个路由页面”，就更适合放 `view`。

例如：

1. 首页
2. 学习页面
3. 404 页面
4. 后面新增的表单练习页、Todo 页、Counter 页

## `router` 目录说明

当前结构：

```text
src/router/
├── index.jsx
└── routes.jsx
```

### 文件作用

| 文件 | 作用 |
| --- | --- |
| `index.jsx` | 把路由配置渲染成真正的 `<Route />` |
| `routes.jsx` | 集中维护路由和导航配置 |

### 为什么重要

以后你新增页面时，几乎一定要改这里。

通常是改：

1. 新增页面组件文件
2. 在 `routes.jsx` 中引入这个页面
3. 把它加入某个菜单分组或直接加入首页级别路由

## `docs` 目录说明

这个目录用来放你的学习文档和项目说明。

当前已经有：

| 文件 | 作用 |
| --- | --- |
| `route-architecture.md` | 正式版路由架构说明 |
| `route-architecture-simple.md` | 超白话版路由说明 |
| `project-structure.md` | 当前这份目录结构说明 |
| `how-to-add-new-page.md` | 新增页面的操作指南 |

## 为什么这样拆分

当前这种拆分方式的好处是：

1. 页面和组件职责更清楚
2. 路由配置集中，后续维护方便
3. 每个功能自己的 CSS 放在自己目录里，不容易互相污染
4. 你学习时更容易建立“页面”“组件”“布局”“路由”的概念区分

## 后面继续扩展时的建议

### 1. 新页面优先放 `view`

如果是一个完整页面，先考虑放在：

```text
src/view/xxx/
```

### 2. 可复用功能放 `components`

如果后面多个页面都会用到，就放：

```text
src/components/xxx/
```

### 3. 每个功能样式跟着组件走

例如：

```text
Counter.jsx
Counter.css
```

### 4. 新页面接入顺序

建议固定按这个顺序做：

1. 建页面文件
2. 建样式文件
3. 在 `routes.jsx` 里注册
4. 看是否需要加入导航菜单
5. 运行 `npm run build` 验证
