# OpenSpec 指南

面向在本项目中使用 OpenSpec 进行“以规格驱动开发”的 AI 编程助手的工作约定。

## TL;DR 快速清单

- 搜索现有工作：`openspec spec list --long`、`openspec list`（全文检索只用 `rg`）
- 判断范围：新增 capability vs 修改既有 capability
- 选择唯一的 `change-id`：kebab-case、动词开头（`add-`/`update-`/`remove-`/`refactor-`）
- 生成目录：`proposal.md`、`tasks.md`、（仅在需要时）`design.md`、以及受影响 capability 的 delta specs
- 写 deltas：使用 `## ADDED|MODIFIED|REMOVED|RENAMED Requirements`；每个 requirement 至少一个 `#### Scenario:`
- 校验：`openspec validate [change-id] --strict` 并修复问题
- 审批闸门：提案未批准前不要开始实现

## 三阶段工作流

### 阶段 1：创建变更（Proposal）
需要创建提案的典型场景：
- 新增功能或能力
- 引入破坏性变更（API、schema）
- 改变架构或约定模式
- 性能优化且会改变行为
- 更新安全模式/策略

触发词示例：
- "Help me create a change proposal"
- "Help me plan a change"
- "Help me create a proposal"
- "I want to create a spec proposal"
- "I want to create a spec"

宽松匹配建议：
- 包含其一：`proposal`、`change`、`spec`
- 且包含其一：`create`、`plan`、`make`、`start`、`help`

可跳过提案的情况：
- Bug 修复（恢复既有预期行为）
- 拼写/排版/注释等小改动
- 不破坏兼容性的依赖更新
- 配置变更
- 为既有行为补充测试

**流程**
1. 阅读 `openspec/project.md`，并运行 `openspec list`、`openspec list --specs` 了解当前上下文。
2. 选择唯一、动词开头的 `change-id`，在 `openspec/changes/<id>/` 下生成 `proposal.md`、`tasks.md`、（可选）`design.md` 与 spec deltas。
3. 编写 spec deltas：使用 `## ADDED|MODIFIED|REMOVED Requirements`，每个 requirement 至少包含一个 `#### Scenario:`。
4. 运行 `openspec validate <id> --strict` 并在分享前解决所有问题。

### 阶段 2：实现变更（Apply）
把这些步骤当作 TODO 逐条完成：
1. **阅读 proposal.md**：理解要做什么
2. **阅读 design.md（如存在）**：确认技术决策
3. **阅读 tasks.md**：获取实现清单
4. **按顺序实现 tasks**：逐项完成
5. **确认完成**：更新状态前确保 `tasks.md` 每一项都已完成
6. **回写 checklist**：全部完成后，把每项标记为 `- [x]`，确保清单反映真实状态
7. **审批闸门**：提案未审阅/批准前不要开始实现

### 阶段 3：归档变更（Archive）
部署后，创建单独的 PR 来：
- Move `changes/[name]/` → `changes/archive/YYYY-MM-DD-[name]/`
- 如果 capability 已变更，同步更新 `specs/`
- 纯工具变更可用：`openspec archive <change-id> --skip-specs --yes`（始终显式传入 change ID）
- 运行 `openspec validate --strict` 确认归档后仍通过校验

## 开始任何任务之前

**上下文清单：**
- [ ] 阅读相关 specs：`specs/[capability]/spec.md`
- [ ] 检查 `changes/` 中是否有冲突/重叠
- [ ] 阅读 `openspec/project.md`（项目约定）
- [ ] 运行 `openspec list` 查看进行中的 changes
- [ ] 运行 `openspec list --specs` 查看现有 capabilities

**开始写 specs 之前：**
- 先确认 capability 是否已存在
- 优先修改既有 specs，避免重复能力
- 用 `openspec show [spec]` 回看当前状态
- 如果请求含糊，先问 1–2 个澄清问题再脚手架

