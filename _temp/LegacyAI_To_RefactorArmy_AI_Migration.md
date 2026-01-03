# 旧 AI（NodeCanvas 行为树）迁移到新军团（Army Jobs）方案（提案阶段）

> 范围：仅输出设计/架构/迁移指导/功能 Check 清单，不写代码。  
> 关联 OpenSpec：`openspec/changes/add-hybrid-stream-army-ai/`（本文作为该提案的“迁移落地说明”）。

---

## 0. 目标与约束

### 0.1 业务目标（玩法一致性）
- **玩法层面复刻**旧 AI 行为：军团战术（跟随/坚守/攻击/巡逻）驱动单位决策；单位在不同战术下表现不同。
- **保留关键手感**：追击/锁定追击、对峙/绕行距离、脱战、阵型回归、一次性目标点、技能释放（普攻/跑动攻击/待释放技能）。
- **保持旧资产可迁移**：尽可能复用 `Profile/AIProfile/*` 下的配置与行为树结构，避免全量手工重做。

### 0.2 性能目标（可扩展性）
- 支撑 **2000+ 单位**同屏（或同战斗上下文）时，AI 计算主要在 **Job/Burst** 中完成，主线程只做 **Apply/桥接**。
- 避免“每单位一棵完整行为树 Tick”的 **O(N·NodeCount)** 面向对象调度开销与 GC/虚调用风暴。

### 0.3 技术约束（与新军团当前实现对齐）
当前新军团（`Assets/Script/Refactor/BattleCompatibility/Army`）已有：
- **双缓冲 SOA 数据中心**：`CY.Refactor.ArmySystem.ArmySimulationData`
- **PreUpdate/LogicUpdate 时序**：`CY.Refactor.ArmySystem.ArmyService`
- **空间哈希**（供查询）：`ArmySpatialHashPass`（在 PreUpdate 同步构建）
- **命令缓冲**（PreUpdate 安全写）：`CY.Refactor.ArmySystem.CommandBuffer.ArmyCommandBuffer`

因此，新 AI 必须满足：
- Job 阶段 **不得访问 UnityObject/引用类型**（Transform/GameObject/BattleObject…）。
- AI 输出使用 **“Job 写缓冲 + 主线程 Apply”** 的模式，且要与 `ArmyService.OnBattlePreUpdate` 的命令执行顺序对齐，避免多帧延迟。

---

## 1. 现状：旧 AI 的结构与瓶颈（按模块拆解）

> 本节目标：把“旧 AI 到底提供了什么能力”拆成可迁移模块，并把复刻要点写清楚（为什么这么做、边界是什么、依赖哪些状态/数据）。

### 1.1 行为树资产与黑板（NodeCanvas）

**结构**
- 军团级：`Assets/Script/Battle/ArmySystem/ArmyComponent/ArmyAIComponent/ArmyAIComponent.cs`
  - 每个 Army 创建一个 `BehaviourTreeOwner`
  - 黑板：`Profile/AIProfile/Army/ArmyBlackboard`
  - 行为树：`Profile/AIProfile/Army/<armyData.aiProfilePath>`
- 单位级（HumanGrass）：`Assets/Script/Battle/BattleObject/HumanGrass/HumanGrassComponent/HumanGrassAIComponent/HumanGrassAIComponent.cs`
  - 每个 HumanGrass 创建一个 `BehaviourTreeOwner`
  - 黑板：`Profile/AIProfile/HumanGrass/HGBlackboard`
  - 行为树：`<characterData.aiProfilePath>`

**关键黑板 Key（代码常量）**
- `CY.Refactor.Battle.BattleConstant`：`Assets/Script/Refactor/BattleCompatibility/Utils/BattleConstant.cs`
  - `ownerUnit`：行为树运行主体（Army 或 LegacyHumanGrass）
  - `army`：所属军团
  - `player`：本地玩家
  - `humanGrassList`：军团内单位列表（仅旧 HumanGrass 军团）
  - `isPathFinding` / `isLockChaseTarget`：共享布尔开关（被 `TacticService` 广播）

