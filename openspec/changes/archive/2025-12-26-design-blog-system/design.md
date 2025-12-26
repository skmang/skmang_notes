# 设计文档：博客系统技术选型

## Context

项目需求：
1. 默认方式下使用、部署简洁
2. 可以接入外部评论系统
3. 需要定制表现时也可以方便定制
4. 在现有目录结构基础上演进（关注 `blog/` 文件夹）

项目约束：
- 不引入复杂的构建链路
- Markdown 文件保持原生可读性
- 保持项目结构简单

## Goals / Non-Goals

**Goals:**
- 提供文章展示页面与列表导航
- 集成外部评论系统（Giscus）
- 支持 GitHub Pages 自动部署
- 保留 Markdown 原生可读性
- 允许灵活的主题定制

**Non-Goals:**
- 不引入数据库或后端服务
- 不支持动态内容管理
- 不集成复杂的搜索功能（可后续扩展）

## Decisions

### Decision 1: 选择 Astro 作为静态站点生成器

**理由:**
- 零 JS 默认输出，性能优异
- 支持 Markdown 集合（Collections），自然适配现有 `blog/posts/` 结构
- 组件化架构，支持 JSX/TSX/Vue/Svelte
- 构建速度快，开发体验好
- 社区活跃，有现成的 Blog 模板

**替代方案考虑:**

| 方案 | 优点 | 缺点 |
|------|------|------|
| Next.js | 生态丰富 | 重量级，输出较大 |
| Hugo | 构建极快 | 模板语法学习曲线 |
| Jekyll | GitHub Pages 原生支持 | 性能一般，Ruby 依赖 |
| Vitepress | 文档友好 | 更适合技术文档而非博客 |

**结论:** Astro 在性能、开发体验和现有结构兼容性上取得最佳平衡。

### Decision 2: 选择 Giscus 作为评论系统

**理由:**
- 基于 GitHub Discussions，数据存储在仓库中
- 无需额外数据库或后端服务
- 支持 Markdown，与项目风格一致
- 轻量级，无需 API 密钥管理

**替代方案考虑:**

| 方案 | 优点 | 缺点 |
|------|------|------|
| Disqus | 功能丰富 | 需要账号，有广告 |
| Utterances | 同 Giscus | 已停止维护 |
| Waline | 功能强大 | 需要自建服务 |

**结论:** Giscus 最符合项目需求，无额外依赖且与 GitHub 生态深度集成。

### Decision 3: 目录结构演进方案

**现有结构:**
```
blog/
├── posts/
├── drafts/
├── assets/
├── templates/
└── index.md
```

**演进后结构:**
```
blog/
├── posts/           # 文章（保持不变）
├── drafts/          # 草稿（保持不变）
├── assets/          # 静态资源（保持不变）
├── templates/       # 文章模板（保持不变）
├── index.md         # 目录说明（保持不变）
├── README.md        # 使用说明（新增）
└── frontend/        # Astro 前端项目（新增）
    ├── src/
    │   ├── layouts/
    │   ├── pages/
    │   ├── components/
    │   └── styles/
    ├── public/
    ├── astro.config.mjs
    ├── package.json
    └── tsconfig.json
```

**理由:**
- `blog/frontend/` 独立存放 Astro 项目，避免污染根目录
- 现有 Markdown 文件位置不变，保持可读性
- 构建输出在 `blog/frontend/dist/`，可配置为 GitHub Pages 源

### Decision 4: 部署方案

**方案:** 使用 GitHub Actions 自动部署到 GitHub Pages

**配置要点:**
- 当 `blog/posts/` 或 `blog/frontend/` 有变更时触发构建
- 构建命令: `cd blog/frontend && npm ci && npm run build`
- 部署路径: 将 `dist/` 目录推送到 `gh-pages` 分支
- 站点路径: `https://[username].github.io/skmang_notes/`

**理由:**
- 无需额外服务器或域名
- 自动化部署，减少手动操作
- 与现有 Git 工作流自然集成

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 构建时间随文章数量增加 | Astro 增量构建，影响有限 |
| Giscus 依赖 GitHub 服务 | 仓库已有，无额外风险 |
| 主题定制需要 CSS 知识 | 提供默认主题，定制为可选 |
| Node.js 版本兼容性 | 在 README 中明确版本要求 |

## Migration Plan

**步骤:**
1. 创建 `blog/frontend/` 目录并初始化 Astro 项目
2. 配置 `astro.config.mjs` 读取 `blog/posts/`
3. 在 GitHub 配置 Giscus 应用
4. 创建 GitHub Actions 工作流文件
5. 验证文章列表页、详情页、评论功能
6. 定制主题样式（可选）

**回滚计划:**
- 删除 `blog/frontend/` 目录
- 移除 GitHub Actions 工作流
- 现有 Markdown 文件不受影响

## Open Questions

- 是否需要文章分类功能？（可通过 tags 实现）
- 是否需要暗色模式？（可后续添加）
- 是否需要多语言支持？（暂不实现）
- RSS feed 格式偏好？（使用 Astro 默认配置）
