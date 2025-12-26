# skmang_notes

个人开发者知识库与写作仓库（仅 Markdown）。这里不存放任何项目源码。

## 快速入口
- `todo.md`：最快的临时待办捕获入口
- `daily/`：每日记录（上下文、决策、链接）
- `inbox/`：未处理笔记（后续整理进 PARA）

## PARA 结构
- `projects/`：短期目标与明确产出
- `areas/`：长期职责与检查清单
- `resources/`：参考资料、学习笔记、可复用片段
- `archive/`：不再活跃或已完成的材料

辅助目录：
- `tasks/`：整理后的任务（从 `todo.md` 或 `daily/` 提升而来）
- `blog/`：博客写作空间（Markdown + 可选 YAML Front Matter）

## 最小命名约定
- 日志/文章：`YYYY-MM-DD-title.md`
- 常青笔记：`kebab-case.md`
- 导航页：每个目录一个 `index.md`

## 快速待办机制（简单版）
1. 捕获：在 `todo.md` 的 `## Inbox` 下追加一行 checkbox
2. 完成：小事项直接改为 `- [x] ...`
3. 每周整理：把多步骤事项迁移到 `tasks/` 或 `projects/<project>/`，并从 `todo.md` 删除/标记为已迁移

## Blog（仅 Markdown + Astro 前端）

### 文件存储
- 草稿：`blog/drafts/`
- 正文：`blog/posts/`
- 模板：`blog/templates/`
- 静态资源：`blog/assets/`
- 前端配置：`blog/frontend/`

### 博客站点
- 技术栈：Astro 静态站点生成器 + Giscus 评论系统
- 部署方式：GitHub Pages 自动部署
- 访问地址：https://[yourusername].github.io/skmang_notes/
- RSS 订阅：https://[yourusername].github.io/skmang_notes/rss.xml

### 快速开始
1. 查看 `blog/README.md` 了解详细使用方法
2. 使用 `blog/templates/post.md` 创建新文章
3. 推送到 GitHub，自动触发构建和部署

Front Matter 示例：
```yaml
---
title: "..."
date: "2025-12-26"
tags: ["..."]
draft: true
summary: "..."
---
```
