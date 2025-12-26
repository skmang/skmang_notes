# 项目上下文（Project Context）

## 目的（Purpose）
`ProjectDocs` 是个人开发知识库与写作仓库（仅 Markdown），用于在开发过程中沉淀笔记、方案/决策、学习记录、待办与可发布文章。仓库不存放任何项目源码。

## 技术栈（Tech Stack）
- Markdown（`.md`）为主，静态资源可放在 `blog/assets/`
- OpenSpec（`openspec/`）用于管理规格（`specs/`）与变更提案（`changes/`）

## 项目约定（Project Conventions）

### 语言与本地化（Language）
- 标准语言：中文（后续新增/更新的文档内容以中文为准）。
- 目录与文件名：保持现状，不因本地化改名（例如 `daily/`、`todo.md` 等）。
- OpenSpec 结构性关键字：为保证 `openspec validate --strict` 可解析，以下关键字保持英文原样（其余叙述文本使用中文）：
  - `## Purpose`、`## Requirements`
  - `## ADDED Requirements` / `## MODIFIED Requirements` / `## REMOVED Requirements` / `## RENAMED Requirements`
  - `### Requirement:`、`#### Scenario:`

### 文档风格（Docs Style）
- 尽量使用短段落与列表，减少长篇大段叙述。
- 所有路径/文件名/命令使用反引号包裹，例如 `todo.md`、`openspec validate --strict`。
- 目录级导航：一级目录都维护 `index.md` 作为入口与索引。

### 信息架构（Information Architecture）
采用 PARA（Projects / Areas / Resources / Archive）并配合辅助目录：
- `projects/`：短期目标与明确产出
- `areas/`：长期职责与检查清单
- `resources/`：参考资料与知识沉淀
- `archive/`：已完成或不再活跃材料
- `inbox/`：未整理输入（后续整理进 PARA）
- `daily/`：每日上下文（目标/进展/决策/待办）
- `tasks/`：从 `todo.md` 提升出来、值得长期跟踪的任务
- `blog/`：写作区（`drafts/`、`posts/`、`templates/`、`assets/`）

### 待办捕获与整理（Task Capture）
- `todo.md` 是最快捕获入口：一行一项 `- [ ] ...`，强调低摩擦、随手记录。
- 小事项可直接勾选完成 `- [x] ...`。
- 每周整理：将多步事项迁移到 `tasks/` 或 `projects/<project>/`；将可沉淀的经验/原则迁移到 `areas/` 或 `resources/`；迁移后从 `todo.md` 删除或标记 migrated。

### Git 工作流（Git Workflow）
- 以小步提交为主：每次提交聚焦一个主题（例如“翻译 CLAUDE.md”）。
- OpenSpec 相关更改建议随附运行 `openspec validate --strict` 的结果（如可用）。

## 领域上下文（Domain Context）
该仓库用于辅助开发工作：记录设计思路、决策依据、任务拆解、学习资料与写作内容；与具体项目代码仓库解耦。

## 重要约束（Important Constraints）
- 不引入站点生成器/构建链路；Markdown 本身应可直接阅读。
- 尽量保持结构简单，避免引入复杂流程工具。

## 外部依赖（External Dependencies）
- OpenSpec CLI（用于 `openspec list/show/validate/archive` 等命令）