**复刻指导要点**
- **黑板是“状态同步协议”**：旧树中大量节点通过黑板获取 Army/Player/Owner；新体系必须给出等价的“读数据入口”，否则迁移会变成“逐节点改代码”。
- **资产路径/配置仍要可复用**：迁移目标不是把树原样跑在新单位上，而是尽量让同一套配置能被“导出/编译”为新 JobGraph/规则表。

---

### 1.2 军团 AI 服务层（Aggro/Perception/Targeting/Movement/Tactic）

旧服务集中在 `Assets/Script/Battle/AI/Imp/`，由 `ArmyAIComponent` 初始化并被 NodeCanvas 任务调用：
- `AggroService`：配置驱动的“敌方军团仇恨值”选择（MaxAggro + 最近距离）
- `PerceptionService`：感知/状态聚合（全员到达目标、是否存在脱离控制单位）
- `TargetingService`：军团目标管理（目标兵团、一次性目标点、给可控单位分配目标）
- `MovementService`：通过 `OrderSystem.CommandRouter` 下发军团移动/保持
- `TacticService`：战术类型、战斗状态（BattleArea 小地图事件）、AI 启停、共享布尔广播

**复刻指导要点（必须保留的语义）**
- **战术类型是“军团级开关”**：`EArmyTacticType`（跟随/坚守/攻击/巡逻…）是单位逻辑分叉的第一层条件（`AICheckArmyTacticType`）。
- **战斗状态管理是军团的副产物**：`TacticService.SetBattling` 触发小地图 BattleArea Create/Destroy；并且有 `TickAutoExitBattle` 的兜底逻辑（每 1 秒补触发一次退出检查）。
- **目标管理有“军团/单位两层”**：
  - 军团 `targetArmy` 代表“战略目标”（常用于移动/追击）
  - 单位 `TargetObject`/`ConfrontationObject` 代表“战术目标/对峙目标”
- **“一次性目标点”是高优先级覆盖**：用于短时引导单位去某个点（例如阵型重整/技能释放前站位）。

---

### 1.3 控制权与“脱离控制”单位（ControlAuthorityManager）

**结构**
- `Assets/Script/Battle/AI/Core/ControlAuthorityManager.cs`
- 每单位一个状态记录：`Army / SelfCombat / Special`
- 重要行为：
  - `CanReceiveArmyCommand`：只有 `Army` 状态可接收
  - `CanReceiveForceArmyCommand`：玩家阵营可强制命令（除 `Special`）
  - `EnterCombat/LeaveCombat`：进入自主战斗后短时不受军团指令

**复刻指导要点**
- 这是旧 AI 里“军团指令与单位自主战斗冲突”的核心仲裁层；新 AI 必须把它变成 **SOA 可并行的数据**，否则 2000+ 单位会被 Dictionary 查询拖垮。

---

### 1.4 单位 AI（HumanGrass）核心能力模块

旧单位 AI 的主要能力来自：
- `HumanGrassAIComponent`（大量状态与查询/缓存）
- NodeCanvas Tasks（`Assets/Script/Battle/AI/NodeCanvas/Tasks/`，共 89 个 .cs）

建议按“决策链”拆成 6 个可迁移模块：

#### 1.4.1 感知/索敌（空间查询）
代表任务：
- `AIHasEnemyAroundNew`：半径/索敌范围内是否有敌人
- `AICheckTargetInSearchRangeNew`：目标是否仍在索敌范围
- `AIMarkedNearestTargetObjectNew`：选最近敌人并标记

复刻要点：
- 旧实现往往通过 **遍历列表** 获取敌人；新实现必须基于 `ArmySpatialHashPass` 的 `spatialHashMap/predictedSpatialHashMap` 做 Job 查询。

