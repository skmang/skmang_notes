# Change: 替换博客主题为 Astro Theme Typography

## Why
当前博客使用的是基础的自定义主题，功能较为简单，缺少现代化的阅读体验、黑暗模式支持、以及丰富的定制选项。Astro Theme Typography 是一个成熟的博客主题，专注于提供优秀的排版和阅读体验，符合中文排印规范，能够显著提升博客的视觉质量和用户体验。

当前博客无内容，适合进行破坏性迁移。

## What Changes

- **BREAKING**: 完全替换当前博客主题为 [moeyua/astro-theme-typography](https://github.com/moeyua/astro-theme-typography)
- 新主题代码将直接放置在 `blog/frontend/` 目录内（用户提前准备）
- 配置新主题的各项功能：
  - 设置中文语言支持（zh-cn）
  - 配置导航链接（Posts, Archive, Categories, About）
  - 集成 Giscus 评论系统
  - 启用 RSS feed 和 Sitemap
  - 配置社交链接
  - 设置黑暗模式
- 更新部署配置以适配新主题的构建要求

## Impact

- **Affected specs**: `specs/blog/spec.md`
- **Affected code**: 
  - `blog/frontend/` - 整个前端目录将基于新主题重构
  - `blog/posts/` - 可能需要调整 frontmatter 格式
  - GitHub Actions 工作流 - 可能需要更新依赖安装和构建步骤

## Benefits

- 更优秀的中文排版和阅读体验
- 响应式设计，完美适配各种设备
- 内置黑暗模式支持
- SEO 优化（Open Graph、Twitter Cards、Sitemap）
- 多种评论系统集成支持
- 更丰富的定制选项
- 更现代的视觉设计

## Migration Plan

1. 确认新主题代码已放置在 `blog/frontend/` 目录
2. 安装依赖
3. 配置主题选项
4. 测试所有功能
5. 更新部署配置
