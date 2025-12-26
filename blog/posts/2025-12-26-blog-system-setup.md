---
title: "博客系统搭建完成"
date: "2025-12-26"
tags: ["Astro", "技术选型", "部署"]
draft: false
summary: "使用 Astro 搭建了一个简洁的静态博客，支持 Markdown 原生写作、自动部署和 Giscus 评论系统。"
---

# 博客系统搭建完成

## 背景

在之前的项目文档体系中，`blog/` 目录仅用于存储 Markdown 文件，缺乏公开展示能力。需要在不引入复杂构建链路的前提下，提供博客功能。

## 技术选型

经过对比分析，最终选择了以下方案：

- **静态站点生成器**: Astro
  - 零 JS 默认输出，性能优异
  - 原生支持 Markdown Collections
  - 组件化架构，易于定制
  
- **评论系统**: Giscus
  - 基于 GitHub Discussions
  - 无需额外数据库
  - 轻量级，与 GitHub 生态深度集成

- **部署方式**: GitHub Actions + GitHub Pages
  - 自动化构建和部署
  - 无需额外服务器

## 目录结构

```
blog/
├── posts/           # 文章（保持 Markdown 原生）
├── drafts/          # 草稿
├── assets/          # 静态资源
├── templates/       # 文章模板
└── frontend/        # Astro 前端项目
    ├── src/
    │   ├── layouts/
    │   ├── pages/
    │   ├── components/
    │   └── styles/
    └── astro.config.mjs
```

## 使用方法

### 创建新文章

1. 从 `templates/post.md` 复制模板
2. 在 `blog/posts/` 创建新文件
3. 推送到 GitHub，自动触发构建和部署

### 主题定制

修改 `blog/frontend/src/styles/theme.css` 中的 CSS 变量即可自定义主题。

## 结论 / 收获

- 保持了 Markdown 原生可读性
- 实现了自动化部署流程
- 支持灵活的主题定制
- 集成了 Giscus 评论系统