#### 1.4.2 目标与对峙（Target/Confrontation）
代表任务：
- `AIConfrontTargetNew`：对峙持续时间 + 待机冷却
- `AIFallBackTargetNew`：围绕对峙目标保持随机绕行距离（OrbitDistance）
- `AIDisengageBattleNew`：清目标并脱战

复刻要点：
- 对峙/绕行不是“简单站桩”：它有 **随机距离缓存**、**目标半径叠加**、**上下界容差** 与动画切换条件。
- 新 AI 需要把这些变成“可并行计算的标量参数”，并在 Apply 阶段把结果转成移动/朝向意图。

#### 1.4.3 移动（追击/回归阵型/只看目标点）
代表任务：
- `AIChaseTargetNew`：根据目标对象/目标点/对峙目标三选一移动；可带 timeLimit
- `AIReturnFormationPositionNew`：回归队列点；支持一次性目标点覆盖
- `AISetTargetPositionNew`：设置目标点（可只设置一次）

复刻要点：
- 旧移动是“单位级 NavMesh/避障 + 动画状态机”；新军团的杂兵移动主要由仿真 Job 推进（Steering/Constraint），AI 输出应尽量落在 **Army VirtualAnchor + Formation** 层，而不是每单位 NavMesh。

#### 1.4.4 攻击/技能（Combat）
代表任务：
- `AICastNormalSkill`：普攻（并通知军团进入战斗）
- `AICastPendingSkill`：释放军团 pendingSkill
- `AIAutoCastSkillNew`：技能检测与上报（`CheckAndReportSkill`）

复刻要点：
- 新军团当前 `ArmyCommandBuffer` 只覆盖 Move/Hold/Formation/ControlMode；要复刻旧 AI 的技能/攻击，需要引入 **AI 专用 CommandBuffer**（Job 写 -> Apply 时触发 Ability/Combat）。

#### 1.4.5 模式切换（地面/空中/两栖）
代表任务：
- `AIAutoSwitchGroundOrAirModeNew`、`AIIsAirModeNew`、`AICheckTargetIsGroundModeNew` 等

复刻要点：
- 旧逻辑以 `moveZone` + `airDefaultHeight` + 动画 Override 为条件；新杂兵若仍依赖同一套动画/移动组件，Apply 时要保留“模式切换”入口（但决策计算放 Job）。

#### 1.4.6 QA/调试开关与事件副作用
典型点：
- `QATool.Instance.isDisableEnemyAI/isDisablePlayerAI`
- `TacticService` 的 BattleArea 事件创建/销毁 + 兜底定时检查

复刻要点：
- 这些副作用必须保留在 **主线程 Apply**，并保证可开关、可定位（例如输出栈、日志节流）。

---

## 2. 新架构：面向大规模单位的“混合 AI 管线”（可快速迁移）

> 设计主张：把旧 BT 的“控制流”转成 **批处理数据流**，让“条件判断/筛选/选择/意图写入”都可在 Job 内并行执行。

### 2.1 总体分层（Minion/Elite 二元分治）

#### Minion（杂兵，2000+）
- **执行模型**：JobGraph（流式 DAG）
- **输入**：`ArmySimulationData` 的只读视图（位置/速度/阵型/空间哈希…）+ AI 配置快照（Native）
- **输出**：`ArmyAICommandBuffer`（Native、可 Job 写）
- **落地**：PreUpdate Apply 阶段把 AI 指令转成 `ArmyCommandBuffer`（Move/Hold/Formation/ControlMode…）与 Ability/Combat 调用

#### Elite（精英/Boss，少量）
- **执行模型**：ClassicGraph（OOP）
  - 优先复用既有 `AIGraph/LogicGraphService`（`CY.Refactor.ArmySystem.Army.aiGraph`）
  - 或继续跑 NodeCanvas（数量少时可接受）