### 搜索建议
- 枚举 specs：`openspec spec list --long`（脚本可用 `--json`）
- 枚举 changes：`openspec list`（`openspec change list --json` 已弃用但仍可用）
- 查看详情：
  - Spec：`openspec show <spec-id> --type spec`（需要过滤时用 `--json`）
  - Change：`openspec show <change-id> --json --deltas-only`
- 全文检索（ripgrep）：`rg -n "Requirement:|Scenario:" openspec/specs`

## 快速开始

### 常用 CLI 命令

```bash
# 基本命令
openspec list                  # 列出进行中的 changes
openspec list --specs          # 列出现有 specs
openspec show [item]           # 展示 change 或 spec
openspec validate [item]       # 校验 change 或 spec
openspec archive <change-id> [--yes|-y]   # 部署后归档（自动确认；非交互时加 --yes）

# 项目管理
openspec init [path]           # 初始化 OpenSpec
openspec update [path]         # 刷新指令文件

# 交互模式
openspec show                  # 交互选择
openspec validate              # 批量校验

# 调试
openspec show [change] --json --deltas-only
openspec validate [change] --strict
```

### 常用参数

- `--json`：机器可读输出
- `--type change|spec`：消歧义
- `--strict`：严格校验
- `--no-interactive`：禁用交互
- `--skip-specs`：归档时不更新 specs（仅工具变更）
- `--yes`/`-y`：跳过确认提示（非交互归档）

## 目录结构

```
openspec/
|-- project.md              # 项目约定
|-- specs/                  # 当前真相：已构建并生效的规格
|   `-- <capability>/       # 单一聚焦的 capability
|       |-- spec.md         # Requirements 与 Scenarios
|       `-- design.md       # 技术模式（可选）
`-- changes/                # 提案：将要改变什么
    |-- <change-id>/        # 某个变更提案目录
    |   |-- proposal.md     # Why / What / Impact
    |   |-- tasks.md        # 实施清单
    |   |-- design.md       # 技术决策（可选）
    |   `-- specs/          # Delta specs
    |       `-- <capability>/
    |           `-- spec.md # ADDED/MODIFIED/REMOVED/RENAMED
    `-- archive/            # 已完成并归档的 changes
```

## 创建变更提案

### 决策树

```
新请求？
├─ Bug 修复且恢复既有 spec 行为？ -> 直接修复
├─ 拼写/排版/注释？               -> 直接修复
├─ 新功能/新 capability？         -> 创建提案
├─ 破坏性变更？                   -> 创建提案
├─ 架构/模式调整？                -> 创建提案
└─ 不明确？                       -> 创建提案（更安全）
```

### 提案结构

1. **创建目录：** `changes/[change-id]/`（kebab-case、动词开头、唯一）

2. **编写 proposal.md：**
```markdown
# Change: [变更的简要描述]

## Why
[1–2 句描述问题/机会]

## What Changes
- [变更点列表]
- [破坏性变更用 **BREAKING** 标注]

## Impact
- Affected specs: [capability 列表]
- Affected code: [关键文件/系统]
```

3. **Create spec deltas:** `specs/[capability]/spec.md`
```markdown
## ADDED Requirements
### Requirement: New Feature
The system SHALL provide...

#### Scenario: Success case
- **WHEN** user performs action
- **THEN** expected result

## MODIFIED Requirements
### Requirement: Existing Feature
[Complete modified requirement]

## REMOVED Requirements
### Requirement: Old Feature
**Reason**: [Why removing]
**Migration**: [How to handle]
```
如果影响多个 capability，则在 `changes/[change-id]/specs/<capability>/spec.md` 下创建多个 delta 文件（每个 capability 一个）。

4. **创建 tasks.md：**
```markdown
## 1. Implementation
- [ ] 1.1 Create database schema
- [ ] 1.2 Implement API endpoint
- [ ] 1.3 Add frontend component
- [ ] 1.4 Write tests
```

5. **在需要时创建 design.md：**
满足以下任一条件则创建 `design.md`，否则可以省略：
- 跨多个服务/模块的横切变更，或引入新的架构模式
- 新增外部依赖，或显著的数据模型变更
- 安全/性能/迁移方面存在复杂度
- 在编码前需要先明确技术决策以消除歧义

最小 `design.md` 模板：
```markdown
## Context
[Background, constraints, stakeholders]

