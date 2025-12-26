# Blog 博客

本目录包含博客的所有内容，包括文章、草稿、静态资源，以及前端站点配置。

## 主题说明

本博客使用 [Astro Theme Typography](https://github.com/moeyua/astro-theme-typography) 主题，专注于提供优秀的中文排版和阅读体验。

## 目录结构

```
blog/
├── posts/           # 已发布的文章（Markdown）
├── drafts/          # 草稿（Markdown）
├── assets/          # 图片与静态文件
├── templates/       # 文章模板
├── index.md         # 目录说明
├── README.md        # 本文件
└── frontend/        # Astro 前端项目（Typography 主题）
```

## 写作指南

### 创建新文章

1. 进入 frontend 目录：
   ```bash
   cd blog/frontend
   pnpm theme:create
   ```

   或者手动创建文件在 `blog/frontend/src/content/posts/`

2. 填写 frontmatter 字段（Typography 主题格式）：
   ```yaml
   ---
   title: "文章标题"
   pubDate: 2025-12-26
   categories: ["技术"]
   description: "文章描述"
   ---
   ```

   注意：使用 `pubDate` 而不是 `date`，使用 `categories` 而不是 `tags`。

### 文章格式

- 标题使用 `# 文章标题`
- 小节使用 `##` 或 `###`
- 代码块使用三个反引号包裹
- 图片引用：`![描述](/skmang_notes/blog/assets/文件名.png)`

### 草稿管理

- 写作中的文章放入 `blog/drafts/` 或 `blog/frontend/src/content/posts/` 并在文件名前添加 `DRAFT-` 前缀
- 完成后移除前缀，文章将自动显示在站点上

## 前端开发

### 环境要求

- Node.js 18+
- pnpm（推荐）

### 开发命令

```bash
# 进入前端目录
cd blog/frontend

# 安装依赖（首次运行）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 创建新文章（使用脚本）
pnpm theme:create
```

### 主题定制

Typography 主题的配置位于 `blog/frontend/src/.config/user.ts`。

#### 主要配置项

```typescript
export const userConfig: Partial<UserConfig> = {
  site: {
    title: 'skmang_notes',        // 站点标题
    subtitle: '个人开发知识库',      // 副标题
    author: 'skmang',              // 作者
    description: '记录开发过程中的学习和思考', // 描述
    website: 'https://skmang.github.io/skmang_notes/', // 站点地址
    pageSize: 10,                 // 每页文章数
    socialLinks: [...],           // 社交链接
    navLinks: [...],              // 导航菜单
  },
  appearance: {
    theme: 'system',              // 'light' | 'dark' | 'system'
    locale: 'zh-cn',              // 语言设置
  },
  comment: {
    giscus: { ... },              // Giscus 评论配置
  },
  // ... 更多配置
}
```

#### 黑暗模式

主题支持三种主题模式：
- `'light'` - 浅色模式
- `'dark'` - 深色模式
- `'system'` - 跟随系统设置（默认）

#### 自定义样式

如需自定义样式，可以创建 CSS 文件并在 `blog/frontend/src/styles/global.css` 中导入。

### 组件结构

```
frontend/src/
├── .config/
│   ├── default.ts         # 默认配置（不要修改）
│   └── user.ts           # 用户配置（在这里修改）
├── layouts/
│   ├── LayoutDefault.astro    # 默认布局
│   ├── LayoutPost.astro        # 文章布局
│   └── LayoutPostList.astro   # 文章列表布局
├── pages/
│   ├── [...page].astro         # 首页（文章列表）
│   ├── about.astro             # 关于页面
│   ├── archive.astro           # 归档页面
│   ├── categories/             # 分类页面
│   ├── posts/[...id].astro     # 文章详情
│   └── atom.xml.ts            # RSS feed
├── components/
│   ├── Analytics.astro         # 分析组件
│   ├── Comments.astro          # 评论组件
│   └── ...                    # 其他组件
├── content/
│   ├── posts/                  # 文章内容（Markdown）
│   └── spec/                  # 特殊页面内容
└── styles/
    └── global.css             # 全局样式
```

## 部署

### GitHub Pages 自动部署

1. 确保站点地址配置正确：`blog/frontend/src/.config/user.ts` 中的 `website` 字段
2. 配置 Giscus 评论系统（见下方）
3. 推送到 GitHub，GitHub Actions 会自动构建并部署

站点地址：`https://skmang.github.io/skmang_notes/`

### 手动部署

```bash
cd blog/frontend
pnpm build
# 将 dist/ 目录上传到你的 Web 服务器
```

### GitHub Actions 工作流

确保项目根目录有正确的 GitHub Actions 配置文件，用于自动构建和部署到 GitHub Pages。

## 评论系统配置（Giscus）

1. 访问 [Giscus 官网](https://giscus.app/)
2. 填入你的仓库信息（如：`skmang/skmang_notes`）
3. 启用 Discussions 功能
4. 复制生成的配置参数
5. 将参数填入 `blog/frontend/src/.config/user.ts` 中的 `comment.giscus` 部分：

```typescript
comment: {
  giscus: {
    repo: 'skmang/skmang_notes',      // 你的 GitHub 仓库
    repoId: 'R_xxxxxx',                // 从 giscus.app 获取
    category: 'General',
    categoryId: 'DIC_xxxxxx',           // 从 giscus.app 获取
    mapping: 'title',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '1',
    inputPosition: 'top',
    theme: 'light',
    lang: 'zh-CN',
    loading: 'lazy',
  },
}
```

## 主题特性

- ✅ 优秀的中文排版和阅读体验
- ✅ 响应式设计，完美适配各种设备
- ✅ 黑暗模式支持（跟随系统）
- ✅ SEO 优化（Open Graph、Twitter Cards）
- ✅ RSS feed 和 Sitemap 自动生成
- ✅ 多种评论系统集成支持（Giscus、Disqus、Twikoo）
- ✅ 多语言支持
- ✅ 代码高亮
- ✅ LaTeX 数学公式支持（可选）

## 注意事项

- 文章 frontmatter 使用 `pubDate` 而不是 `date`
- 文章 frontmatter 使用 `categories` 而不是 `tags`
- 文章文件存储在 `blog/frontend/src/content/posts/`
- 修改配置后需要重启开发服务器
- Giscus 评论需要仓库启用 Discussions 功能

## 相关链接

- [Astro 文档](https://docs.astro.build/)
- [Typography 主题](https://github.com/moeyua/astro-theme-typography)
- [Giscus 配置](https://giscus.app/)
- [GitHub Pages 文档](https://docs.github.com/pages)