- **约束**：必须通过同一套“命令/状态桥接”写入军团与单位，禁止直接改 Native 数据

---

### 2.2 JobGraph 的核心表示：把 BT 变成“索引流 + 依赖链”

#### 2.2.1 节点类型（迁移的最小集合）
- **FilterNode（条件筛选）**：输入一批 unitIndex，输出满足条件的子集
  - 对应旧 BT 的 ConditionTask（如 `AIHasEnemyAroundNew`、`AIIsInNormalAttackRange`）
- **SelectNode（选择/分配）**：为单位写入“目标/对峙/目标点”等中间结果
  - 对应旧 BT 的“选最近目标/分配目标”（如 `AIMarkedNearestTargetObjectNew`）
- **ActionNode（意图写入）**：把“要做什么”写到 AICommandBuffer（Move/Attack/Skill/ReturnFormation…）
  - 对应旧 BT 的 ActionTask（如 `AIChaseTargetNew`、`AICastNormalSkill`）
- **Merge/UnionNode（合并流）**：把多个分支流合并回主流（用于 Selector/Parallel 的近似表达）

#### 2.2.2 迁移策略：Selector 优先（最像 BT，最快落地）
旧 BT 的常见结构是“多段条件 + 行为选择”：
- **BT Selector**：从上到下，第一个成功的分支生效

在 JobGraph 中建议表达为：
1) 初始流 = Army 内全部可参与 AI 的单位索引
2) 分支 A：Filter(条件 A) -> Action(A) -> 标记已决策
3) 剩余流 = 初始流 - 已决策
4) 分支 B：Filter(条件 B) -> Action(B) -> …

这样能最大程度复刻“先后顺序”语义，同时满足并行计算（每个 Filter/Action 仍是并行 for）。

---

### 2.3 时序绑定：确保 1 帧延迟且不引入 2 帧延迟

新军团当前 PreUpdate 顺序（`ArmyService.OnBattlePreUpdate`）：
1) `_simulationHandle.Complete()`
2) `ArmyCommandBuffer.ExecuteAll(...)`
3) `SwapBuffers()`
4) `PrepareData()`
5) `ApplyPerArmyNativeData()`
6) `ArmySpatialHashPass.Schedule(...).Complete()`

要实现“AI 本帧 Apply 生效（仅 1 帧延迟）”，建议把 AI 接入点定义为：
- **LogicUpdate（本帧）**：Schedule JobGraph，写入 `ArmyAICommandBuffer`
- **PreUpdate（下一帧）**：在 `ArmyCommandBuffer.ExecuteAll` *之前*：
  - Complete 上一帧 AI JobHandle
  - 读取 `ArmyAICommandBuffer`，转成 `ArmyCommandBuffer.Enqueue(...)` 与 OOP 行为触发
  - 再执行 `ArmyCommandBuffer.ExecuteAll`，保证命令本帧落地

> 关键点：如果 Apply 放在 `ExecuteAll` 之后，会导致命令只能下帧执行，从 1 帧延迟变成 2 帧延迟。

---

## 3. 迁移路径：按模块“从旧到新”怎么做（指导性细节）

> 本节用“旧模块 -> 新模块”的方式写迁移动作，强调：需要新增哪些数据、在哪里计算、在哪里落地、副作用放哪一层。

### 3.1 行为树资产迁移（NodeCanvas -> JobGraph/规则表）

**推荐最省人力的路线：导出/编译，而非手工重写**
1) **冻结旧节点语义**：以 `Assets/Script/Battle/AI/NodeCanvas/Tasks/*` 为“事实来源”，梳理出：
   - 输入：读取哪些状态（目标/距离/阵营/模式/是否可命令…）
   - 输出：写哪些状态（TargetObject/Confrontation/TargetPosition/模式切换/技能触发…）
