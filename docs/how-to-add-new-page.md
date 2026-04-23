# 如何给项目新增一个页面

## 目录

1. [目标](#目标)
2. [新增页面的完整流程](#新增页面的完整流程)
3. [示例：新增一个 Counter 页面](#示例新增一个-counter-页面)
4. [步骤 1：创建页面文件](#步骤-1创建页面文件)
5. [步骤 2：按需创建样式文件](#步骤-2按需创建样式文件)
6. [步骤 3：在路由文件中懒加载页面](#步骤-3在路由文件中懒加载页面)
7. [步骤 4：把页面加入路由配置](#步骤-4把页面加入路由配置)
8. [步骤 5：决定是否显示在导航菜单中](#步骤-5决定是否显示在导航菜单中)
9. [步骤 6：运行构建验证](#步骤-6运行构建验证)
10. [常见场景写法](#常见场景写法)
11. [常见问题](#常见问题)

## 目标

这份文档专门讲一件事：

**以后你想给这个项目新增一个页面，到底要改哪几个文件。**

你只要记住这份文档里的步骤，后面加页面就不会乱。

## 新增页面的完整流程

大多数情况下，新增一个页面只要做 5 步：

1. 创建页面组件文件
2. 创建页面样式文件
3. 在 `src/router/routes.jsx` 里懒加载这个页面
4. 把它加到 `navRoutes` 对应位置
5. 运行 `npm run build` 检查

## 示例：新增一个 Counter 页面

假设你现在要新增一个学习页面：`Counter 练习`

目标路径：

```text
/study/counter
```

目标菜单位置：

```text
学习 -> Counter 练习
```

## 步骤 1：创建页面文件

建议放在：

```text
src/view/study/CounterPractice.jsx
```

示例代码：

```jsx
export default function CounterPractice() {
  return <div>Counter Practice</div>;
}
```

### 为什么放这里

因为它是一个“页面”，不是一个通用小组件，所以更适合放到 `view/study/`。

## 步骤 2：按需创建样式文件

如果这个页面需要自己的样式，可以创建：

```text
src/view/study/CounterPractice.css
```

然后在页面里引入：

```jsx
import "./CounterPractice.css";
```

### 建议

尽量让页面样式跟页面文件放在一起，后面维护会更清楚。

## 步骤 3：在路由文件中懒加载页面

打开：

```text
src/router/routes.jsx
```

在顶部加一行：

```jsx
const CounterPractice = lazy(() => import("../view/study/CounterPractice"));
```

### 这一步的作用

告诉项目：

“这个页面存在，而且要用懒加载方式引入。”

## 步骤 4：把页面加入路由配置

在 `navRoutes` 中找到“学习”菜单，然后把页面加到 `children` 里：

```jsx
{
  path: "/study/counter",
  element: CounterPractice,
  label: "Counter 练习",
  description: "useState 计数器练习",
}
```

完整示例：

```jsx
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
      path: "/study/counter",
      element: CounterPractice,
      label: "Counter 练习",
      description: "useState 计数器练习",
    },
  ],
}
```

### 这一步完成后会发生什么

因为当前项目会自动从 `navRoutes` 生成：

1. 顶部导航下拉菜单
2. 实际可访问路由

所以你只改这一份配置就够了。

## 步骤 5：决定是否显示在导航菜单中

这取决于你把页面加在哪。

### 情况 1：加在 `children` 里

会自动显示在对应下拉菜单中。

例如：

```text
学习 -> Counter 练习
```

### 情况 2：新增一级菜单

如果你新增的是新的一级模块，例如：

```text
工具
```

那你就要在 `navRoutes` 里新增一个一级对象。

## 步骤 6：运行构建验证

新增页面后，建议马上执行：

```bash
npm run build
```

### 为什么

可以第一时间检查：

1. 页面导入路径有没有写错
2. `routes.jsx` 有没有拼写错误
3. CSS 引入有没有问题
4. 路由配置是否有效

## 常见场景写法

### 场景 1：新增学习子页面

放到：

```text
src/view/study/
```

路由加到：

```jsx
navRoutes[学习].children
```

### 场景 2：新增游戏子页面

如果是完整页面，建议也可以放到：

```text
src/view/game/
```

如果是已经做好的功能组件，也可以继续放 `components/`，再在路由里直接引用。

### 场景 3：新增首页级别页面

如果以后你想做一级菜单，比如：

```text
作品集
```

你可以在 `navRoutes` 里新增：

```jsx
{
  path: "/portfolio",
  element: Portfolio,
  label: "作品集",
  icon: "portfolio",
  showInTab: true,
}
```

## 常见问题

### 1. 我只建了页面文件，为什么访问不到？

因为还没在 `src/router/routes.jsx` 注册。

### 2. 我加了路由，为什么菜单里没有？

可能原因：

1. 没加到 `navRoutes`
2. `showInTab` 不是 `true`
3. 你加的是最终路由，但没有加到导航结构里

### 3. 我应该放 `view` 还是 `components`？

一般这样判断：

1. 如果它是一个完整页面，放 `view`
2. 如果它是一个可复用功能组件，放 `components`

### 4. 我加完页面后最推荐检查什么？

最推荐检查两件事：

1. 菜单能不能点到
2. `npm run build` 能不能通过
