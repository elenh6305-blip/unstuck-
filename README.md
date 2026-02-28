# 🧠 Unstuck — ADHD 纳米任务助手

> 专为启动困难设计，让每一步都小到无法拒绝。

一个帮助 ADHD 患者将任务拆解为「纳米步骤」的 PWA 应用，由 Google Gemini AI 驱动。

---

## ✨ 功能

- **AI 智能拆分** — 输入任意任务，自动拆解为 6~10 个 30 秒~3 分钟内可完成的纳米步骤
- **专注模式** — 全屏单步显示，隐藏上下步骤，减少认知负荷，支持左右推送动画
- **进度追踪** — 可逐步勾选完成，实时进度条
- **历史记录** — 自动保存每次任务，随时回顾
- **PWA 支持** — 可安装到手机主屏幕，离线基础功能可用

---

## 🚀 快速开始

### 前置要求
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/apikey)（免费）

### 安装运行

```bash
git clone https://github.com/YOUR_USERNAME/unstuck.git
cd unstuck
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5173`

### 配置 API Key

首次使用时，点击底部导航栏的 **设置**，填入你的 Gemini API Key。  
Key 仅保存在本地设备，不会上传到任何服务器。

---

## 🏗️ 技术架构

采用严格的 **UI / 逻辑分离** 架构，方便修改和扩展：

```
src/
├── components/   # 纯 UI 层（只管显示）
├── hooks/        # 纯逻辑层（只管状态）
├── services/     # 纯服务层（只管通信）
└── pages/        # 组装层（连接 Hook 与组件）
```

详细架构说明见 [`docs/architecture.md`](./docs/architecture.md)

### 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | React + Vite |
| 路由 | react-router-dom v6 |
| 动画 | framer-motion |
| 样式 | 纯 CSS（CSS 变量） |
| AI | Google Gemini API |
| 存储 | localStorage |

---

## 📁 目录结构

```
unstuck/
├── docs/
│   └── architecture.md       # 架构设计文档
├── src/
│   ├── components/
│   │   ├── focus/            # 专注模式组件
│   │   ├── home/             # 主页组件
│   │   └── layout/           # 布局组件
│   ├── hooks/                # 业务逻辑 Hook
│   ├── pages/                # 页面
│   └── services/             # API & 存储服务
├── index.html
└── vite.config.js
```

---

## 🙋 关于 ADHD 与本项目

ADHD（注意力缺陷多动障碍）患者常常面临**任务启动困难**——即使知道该做什么，也难以迈出第一步。

本项目的核心思路：**把任何任务拆到小到不可能拒绝的粒度**，让"开始"变得毫不费力。

---

## 📄 License

MIT © 2026
