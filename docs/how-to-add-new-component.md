# 如何给项目新增一个可复用组件

## 目录

1. [目标](#目标)
2. [什么叫可复用组件](#什么叫可复用组件)
3. [什么时候放到 `components`](#什么时候放到-components)
4. [推荐目录结构](#推荐目录结构)
5. [新增组件的完整步骤](#新增组件的完整步骤)
6. [示例：新增一个 `InfoCard` 组件](#示例新增一个-infocard-组件)
7. [怎么在页面里引入组件](#怎么在页面里引入组件)
8. [怎么写组件自己的 CSS](#怎么写组件自己的-css)
9. [组件和页面的区别](#组件和页面的区别)
10. [常见问题](#常见问题)

## 目标

这份文档主要讲清楚一件事：

**以后你想新增一个可复用组件，应该放哪里、怎么引入、怎么写自己的 CSS。**

## 什么叫可复用组件

可复用组件，指的是：

1. 它不是单独的“页面”
2. 它更像页面中的一个功能块或通用 UI
3. 未来可能被多个页面重复使用

例如：

1. 导航栏 `Navbar`
2. 数字时钟 `DigitalClock`
3. 信息卡片 `InfoCard`
4. 按钮组 `ButtonGroup`
5. 弹窗 `Modal`

## 什么时候放到 `components`

满足下面任意一种，通常就该放到 `src/components/`：

1. 多个页面都可能复用
2. 虽然现在只在一个页面用，但逻辑和样式很独立
3. 它更像“功能块”而不是整页内容

## 推荐目录结构

当前项目推荐这种结构：

```text
src/components/
└── InfoCard/
    ├── InfoCard.jsx
    └── InfoCard.css
```

这样做的好处：

1. 组件和样式放在一起
2. 文件更好找
3. 后续组件变复杂时，目录还能继续扩展

例如以后还可以加：

```text
src/components/InfoCard/
├── InfoCard.jsx
├── InfoCard.css
├── InfoCardHeader.jsx
└── InfoCardBody.jsx
```

## 新增组件的完整步骤

大多数情况下，新增一个可复用组件可以按这 5 步走：

1. 在 `src/components/` 下创建组件目录
2. 创建组件文件 `组件名.jsx`
3. 创建样式文件 `组件名.css`
4. 在组件里引入自己的 CSS
5. 在页面或其他组件中引入它

## 示例：新增一个 `InfoCard` 组件

### 第一步：创建目录

```text
src/components/InfoCard/
```

### 第二步：创建组件文件

```text
src/components/InfoCard/InfoCard.jsx
```

示例代码：

```jsx
import "./InfoCard.css";

// 功能：渲染一个带标题和描述的信息卡片。
// 参数：
// - title: 卡片标题，类型为 string。
// - description: 卡片描述，类型为 string。
// 返回：信息卡片 JSX。
export default function InfoCard({ title, description }) {
  return (
    <section className="info-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
}
```

### 第三步：创建样式文件

```text
src/components/InfoCard/InfoCard.css
```

示例代码：

```css
.info-card {
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
}

.info-card h3 {
  margin: 0 0 10px;
}

.info-card p {
  margin: 0;
}
```

## 怎么在页面里引入组件

假设你想在首页 `Home.jsx` 里使用它。

### 引入方式

```jsx
import InfoCard from "../../components/InfoCard/InfoCard";
```

### 使用方式

```jsx
<InfoCard
  title="React 学习"
  description="把每个练习点整理成清晰的卡片内容。"
/>
```

## 怎么写组件自己的 CSS

### 原则 1：组件自己的样式写到自己的 css 文件里

不要把组件专属样式堆到：

1. `index.css`
2. `App.css`

应该写到：

```text
InfoCard.css
```

### 原则 2：类名尽量带组件语义

例如：

```css
.info-card {}
.info-card-title {}
.info-card-description {}
```

这样不容易和别的组件样式冲突。

### 原则 3：页面布局样式和组件样式分开

例如：

1. 组件外层卡片的视觉样式写在组件 css
2. 页面里“这个组件放左边还是右边”的布局样式，写在页面 css

## 组件和页面的区别

### 页面

放在 `src/view/`

特点：

1. 通常直接对应一个路由
2. 代表完整页面
3. 可能组合多个组件

例如：

1. `Home.jsx`
2. `ReactBasic.jsx`
3. `NotFound.jsx`

### 组件

放在 `src/components/`

特点：

1. 更小的功能块
2. 不一定直接对应路由
3. 适合复用

例如：

1. `DigitalClock.jsx`
2. `Navbar.jsx`
3. `InfoCard.jsx`

## 常见问题

### 1. 组件一定要单独建文件夹吗？

建议是要。

因为后面几乎都会需要自己的 CSS，单独目录更清晰。

### 2. 组件样式为什么不要放到 `index.css`？

因为 `index.css` 应该只放全局样式。

如果组件样式都丢进去，后面功能一多会很乱，也容易互相污染。

### 3. 一个组件只有几十行，也要拆成目录吗？

在这个项目里，建议拆。

因为你现在是学习项目，养成结构清晰的习惯更重要。

### 4. 如果组件以后只用一次，还要不要放 `components`？

如果它逻辑和样式非常独立，也可以放 `components`。

但如果它明显就是某个页面内部私有的小块，也可以直接放在那个页面目录旁边。
