# Change: 设计博客系统方案

## Why

当前 `blog/` 目录仅有基础的 Markdown 存储结构，缺乏：
1. 文章展示页面（需要手动在GitHub仓库中阅读）
2. 文章列表与导航
3. 外部评论系统集成
4. 灵活的外观定制能力

需要一个既能保持 Markdown 原生可读性，又提供丰富功能的博客解决方案。

## What Changes

- 引入 **Astro** 作为静态站点生成器
- 在现有 `blog/` 目录结构基础上演进
- 配置 GitHub Pages 部署
- 接入 Giscus（基于 GitHub Discussions）作为评论系统
- 提供默认主题与定制路径

## Impact

- Affected specs: 新增 `blog` capability
- Affected code: `blog/` 目录（保留现有结构，增加配置文件）
- Breaking changes: 无（完全向后兼容现有 Markdown 文件）
