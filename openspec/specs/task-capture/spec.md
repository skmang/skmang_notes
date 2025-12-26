# task-capture

## Purpose
提供一个快速、低摩擦的机制，用于在开发过程中捕获临时待办，并通过轻量整理将其提升到更结构化的位置；以 `todo.md` 作为最快入口，并约定定期迁移到 `tasks/` 或 `projects/` 的流程。

## Requirements

### Requirement: 提供快速、低摩擦的待办捕获入口
仓库 MUST 提供一个单一且快速的入口，用于在开发过程中捕获临时待办事项。

#### Scenario: 10 秒内捕获一条待办
- **GIVEN** 开发者在开发中产生一个新任务想法
- **WHEN** 打开仓库
- **THEN** 可以通过在仓库根目录的 `todo.md` 末尾追加一行 checkbox 来记录它

### Requirement: 支持轻量完成与定期整理
待办机制 MUST 支持快速完成，并支持定期将事项整理到更结构化的位置。

#### Scenario: 将小任务标记为完成
- **GIVEN** 某条待办已完成
- **WHEN** 开发者更新 `todo.md`
- **THEN** 可以使用 checkbox 约定标记完成（例如 `- [x] ...`）

#### Scenario: 将事项提升到结构化计划
- **GIVEN** 某条待办需要多步推进或需要更长时间跟踪
- **WHEN** 开发者进行每周整理
- **THEN** 可以将该事项移动到 `tasks/` 或合适的 `projects/` 区域
- **AND** 在 `todo.md` 中删除该事项或标记为已迁移