## Goals / Non-Goals
- Goals: [...]
- Non-Goals: [...]

## Decisions
- Decision: [What and why]
- Alternatives considered: [Options + rationale]

## Risks / Trade-offs
- [Risk] -> Mitigation

## Migration Plan
[Steps, rollback]

## Open Questions
- [...]
```

## Spec 文件格式

### 关键：Scenario 格式

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

每个 requirement MUST 至少包含一个 scenario。

### Requirement 措辞
- 规范性要求使用 SHALL/MUST（除非刻意写成非规范，否则避免 should/may）

### Delta 操作类型

- `## ADDED Requirements` - 新增能力
- `## MODIFIED Requirements` - 修改行为
- `## REMOVED Requirements` - 移除/废弃能力
- `## RENAMED Requirements` - 重命名

标题匹配使用 `trim(header)`：忽略首尾空白。

#### 何时使用 ADDED vs MODIFIED
- ADDED：引入可独立成立的新 capability（或子 capability）。当变更是正交新增（例如添加 “Slash Command Configuration”）而不是改变既有 requirement 语义时，优先使用 ADDED。
- MODIFIED：修改既有 requirement 的行为、范围或验收标准。务必粘贴完整且更新后的 requirement 内容（标题 + 全部 scenarios）。归档器会用你提供的内容整体替换该 requirement；如果只提供局部 delta，会在归档时丢失旧细节。
- RENAMED：仅当“只改名字、不改语义”时使用；如果同时改变行为，请使用 RENAMED（改名）+ MODIFIED（内容），并在 MODIFIED 中引用新的名称。

常见坑：用 MODIFIED 新增一个关注点，但没有包含旧的文本。这样在归档时会丢失细节。如果你并不是在“显式修改既有 requirement”，请改为在 ADDED 下新增一个 requirement。

正确编写 MODIFIED requirement 的步骤：
1) 在 `openspec/specs/<capability>/spec.md` 中定位既有 requirement。
2) 复制整个 requirement 块（从 `### Requirement: ...` 到其下所有 scenarios）。
3) 粘贴到 `## MODIFIED Requirements` 下并编辑为新行为。
4) 确保标题文本匹配（忽略空白差异），且至少保留一个 `#### Scenario:`。

RENAMED 示例：
```markdown
## RENAMED Requirements
- FROM: `### Requirement: Login`
- TO: `### Requirement: User Authentication`
```

## 故障排查

### 常见错误

**“Change must have at least one delta”**
- 检查 `changes/[name]/specs/` 是否存在且包含 `.md` 文件
- 确认文件包含操作前缀（例如 `## ADDED Requirements`）

**“Requirement must have at least one scenario”**
- 场景必须使用 `#### Scenario:`（四个 `#`）
- 不要用 bullet 或加粗来当场景标题

**Scenario 解析悄然失败**
- 必须严格匹配：`#### Scenario: Name`
- 用 `openspec show [change] --json --deltas-only` 调试

### 校验小技巧

```bash
# 严格校验（建议默认使用）
openspec validate [change] --strict

# 调试 delta 解析
openspec show [change] --json | jq '.deltas'

# 查看某个 spec
openspec show [spec] --json -r 1
```

## 推荐流程脚本

