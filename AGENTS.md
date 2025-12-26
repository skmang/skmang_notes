<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Project Overview

本文件用于给AI Agent在本仓库中工作时提供指引。
这是一个由 **OpenSpec** 管理的文档仓库（AI 原生、以规范驱动开发的工作流）。本仓库使用 OpenSpec 以结构化方式管理变更（changes）、规格（specs）与提案（proposal）。

## OpenSpec CLI Commands

### Essential Commands

```powershell
# List active changes
openspec list

# List specifications
openspec list --specs

# Show details of a change or spec
openspec show <change-id>

# Validate a change strictly
openspec validate <change-id> --strict

# Archive a completed change after deployment
openspec archive <change-id> --yes

# Interactive dashboard
openspec view
```

### Validation and Debugging

```powershell
# Show delta details for a change
openspec show <change-id> --json --deltas-only

# Validate all changes
openspec validate --strict

# Show specification details
openspec show <spec-id> --type spec
```

## OpenSpec Workflow

### Three-Stage Process

1. **创建变更（提案阶段 / Proposal Stage）**
   - 使用 `/openspec:proposal` 或遵循 `openspec/AGENTS.md`
   - 生成脚手架：`proposal.md`、`tasks.md`、（可选）`design.md`、以及 delta spec
   - 使用 `openspec validate <change-id> --strict` 进行严格校验
   - 提案阶段不要编写实现代码

2. **实现变更（应用阶段 / Apply Stage）**
   - 使用 `/openspec:apply`
   - 阅读 `proposal.md`、（如有）`design.md` 与 `tasks.md`
   - 按 `tasks.md` 顺序逐条完成
   - 完成后更新 checklist

3. **归档变更（Archive Stage）**
   - 使用 `/openspec:archive`
   - 运行 `openspec archive <change-id> --yes`
   - CLI 会校验并将变更移动到 `changes/archive/`
   - 同步更新主规格（`specs/`）

### When to Create Proposals

**应创建提案的情况：**
- 添加新功能或能力
- 引入破坏性变更（API、schema 等）
- 调整架构或约定模式
- 性能优化且会改变行为
- 更新安全模式/策略

**可跳过提案的情况：**
- 修复 bug（恢复既有预期行为）
- 拼写/排版/注释等小改动
- 不破坏兼容性的依赖更新
- 配置变更
- 为既有行为补充测试

## 目录结构

```
openspec/
|-- AGENTS.md                # OpenSpec 工作流说明
|-- project.md               # 项目约定与上下文
|-- specs/                   # 当前真相：已构建并生效的规范
|   `-- <capability>/
|       |-- spec.md          # 需求与场景
|       `-- design.md        # 技术模式（可选）
`-- changes/                 # 变更提案：将要改变什么
    |-- <change-id>/
    |   |-- proposal.md      # 为什么/做什么/影响
    |   |-- tasks.md         # 实施清单（checklist）
    |   |-- design.md        # 技术决策（可选）
    |   `-- specs/           # Delta 规格（按 capability 分目录）
    |       `-- <capability>/
    |           `-- spec.md
    `-- archive/             # 已完成并归档的变更

.claude/commands/openspec/
|-- proposal.md              # `/openspec:proposal` 指令定义
|-- apply.md                 # `/openspec:apply` 指令定义
`-- archive.md               # `/openspec:archive` 指令定义
```

## Spec 文件格式

### 关键的 Scenario 格式

**正确示例**（使用 `####` 标题）：
```markdown
#### Scenario: User login success
- **WHEN** valid credentials provided
- **THEN** return JWT token
```

**错误示例**（不要用 bullet 或加粗来当场景标题）：
```markdown
- **Scenario: User login**  ❌
**Scenario**: User login     ❌
### Scenario: User login      ❌
```

### Delta 操作类型

- `## ADDED Requirements` - 新增能力
- `## MODIFIED Requirements` - 修改行为（务必包含完整的更新后 requirement）
- `## REMOVED Requirements` - 移除/废弃能力
- `## RENAMED Requirements` - 仅重命名（不改语义）

### ADDED vs MODIFIED 使用建议

- 新增且相互独立的能力用 **ADDED**（例如 “Slash Command Configuration”）
- 修改既有 requirement 的行为用 **MODIFIED**
- 使用 **MODIFIED** 时需要包含完整 requirement 文本（更新后的版本）

## Change ID 与 Capability 命名

- **Change IDs**：kebab-case、动词开头、唯一（例如 `add-two-factor-auth`、`update-auth-flow`）
- **Capabilities**：动词-名词、单一目的（例如 `user-auth`、`payment-capture`）
- 创建前用 `openspec list` 检查是否已存在

## 搜索

```powershell
# List all specs
openspec spec list --long

# Full-text search for requirements
rg -n "Requirement:|Scenario:" openspec/specs

# Search changes
rg -n "^#|Requirement:" openspec/changes
```

## 护栏

- 优先采用直观、最小的实现
- 只有在确有必要时才引入复杂度
- 变更范围保持紧贴请求目标
- 分享提案前务必用 `--strict` 校验
- 细节约定以 `openspec/AGENTS.md` 为准

## OpenSpec 指令块

`CLAUDE.md` 与 `AGENTS.md` 中的 `<!-- OPENSPEC:START -->` / `<!-- OPENSPEC:END -->` 块由 OpenSpec CLI 管理。不要手工编辑这些块；请使用 `openspec update [path]` 刷新。
