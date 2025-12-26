## 1. Astro 初始化
- [x] 1.1 在项目根目录运行 `npm create astro@latest blog-frontend`
- [x] 1.2 选择配置：使用 "Blog" 模板，选择 TypeScript，选择组件框架（可选 Vue/React/Svelte）
- [x] 1.3 将生成的项目移动到 `blog/` 目录下

## 2. 配置文件调整
- [x] 2.1 调整 `astro.config.mjs` 指向 `blog/posts/` 目录作为文章源
- [x] 2.2 配置站点标题、描述等元数据
- [x] 2.3 设置构建输出目录为 `dist/`（默认）

## 3. 文章集成
- [x] 3.1 确认现有 `blog/posts/` 目录的文章可被 Astro 正确读取
- [x] 3.2 更新文章 frontmatter 以适配 Astro（保持现有字段兼容）
- [x] 3.3 配置 RSS feed 输出

## 4. Giscus 评论系统集成
- [x] 4.1 在 GitHub 仓库配置 Giscus 应用
- [x] 4.2 在 Astro 项目中安装 Giscus 组件
- [x] 4.3 配置 `src/components/Comment.tsx` 组件
- [x] 4.4 在文章模板中集成评论组件

## 5. GitHub Pages 部署配置
- [x] 5.1 配置 `astro.config.mjs` 中的 `site` 和 `base` 路径
- [x] 5.2 在 GitHub Actions 中添加构建和部署工作流
- [x] 5.3 测试部署流程

## 6. 主题定制
- [x] 6.1 创建主题配置文件（如 `src/styles/theme.css`）
- [x] 6.2 定制颜色、字体等基础样式
- [x] 6.3 响应式布局调整

## 7. 文档与说明
- [x] 7.1 更新 `blog/README.md` 说明使用方法
- [x] 7.2 添加开发与部署命令说明
- [x] 7.3 更新项目根 `README.md` 添加博客访问链接
