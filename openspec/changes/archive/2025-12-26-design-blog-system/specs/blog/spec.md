## ADDED Requirements

### Requirement: 博客静态站点

系统 SHALL 使用 Astro 静态站点生成器，从 `blog/posts/` 目录读取 Markdown 文件并生成可访问的博客站点。

#### Scenario: 文章列表展示
- **WHEN** 用户访问博客首页
- **THEN** 显示所有已发布文章的列表（标题、日期、摘要）

#### Scenario: 文章详情展示
- **WHEN** 用户点击文章标题
- **THEN** 显示完整的 Markdown 渲染内容

#### Scenario: Markdown 原生可读
- **WHEN** 用户直接在 GitHub 仓库中打开 `blog/posts/*.md`
- **THEN** 文件内容保持 Markdown 格式，可正常阅读

### Requirement: 文章元数据

文章文件 SHALL 在 frontmatter 中包含必需字段（title、date），并支持可选字段（tags、draft、summary）。

#### Scenario: 必需字段验证
- **WHEN** 文章缺少 title 或 date 字段
- **THEN** 构建过程提示错误

#### Scenario: 草稿状态过滤
- **WHEN** 文章 draft 字段为 true
- **THEN** 文章不在公开列表中显示

#### Scenario: 标签分类
- **WHEN** 文章包含 tags 字段
- **THEN** 在文章页显示标签，并支持按标签筛选

### Requirement: 外部评论系统

系统 SHALL 集成 Giscus 评论组件，基于 GitHub Discussions 实现文章评论功能。

#### Scenario: 评论组件加载
- **WHEN** 用户滚动到文章末尾
- **THEN** 加载 Giscus 评论组件

#### Scenario: 评论提交
- **WHEN** 认证用户提交评论
- **THEN** 评论保存到对应文章的 GitHub Discussion

#### Scenario: 评论展示
- **WHEN** 文章有评论
- **THEN** 显示所有已提交的评论

### Requirement: 主题定制

系统 SHALL 提供默认主题，并允许通过 CSS 文件定制颜色、字体、布局等视觉样式。

#### Scenario: 默认主题渲染
- **WHEN** 站点使用默认配置
- **THEN** 显示简洁的浅色主题，适配移动端

#### Scenario: 自定义颜色
- **WHEN** 用户修改主题 CSS 变量
- **THEN** 站点使用新的颜色方案

#### Scenario: 自定义布局
- **WHEN** 用户修改布局组件
- **THEN** 页面结构按自定义配置渲染

### Requirement: 部署自动化

系统 SHALL 使用 GitHub Actions 自动构建并部署到 GitHub Pages。

#### Scenario: 触发构建
- **WHEN** 有变更推送到 `blog/posts/` 或 `blog/frontend/`
- **THEN** 自动触发构建和部署流程

#### Scenario: 构建成功
- **WHEN** 构建成功完成
- **THEN** 站点内容更新到 GitHub Pages

#### Scenario: 构建失败
- **WHEN** 构建过程出现错误
- **THEN** GitHub Actions 记录错误日志并停止部署

### Requirement: RSS 订阅

系统 SHALL 生成 RSS feed，允许读者订阅最新文章。

#### Scenario: RSS feed 生成
- **WHEN** 站点构建完成
- **THEN** 在 `/rss.xml` 路径生成包含所有文章的 RSS feed

#### Scenario: RSS 更新
- **WHEN** 有新文章发布
- **THEN** RSS feed 自动更新并包含新文章