2) **定义 JobGraph IR**（中间表示）：
   - Condition = Filter 描述（需要哪些字段）
   - Action = 写入哪类 AI 意图（Move/Attack/Skill/SetTarget…）
   - BT 结构 = Selector/Sequence 的连接关系
3) **Editor 导出器**：
   - 输入：NodeCanvas BehaviourTree 资产
   - 输出：JobGraphAsset（仅包含支持的节点）
   - 不支持节点：标记为“需要 Elite/OOP 管线处理”或“需要新节点实现”

**这样做的价值**
- 保留旧策划/关卡配置，不用重新搭一套 AI 资产体系。
- 迁移成本从“逐单位改逻辑”变成“补齐导出映射与少量节点实现”。

---

### 3.2 Aggro（仇恨）迁移

旧：
- `AggroService.GetMaxAggroArmyList()`：读取 `AggroProfile` + `armyData.aggroGroupId`，计算最大仇恨的敌军团列表
- `TargetingService.SetNearestMaxAggroArmyTarget()`：在最大仇恨列表里选最近者，找不到则回退到玩家

新（建议）：
- **数据侧**：把 `AggroProfile` 预编译成 Native 可读表（按 `aggroGroupId` 索引）
- **计算侧**（Job）：
  1) per-army：对候选敌军团算 `aggroScore`（查表）并找 max
  2) per-army：在 maxAggro 组内再找最近（用 `armyAnchor/armyAreaStat.center`）
- **落地侧**（Apply）：
  - 更新 Army 的“战略目标”（等价于旧 `targetArmy`）
  - 对需要“锁定追击”的战术，输出 `IssueMove` 的目标点与最终朝向

必须保留的旧语义：
- “仇恨优先，距离次之”
- “无敌军团时回退到玩家”（旧逻辑写死了 localPlayer）

---

### 3.3 Perception（感知聚合）迁移

旧：
- `IsAllUnitArriveTargetPosition()`：遍历 `aliveUnitList` 比较 `targetPosition/worldPosition`
- `IsHaveUnitOutOfControl()`：遍历 `canOrderUnitList` 询问 `ControlAuthorityManager`

新（建议）：
- **目标到达判定**：用 unitIndex 批处理，写入 `ArmyAIState.allArrived`（或直接写一个计数）
- **脱离控制判定**：把控制权变成 `UnitAIState.controlAuthority` 的 Native 数组，Job 内统计是否存在非 Army 状态

必须保留的旧语义：
- 巡逻到达判定使用巡逻半径（旧：`LevelPatrolPoint.pointRadius`）

---

### 3.4 Targeting（目标管理）迁移

旧：
- `AssignTargetArmyToHumansWithoutControl()`：把失控单位的目标收集起来，随机分配给可控单位
- `ClearTargetObjectForAliveHG()`：清目标、清对峙对象，并在玩家阵营时额外清 `targetArmy`
- `SetOnlyOnceTargetPosition()`：给所有单位写一次性目标点

新（建议）：
- **目标分配**（Job）：
  - 维护 `UnitAIState.targetId/confrontId`
  - “随机分配”改为“伪随机但可并行”的方式（例如 hash(unitId, frame)）
- **一次性目标点**：
  - 存在 `UnitAIState.onlyOnceTargetPos + expireTime`（或 expireFrame）
  - Job 侧只读 `isActive`，优先用该目标点产生 Move 意图
- **清理**（Apply）：
  - 清理必须在主线程做（涉及 BattleObject 目标引用、事件、副作用）

必须保留的旧语义：
- 玩家阵营“清目标”会清军团目标；敌方不一定清（避免 AI 失去战略目标）

---

### 3.5 Movement/Formation（移动/阵型/巡逻/跟随）迁移

旧：
- 军团移动通过 `MovementService` -> `CommandRouter.ExecuteAIMoveCommand/ExecuteAIHoldCommand`
- 巡逻由 `ArmyPathFindingComponent` 驱动：开始巡逻、到点换下一个点、循环/非循环差异
- `AISetPlayerAsTargetPosition`：把玩家位置作为目标点，并且把最终朝向设置为相机 forward 的 XZ

