# Design: 替换博客主题为 Astro Theme Typography

## Context

当前博客系统使用的是基础的自定义 Astro 主题，功能简单，缺少现代化的阅读体验和丰富的定制选项。为了提升博客的视觉质量和用户体验，需要迁移到成熟的 Astro Theme Typography 主题。

### 当前状态
- 使用基础自定义主题（基于 Astro + TypeScript）
- 简单的布局和样式
- 博客暂无内容，适合进行破坏性变更

### 约束条件
- 需要保持 GitHub Pages 部署流程
- 需要保留评论系统集成
- 新主题代码将由用户提前放置在 `blog/frontend/` 目录

## Goals / Non-Goals

### Goals
- ✅ 迁移到 Typography 主题，获得更好的阅读体验
- ✅ 集成 Giscus 评论系统
- ✅ 启用黑暗模式
- ✅ 配置中文语言支持
- ✅ 保持 GitHub Pages 自动部署
- ✅ SEO 优化（Open Graph、Twitter Cards）

### Non-Goals
- ❌ 迁移现有文章内容（博客暂无内容）
- ❌ 更改域名或部署平台
- ❌ 自定义主题核心样式（优先使用主题默认配置）
- ❌ 集成多个评论服务（仅使用 Giscus）

## Decisions

### 决策 1: 完全替换前端代码库
**选择**: 直接覆盖 `blog/frontend/` 目录，使用 Typography 主题的完整代码

**理由**:
- Typography 主题架构与当前实现差异较大
- 直接替换可以避免配置冲突和样式冲突
- 主题已包含最佳实践和优化

**替代方案考虑**:
- 逐个组件迁移：工作量太大，容易遗漏依赖
- 仅复制部分文件：可能破坏主题完整性

### 决策 2: 无需内容迁移
**选择**: 无需进行文章内容迁移

**理由**:
- 当前博客暂无内容
- 后续新增文章直接使用 Typography 主题的内容目录结构（`src/content/posts/`）
- 符合 Astro Content Collections 最佳实践

**后续新增文章**:
- 新文章放置在 `blog/frontend/src/content/posts/`
- 使用主题要求的 frontmatter 格式（title、pubDate、categories、description）

### 决策 3: 配置文件管理
**选择**: 在 `src/.config/user.ts` 中维护自定义配置，不修改默认配置文件

**理由**:
- 主题设计上支持覆盖配置
- 便于主题更新时保留自定义配置
- 符合主题的升级机制

### 决策 4: 评论系统集成
**选择**: 继续使用 Giscus 作为评论服务

**理由**:
- 已在现有系统中使用，用户有经验
- 基于 GitHub Discussions，无需额外服务
- 符合技术博客的特性
- Typography 原生支持

### 决策 5: 黑暗模式配置
**选择**: 使用 `'system'` 模式，跟随系统偏好

**理由**:
- 提供最佳用户体验
- 用户可以根据自己的偏好设置
- 符合现代 Web 标准

## Risks / Trade-offs

### 风险 1: 依赖冲突
**描述**: Typography 主题引入新依赖（如 UnoCSS），可能与现有配置冲突

**缓解措施**:
- 清理现有的 `node_modules` 并重新安装依赖
- 验证构建无错误

### 风险 2: 部署失败
**描述**: GitHub Actions 构建可能因主题差异而失败

**缓解措施**:
- 本地完成构建测试
- 检查并更新工作流配置
- 准备回滚方案

### 权衡分析
- **优点**: 显著提升用户体验，获得现代化博客功能
- **缺点**: 需要一次性大量变更，短期内可能有不确定性
- **结论**: 收益大于风险，可以通过充分测试来控制风险

## Migration Plan

### 阶段 1: 确认主题代码（用户操作）
1. 用户将 Typography 主题代码放置到 `blog/frontend/` 目录
2. 确认主题代码完整

### 阶段 2: 安装依赖（10 分钟）
1. 清理现有的 `node_modules`（如有）
2. 运行 `npm install` 安装主题依赖

### 阶段 3: 配置定制（20 分钟）
1. 创建 `src/.config/user.ts`
2. 配置站点基本信息（标题、描述、语言）
3. 配置导航菜单
4. 配置黑暗模式为 `'system'`
5. 配置 Giscus 评论系统
6. 配置社交媒体链接（如需要）

### 阶段 4: 本地测试（30 分钟）
1. 运行 `npm run build` 本地构建测试
2. 启动开发服务器 `npm run dev`
3. 验证所有页面功能
4. 测试响应式设计
5. 验证黑暗模式

### 阶段 5: 部署（15 分钟）
1. 提交所有更改到 Git
2. 推送到 GitHub
3. 监控 GitHub Actions 构建
4. 验证 GitHub Pages 部署
5. 线上功能验证

### 阶段 6: 回滚计划（准备就绪）
**如果出现问题**:
1. 恢复 Git 到迁移前的提交
2. 问题修复后重新部署

## Open Questions

1. **Q**: 是否需要自定义主题的默认配色？
   - **A**: 优先使用主题默认配色，后续根据反馈调整

2. **Q**: 是否需要添加自定义页面（如友链、项目展示）？
   - **A**: 暂不添加，保持简洁，后续根据需求扩展

## References

- [Astro Theme Documentation](https://docs.astro.build)
- [moeyua/astro-theme-typography](https://github.com/moeyua/astro-theme-typography)
- [Giscus Documentation](https://giscus.app)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
