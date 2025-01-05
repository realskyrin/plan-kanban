# Plan Kanban

一个现代化的看板任务管理系统，基于 Next.js 构建，提供直观的任务管理和团队协作功能。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **UI 组件**: 
  - Shadcn UI
  - Radix UI Primitives
- **样式**: Tailwind CSS
- **状态管理**: URL Search Params (nuqs)
- **数据存储**: PostgreSQL

## 特性

- 📱 响应式设计，支持多端访问
- 🎯 直观的任务拖拽管理
- 🔍 强大的任务搜索和筛选功能
- 🎨 现代化 UI 设计
- ⚡ 服务端渲染优化
- 📊 任务统计和进度追踪
- 🌐 多语言支持
- 🔒 安全认证和权限管理

## 开始使用

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn 或 pnpm
- PostgreSQL 15.0 或更高版本

### 安装步骤

1. 克隆项目

```bash
git clone [repository-url]
cd plan-kanban
```

2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 初始化数据库

```bash
npx prisma migrate dev --name init
```

4. 环境配置

复制 `.env.example` 文件为 `.env`，并配置以下必要环境变量：
- DATABASE_URL: PostgreSQL 数据库连接字符串
- JWT_SECRET: 用于生成和验证 JWT 的密钥
- 其他必要的环境变量

5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产环境构建

```bash
npm run build
npm start
# 或
yarn build
yarn start
# 或
pnpm build
pnpm start
```

## 项目结构

```
Directory structure:
└── plan-kanban/
    ├── app/                      // 应用主目录
    │   ├── api/                  // API 路由
    │   │   ├── auth/             // 认证 API
    │   │   ├── projects/         // 项目 API
    │   │   └── tasks/            // 任务 API
    │   ├── login/                // 登录页面
    │   ├── project/              // 项目页面
    │   ├── projects/             // 项目列表页面
    │   └── register/             // 注册页面
    ├── components/               // 组件目录
    │   ├── kanban/               // 看板组件
    │   ├── project/              // 项目组件
    │   ├── providers/            // 提供者组件
    │   └── ui/                   // UI 组件
    ├── hooks/                    // 自定义 Hooks
    ├── lib/                      // 库目录
    ├── prisma/                   // Prisma 配置
    │   ├── schema.prisma         // Prisma 模型定义
    │   └── migrations/           // Prisma 迁移目录
    ├── public/                   // 公共资源目录
    │   ├── icons/                // 图标资源
    │   └── locales/              // 多语言资源
    └── types/                    // 类型定义目录
```

## 开发规范

- 使用 TypeScript 进行类型安全的开发
- 遵循函数式编程范式
- 优先使用 React Server Components
- 遵循移动优先的响应式设计原则

## 性能优化

- 实现了图片优化和懒加载
- 使用 React Suspense 进行组件加载优化
- 合理使用服务端组件减少客户端 JavaScript 体积
- 实现了核心 Web Vitals 的优化

## 贡献指南

欢迎提交 Pull Request 和 Issue。在提交之前，请确保：

1. 代码经过 ESLint 检查
2. 所有测试通过
3. 提交信息清晰明确

## 许可证

MIT 