新（建议）：
- **Move/Hold**：统一通过 `ArmyCommandBuffer`：
  - `CommandIssueMove.Send(armyId, targetPos, finalRot, setFinalRotation)`
  - `CommandIssueHold.Send(armyId)`
- **巡逻**：
  - 巡逻点序列属于“低频策略”，可以保留在托管层（主线程）但只输出目标点给 JobGraph
  - 或把巡逻路径预转成 Native 数组（更纯粹，但实现成本更高）
- **跟随玩家**：
  - per-army 只输出一个 `targetPos=playerPos`，finalRot=cameraForwardXZ

必须保留的旧语义：
- `keepDistance`：移动到目标军团时可保持距离（`AIArmyMoveToTargetArmy.keepDistance`）

---

### 3.6 Combat（战斗/技能/对峙）迁移

旧：
- 单位普攻/跑动攻击/技能触发都在 OOP 层（动画状态机 + skillComponent）
- 进入战斗会通知 `ArmyAIComponent.tacticService.SetBattling(true)`，带来 BattleArea/对白提示等副作用

新（建议）：
- **决策在 Job，执行在 Apply**：
  - Job 输出：`UnitActionType = AttackNormal/RunAttack/CastSkill/Confront/Disengage...`
  - Apply：
    - 触发对应 Ability/动画/skillComponent
    - 统一处理“进入战斗/退出战斗”的事件副作用与节流兜底
- **对峙/绕行**：
  - Job 计算 desiredOrbitDistance、方向与目标点（或朝向）
  - Apply 只负责把意图落到“移动输入/动画切换”入口（不在 Job 里碰状态机）

必须保留的旧语义：
- `AIConfrontTargetNew` 的“对峙持续时间 + 冷却”
- `AIFallBackTargetNew` 的“距离上下界 + 随机 orbit 距离缓存”

---

### 3.7 ControlAuthority（控制权）迁移

旧：
- Dictionary 存储，查询频繁
- 玩家阵营支持“强制命令”绕过 SelfCombat（除 Special）

新（建议）：
- 用两层状态表达：
  1) **高层控制权**：`UnitAIState.controlAuthority`（Army/SelfCombat/Special）
  2) **仿真控制模式**：`UnitGameplayState.mode`（NativeSimulation/ManagedGameplay）
- Apply 时用 `CommandSetUnitControlMode` 同步 `mode`，并保证切回 Native 时重置移动输入（现有命令已包含这层保护）

必须保留的旧语义：
- 玩家阵营强制命令的例外规则（只有 Special 不可强制）

---

## 4. 旧 NodeCanvas Tasks 到新 JobGraph 节点的迁移对照（建议版）

> 目的：提供“怎么迁移”而不是“迁移后类名必须一致”。因此这里用“推荐节点类型/推荐输出意图”的方式给映射。

### 4.1 Army 侧（军团行为树任务）

