# knowledge-repo

## Purpose
定义一个 PARA 优先、仅 Markdown 的个人知识仓库结构，并包含独立的博客写作区域；同时提供最小的命名、索引与写作约定，确保无需任何构建工具也能直接检索与阅读。

## Requirements

### Requirement: 提供 PARA 优先的 Markdown 仓库结构
仓库 MUST 提供一个 PARA 优先的结构，用于个人开发知识管理，并且不包含任何实际项目源码。

#### Scenario: 按意图创建与查找内容
- **GIVEN** 开发者希望存放个人开发笔记
- **WHEN** 创建一条新笔记
- **THEN** 可以在 `projects/`、`areas/`、`resources/`、`archive/` 中选择且仅选择一个主要归属
- **AND** 仍可在 `inbox/` 捕获未整理输入，并在 `daily/` 记录每日上下文

#### Scenario: 仓库保持仅 Markdown
- **GIVEN** 仓库被用作个人知识库与博客写作空间
- **WHEN** 添加内容
- **THEN** 仓库仅包含 Markdown 与静态资源（例如图片）
- **AND** 不依赖站点生成器也能直接使用

### Requirement: 提供博客写作目录，并支持可选 Front Matter
仓库 MUST 提供独立的 `blog/` 区域，用于用 Markdown 编写文章与草稿，并且 MUST 支持文章可选的 YAML Front Matter 元数据。

#### Scenario: 撰写博客草稿
- **GIVEN** 开发者在撰写一篇文章
- **WHEN** 在 `blog/drafts/` 下创建文件
- **THEN** 文件可以包含 YAML Front Matter 字段，例如 `title`、`date`、`tags`、`draft`

#### Scenario: 无站点生成器也可发布/阅读
- **GIVEN** 开发者在 `blog/posts/` 下编写文章
- **WHEN** 完成编辑
- **THEN** Markdown 自包含、无需构建步骤也能直接阅读
