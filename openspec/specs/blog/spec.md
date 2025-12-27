# blog Specification

## Purpose
TBD - created by archiving change design-blog-system. Update Purpose after archive.
## Requirements
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

系统 SHALL 使用 Astro Theme Typography 作为默认主题，并允许通过配置文件自定义颜色、字体、布局等视觉样式。

#### Scenario: 默认主题渲染
- **WHEN** 站点使用默认配置
- **THEN** 显示 Typography 主题的默认样式，包含优化的中文排版

#### Scenario: 自定义配置
- **WHEN** 用户在 `src/.config/user.ts` 中修改配置
- **THEN** 站点使用用户自定义的配置（颜色、导航、社交链接等）

#### Scenario: 黑暗模式
- **WHEN** 用户在配置中设置 themeStyle 为 'dark' 或 'system'
- **THEN** 站点支持黑暗模式，并根据系统偏好自动切换

#### Scenario: 中文语言支持
- **WHEN** 用户在配置中设置 locale 为 'zh-cn'
- **THEN** 站点使用中文界面，符合中文排版规范

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

### Requirement: 优化的阅读体验

系统 SHALL 提供基于中文排印规范的优化阅读体验，包括字体、行高、间距等排版细节。

#### Scenario: 响应式设计
- **WHEN** 用户在不同尺寸的设备上访问博客
- **THEN** 内容自动适配屏幕大小，保持良好的阅读体验

#### Scenario: 中文排版
- **WHEN** 用户阅读中文文章
- **THEN** 标点符号、行间距、段落间距等符合中文排版规范

#### Scenario: 代码高亮
- **WHEN** 文章包含代码块
- **THEN** 代码以清晰的高亮样式显示，便于阅读

### Requirement: 多评论系统集成

系统 SHALL 支持 Disqus、Giscus、Twikoo 等多种评论服务，可通过配置文件选择启用。

#### Scenario: Giscus 评论
- **WHEN** 配置文件中设置 comments.giscus 参数
- **THEN** 显示 Giscus 评论组件，基于 GitHub Discussions

#### Scenario: Disqus 评论
- **WHEN** 配置文件中设置 comments.disqus 参数
- **THEN** 显示 Disqus 评论组件

#### Scenario: Twikoo 评论
- **WHEN** 配置文件中设置 comments.twikoo 参数
- **THEN** 显示 Twikoo 评论组件

#### Scenario: 评论服务优先级
- **WHEN** 配置文件中设置多个评论服务
- **THEN** 仅显示第一个配置的评论服务

### Requirement: 增强 SEO 支持

系统 SHALL 支持开放图（Open Graph）和 Twitter Cards 元数据，提升社交媒体分享体验。

#### Scenario: Open Graph 标签
- **WHEN** 文章页面在社交媒体上分享
- **THEN** 显示文章的标题、描述、封面图等信息

#### Scenario: Twitter Cards
- **WHEN** 文章链接在 Twitter 上分享
- **THEN** 显示富媒体卡片，包含文章摘要和图片

#### Scenario: Sitemap 生成
- **WHEN** 站点构建完成
- **THEN** 自动生成 `/sitemap-index.xml`，包含所有页面

### Requirement: 导航和社交链接

系统 SHALL 支持自定义导航菜单和社交媒体链接。

#### Scenario: 导航菜单
- **WHEN** 用户在配置文件中设置 navs 选项
- **THEN** 站点显示自定义的导航链接

#### Scenario: 社交链接
- **WHEN** 用户在配置文件中设置 socials 选项
- **THEN** 站点显示社交媒体图标链接，图标名称基于 Material Design Icons

### Requirement: 国际化支持

系统 SHALL 支持多语言，包括英语、简体中文、繁体中文、日语、意大利语等。

#### Scenario: 语言切换
- **WHEN** 用户在配置文件中设置 locale 选项
- **THEN** 站点使用对应的语言界面

#### Scenario: 新增语言
- **WHEN** 用户在 `src/i18n.ts` 中添加新语言配置
- **THEN** 站点支持新语言