| 旧 Task | 旧语义摘要 | 新侧推荐映射 |
|---|---|---|
| `AISetMaxAggroArmyTarget` | 选最近且最大仇恨敌军团 | per-army `SelectAggroTargetNode`（Job）+ Apply 更新战略目标 |
| `AIArmyMoveToTargetArmy` | 向目标军团移动（可保持距离） | per-army `MoveToArmyTargetNode` -> `IssueMove` |
| `AIArmyStartPatrol` | 开始巡逻 | 主线程策略层维护巡逻状态，Job 只读 `patrolTarget` |
| `AIArmySetTargetAsNextPatrolPoint` | 到点切换下一个巡逻点 | 主线程策略层（低频） |
| `AISetPlayerAsTargetPosition` | 玩家位置作为目标点 + 相机朝向 | per-army `FollowPlayerNode` -> `IssueMove(setFinalRotation=1)` |
| `AIArmyCastPendingSkill` | 释放军团 pendingSkill | per-army `CastPendingSkillNode`（Apply 触发） |
| `AIStopArmyCurrentSkill` | 停止当前技能 | per-army `StopSkillNode`（Apply） |
| `AIArmyAssignTargetToHGWithoutTarget` | 失控单位目标 -> 分配给可控单位 | `AssignTargetsFromOutOfControlNode`（Job，伪随机） |
| `AICheckArmyTacticType` | 检查战术类型 | `FilterByArmyTacticNode`（Job） |
| `AIArmyAllHGArriveTarget` | 全员到达目标/巡逻半径判定 | `ReduceAllArrivedNode`（Job） |
| `AIArmyCheckHaveHGOutOfControl` | 是否存在失控单位 | `ReduceAnyOutOfControlNode`（Job） |
| `AICheckArmyPendingSkill` | pendingSkill 是否可释放 | per-army `CheckPendingSkillNode`（Apply/主线程更合适） |
| `AICheckArmyLeaderDistanceWithPlayer` | leader 与玩家距离阈值 | per-army `CheckDistanceToPlayerNode`（Job） |

> 注：巡逻点序列与循环/非循环逻辑强依赖托管对象（LevelPatrolPoint 等），建议先保留在主线程策略层，输出一个“当前巡逻目标点”给 JobGraph。

---

### 4.2 HumanGrass 侧（单位行为树任务）

下面按“任务类别”给迁移建议（不是逐个文件强制 1:1 实现顺序）：

#### A. 感知/范围/状态（Condition -> FilterNode）
- `AIHasEnemyAroundNew` -> `Filter_HasEnemyInRange`
- `AIIsInNormalAttackRange` -> `Filter_InNormalAttackRange`
- `AICheckTargetInSearchRangeNew` -> `Filter_TargetInSearchRange`
- `AIIsHasTargetBattleObjectNew` / `AIIsHasTargetConfrontationObjectNew` -> `Filter_HasTarget/HasConfront`
- `AIIsAirModeNew` / `AICheckTargetIsGroundModeNew` -> `Filter_IsAirMode/TargetIsGround`
- `AICheckIsLockChaseTarget` -> `Filter_IsLockChaseTarget`（读取 per-army 共享状态）

#### B. 目标选择/标记（Action -> SelectNode）
- `AIMarkedNearestTargetObjectNew` -> `Select_NearestEnemyAsTarget`
- `AICheckAndSetTargetAroundEnemyInAttackRange` -> `Select_TargetAroundPointIfInAttackRange`
- `AIOnlySetTargetObjectNew` / `AISetFirstTargetNew` / `AIRemoveCurrentTargetNew` -> `Select_Set/ClearTarget`

#### C. 移动/回归/绕行（Action -> ActionNode）
- `AIChaseTargetNew` -> `Action_MoveTo(Target/Point/Confront)`（输出 Move 意图）
- `AIReturnFormationPositionNew` -> `Action_ReturnFormation`（输出 ReturnFormation 意图）
- `AIFallBackTargetNew` -> `Action_OrbitConfrontTarget`（输出 orbit 目标点/方向）
- `AIMoveToConfrontationRange` -> `Action_MoveToConfrontRange`

#### D. 战斗/技能（Action -> ActionNode + Apply）
- `AICastNormalSkill` -> `Action_AttackNormal`（Apply 触发）
- `AICastPendingSkill` -> `Action_CastPendingSkill`（Apply）
- `AIAutoCastSkillNew` / `AICheckAndReportSkill` -> `Action_ReportSkillIntent`（Apply）
- `AICheckAndCastRunAttackLeft/Right` -> `Action_RunAttack(left/right)`（Apply）

