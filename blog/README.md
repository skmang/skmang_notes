# Blog 博客

本目录包含博客的所有内容，包括文章、草稿、静态资源，以及前端站点配置。

## 目录结构

```
blog/
├── posts/           # 已发布的文章（Markdown）
├── drafts/          # 草稿（Markdown）
├── assets/          # 图片与静态文件
├── templates/       # 文章模板
├── index.md         # 目录说明
├── README.md        # 本文件
└── frontend/        # Astro 前端项目
```

## 写作指南

### 创建新文章

1. 从 `templates/post.md` 复制模板
2. 在 `blog/posts/` 创建新文件
3. 填写 frontmatter 字段：
   ```yaml
   ---
   title: "文章标题"
   date: "2025-12-26"
   tags: ["标签1", "标签2"]  # 可选
   draft: false               # true 为草稿，不会发布
   summary: "文章摘要"          # 可选
   ---
   ```

### 文章格式

- 标题使用 `# 文章标题`
- 小节使用 `##` 或 `###`
- 代码块使用三个反引号包裹
- 图片引用：`![描述](/ProjectDocs/blog/assets/文件名.png)`

### 草稿管理

- 写作中的文章放入 `blog/drafts/`
- 设置 `draft: true`
- 发布时移动到 `blog/posts/` 并设置 `draft: false`

## 前端开发

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 开发命令

```bash
# 进入前端目录
cd blog/frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 主题定制

修改 `blog/frontend/src/styles/theme.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #2563eb;      /* 主色调 */
  --text-primary: #1f2937;       /* 主文本颜色 */
  --bg-color: #ffffff;           /* 背景颜色 */
  /* ... 更多变量 */
}
```

### 组件结构

```
frontend/src/
├── layouts/
│   └── Layout.astro         # 主布局模板
├── pages/
│   ├── index.astro          # 首页
│   ├── blog/posts/
│   │   ├── index.astro      # 文章列表
│   │   └── [slug].astro     # 文章详情
│   └── rss.xml.js           # RSS 订阅
├── components/
│   └── Giscus.astro         # 评论组件
└── styles/
    └── theme.css            # 主题样式
```

## 部署

### GitHub Pages 自动部署

1. 配置 `blog/frontend/astro.config.mjs` 中的 `site` 和 `base` 路径
2. 配置 Giscus 评论系统（见下方）
3. 推送到 GitHub，GitHub Actions 会自动构建并部署

站点地址：`https://[yourusername].github.io/ProjectDocs/`

### 手动部署

```bash
cd blog/frontend
npm run build
# 将 dist/ 目录上传到你的 Web 服务器
```

## 评论系统配置（Giscus）

1. 访问 https://github.com/apps/giscus 安装应用到你的仓库
2. 访问 https://giscus.app/ 获取配置参数
3. 修改 `blog/frontend/src/components/Giscus.astro` 中的默认值：

```astro
const {
  repo = 'YOUR_USERNAME/YOUR_REPO',  // 修改为你的仓库
  repoId = '',                        // 填入 repo ID
  categoryId = '',                    // 填入 category ID
  // ... 其他配置
} = Astro.props;
```

## 注意事项

- Markdown 文件保持原生可读性，可直接在 GitHub 上查看
- 文章图片放在 `blog/assets/` 目录
- 草稿不会发布到公开站点
- 修改前端配置后需要重新构建

## 相关链接

- [Astro 文档](https://docs.astro.build/)
- [Giscus 配置](https://giscus.app/)
- [GitHub Pages 文档](https://docs.github.com/pages)
