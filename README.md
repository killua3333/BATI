# BATI 篮球人格测试前端

BATI（Basketball Archetype Type Indicator）是一个基于 Vue 3 + TypeScript + Vite 的篮球人格测试前端项目。  
用户完成 20 道情境题后，系统会根据六维能力向量进行匹配，输出最接近的球星原型，并在结果页展示球探风格解读与雷达图。

## 功能概览

- 首页引导：进入测试与球星图鉴
- 答题流程：20 题三选一（A/B/C）
- 结果页展示：
  - 匹配球星画像
  - 核心风格标签（Scout's Verdict）
  - Executive Summary 一句话简报
  - 六边形雷达图
- 球星图鉴：展示球员照片、球风与人格描述
- 隐藏结局：满足特定触发条件后进入“键盘侠模式”

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router（Hash 模式）
- Cloudflare Pages（静态托管 + Pages Functions）
- Cloudflare D1（结果存储）

## 本地启动

```bash
npm install
npm run dev
```

默认开发地址通常为：`http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run preview
```

## Cloudflare 部署与 D1

1. 在 Cloudflare 创建 D1 数据库，并把 `wrangler.toml` 的 `database_id` 改成真实值
2. 首次执行迁移建表：

```bash
npm run d1:migrate:remote
```

3. 本地联调静态资源 + Functions + D1：

```bash
npm run build
npm run cf:dev
```

4. 部署到 Cloudflare Pages：

```bash
npm run cf:deploy
```

## 项目结构（核心）

```text
src/
├── components/      # 可复用 UI 组件
├── composables/     # 组合式逻辑（如 useQuiz）
├── data/            # 题库与球星静态数据
├── pages/           # 页面组件（Home/Quiz/Result/Characters）
├── router/          # 路由配置
├── types/           # TypeScript 类型
├── utils/           # 工具函数
├── App.vue
├── main.ts
└── style.css
```

## 数据与匹配逻辑

- 题库：`src/data/questions.json`
- 球星库：`src/data/characters.json`
- 核心逻辑：`src/composables/useQuiz.ts`

匹配方式（当前）：

1. 按六个维度计算用户平均分向量
2. 与每位球星向量计算曼哈顿距离
3. 距离最小者为匹配结果

六个维度：

- `usage`（球权）
- `range`（区域）
- `physical`（对抗）
- `playmaking`（战术）
- `defense`（防守）
- `temperament`（情绪）

## 文档

- `项目逻辑说明文档.md`：完整流程与架构说明
- `球星风格与评分标准.md`：球星维度评分与风格参考
- `提交规范.md`：分支、提交与推送规范

## 开发建议

- 提交前执行：
  - `npm run build`
  - `git diff --staged`
- 避免提交：
  - `node_modules/`
  - `dist/`
  - `*.tsbuildinfo`
  - `.env*`（保留 `.env.example`）