#### E. 脱战/清理/状态机推进（Action -> Apply）
- `AIDisengageBattleNew` -> `Action_Disengage`（Apply 清目标/清对峙/更新控制权）
- `AIEnterNextStateNew` / `AIExitThirdOrder` / `AISetArmyStateNew` 等 -> 视为“旧状态机强耦合点”，优先放 Elite/OOP 管线或后续拆解为可数据化状态

> 备注：旧 HumanGrassAIComponent 内部还有大量“缓存/计时/冷却/目标失效窗口”的细节；迁移时要把这些拆成 SOA 字段（例如 `lastConfrontEndTime`、`targetDisableTime`、`orbitDistance` 缓存），并避免在 Job 中使用引用类型列表。

---

## 5. 功能 Check 清单（迁移验收）

> 建议每条都写成“可观察结果”，并尽量提供可复现的测试场景/配置。

### 5.1 基础闭环
- [ ] 新军团创建后，AI Job 调度与 Apply 正常运行，无异常/无泄漏（军团销毁时 Native 资源可回收）。
- [ ] AI 暂停/停时与 `ArmyService.isPaused/isSimulationTickPaused` 对齐：暂停不漂移，恢复可继续。

### 5.2 战术一致性（军团级）
- [ ] 跟随：军团能跟随玩家移动；最终朝向与相机 forward XZ 一致（等价 `AISetPlayerAsTargetPosition`）。
- [ ] 坚守：下达坚守点后，全员回归阵型并保持；可锁定/解除锁定追击。
- [ ] 攻击：对目标军团发起攻击；可“锁定追击”且目标失效后清理。
- [ ] 巡逻：按巡逻点行走；循环巡逻可持续；非循环到终点进入坚守。

### 5.3 目标与对峙（单位级）
- [ ] 选敌：能在索敌范围内选最近敌人并标记；敌人死亡/失效后能清理并重新索敌。
- [ ] 对峙：进入对峙后面向目标，持续一段时间后回到待机，并遵守冷却。
- [ ] 绕行/后退：与对峙目标保持随机 orbit 距离，并考虑双方半径与容差。

### 5.4 脱离控制与强制命令
- [ ] 单位进入自主战斗（SelfCombat）后，军团常规命令不会打断；脱战后回到 Army 控制。
- [ ] 玩家阵营强制命令能覆盖 SelfCombat（除 Special）。
- [ ] 存在失控单位时，可把其目标合理分配给可控单位（等价 `AssignTargetArmyToHumansWithoutControl`）。

### 5.5 技能/攻击
- [ ] 普攻：满足攻击距离时能稳定触发普攻，并使军团进入战斗状态（BattleArea 创建）。
- [ ] 跑动攻击：满足条件时能触发左右跑动攻击。
- [ ] 待释放技能：当 pendingSkill 可释放时，军团能释放；并可被停止（StopCurrentSkill）。
- [ ] 退出战斗：当全员不在战斗且无攻击者后，BattleArea 能被销毁；并验证 1 秒兜底检查有效。

### 5.6 性能与可扩展性
- [ ] 2000+ 单位时，主线程 AI 时间不随 NodeCanvas 节点数线性爆炸；Job 占用可控。
- [ ] 无 GC 峰值：AI 更新不产生 per-frame List/对象分配。

---

## 6. 风险与开放问题（需要主人确认/补充信息）

1) **AI 指令最小集合（MVP）**：优先保证 Move/Hold/Formation/Target/NormalAttack，还是要把技能也纳入第一期？
2) **巡逻数据源**：`LevelPatrolPoint` 属于关卡侧托管数据，是否接受“巡逻仍在主线程策略层维护，仅输出目标点”？
3) **旧状态机强耦合点**（ThirdOrder 等）：是否允许第一期把这类逻辑归入 Elite/OOP 管线（只对少量单位启用）？
4) **对齐判定阈值**：旧逻辑大量使用 `GetSearchRangeOne/Two`、`GetFireRange`、半径叠加等，是否有统一配置源，还是按旧接口读？