```bash
# 1) 探索当前状态
openspec spec list --long
openspec list
# 可选全文检索：
# rg -n "Requirement:|Scenario:" openspec/specs
# rg -n "^#|Requirement:" openspec/changes

# 2) 选择 change id 并生成目录
CHANGE=add-two-factor-auth
mkdir -p openspec/changes/$CHANGE/{specs/auth}
printf "## Why\n...\n\n## What Changes\n- ...\n\n## Impact\n- ...\n" > openspec/changes/$CHANGE/proposal.md
printf "## 1. Implementation\n- [ ] 1.1 ...\n" > openspec/changes/$CHANGE/tasks.md

# 3) 添加 deltas（示例）
cat > openspec/changes/$CHANGE/specs/auth/spec.md << 'EOF'
## ADDED Requirements
### Requirement: Two-Factor Authentication
Users MUST provide a second factor during login.

#### Scenario: OTP required
- **WHEN** valid credentials are provided
- **THEN** an OTP challenge is required
EOF

# 4) 校验
openspec validate $CHANGE --strict
```

## 多 capability 示例

```
openspec/changes/add-2fa-notify/
|-- proposal.md
|-- tasks.md
`-- specs/
    |-- auth/
    |   `-- spec.md   # ADDED: Two-Factor Authentication
    `-- notifications/
        `-- spec.md   # ADDED: OTP email notification
```

auth/spec.md
```markdown
## ADDED Requirements
### Requirement: Two-Factor Authentication
...
```

notifications/spec.md
```markdown
## ADDED Requirements
### Requirement: OTP Email Notification
...
```

## 最佳实践

### 简单优先
- 默认新增代码 <100 行
- 在证明不足前优先单文件实现
- 没有明确理由不要引入框架
- 选择朴素、成熟的模式

### 何时引入复杂度
仅在以下情况引入复杂度：
- 有性能数据表明当前方案太慢
- 有明确规模要求（>1000 用户、>100MB 数据等）
- 有多个已验证用例确实需要抽象

### 清晰引用
- 代码位置引用使用 `file.ts:42` 形式
- 规格引用使用 `specs/auth/spec.md`
- 关联变更与 PR 要能互相追溯

### Capability 命名
- 动词-名词：`user-auth`、`payment-capture`
- 单一目的
- 10 分钟可理解原则
- 如果描述里出现 “AND”，考虑拆分

### Change ID 命名
- kebab-case、短且描述性：`add-two-factor-auth`
- 动词开头：`add-`、`update-`、`remove-`、`refactor-`
- 确保唯一；冲突时追加 `-2`、`-3` 等

## 工具选择参考

| 任务 | 工具 | 原因 |
|------|------|-----|
| 按模式找文件 | Glob | 速度快 |
| 全文检索 | Grep | 正则与性能更好 |
| 读取指定文件 | Read | 直接获取上下文 |
| 探索未知范围 | Task | 适合多步调查 |

## 错误恢复

### Change 冲突
1. 运行 `openspec list` 查看进行中的 changes
2. 检查是否存在重叠 specs
3. 与变更负责人协调
4. 视情况合并/拆分提案

### 校验失败
1. 使用 `--strict`
2. 查看 JSON 输出定位问题
3. 确认 spec 文件格式
4. 确认 scenarios 头部格式正确

### 上下文缺失
1. 先读 `project.md`
2. 查看相关 specs
3. 查看最近归档
4. 提问澄清

## 快速参考

### 阶段标识
- `changes/`：提案阶段（将要改变什么）
- `specs/`：已构建并生效的规范（真相来源）
- `archive/`：已完成变更的归档

### 文件用途
- `proposal.md`：为什么/做什么
- `tasks.md`：实现步骤清单
- `design.md`：技术决策
- `spec.md`：需求与行为

### CLI 备忘
```bash
openspec list              # 当前进行中？
openspec show [item]       # 查看详情
openspec validate --strict # 是否通过校验？
openspec archive <change-id> [--yes|-y]  # 归档（自动确认；自动化可加 --yes）
```

记住：Specs 是真相；Changes 是提案；保持同步。
