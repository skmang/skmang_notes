# TODO（快速捕获）

> 原则：先记录、再整理。这里追求"10 秒内追加一项"。

## Inbox
- [x] AI持续优化出现的问题
- [x] 基础的移动问题处理（飞天、遁地）
- [x] 预加载处理
- [ ] 投射物问题处理
- [ ] 剑盾技能

### P10 - 核心任务
- [x] 小兵AI迁移job 临时AI处理了

### P9 - 核心任务
- [x] 创建两个新兵团，打架 -> 处理刷怪逻辑里刷出新兵团

### P8 - 核心任务
- [x] 处理召唤军团逻辑
- [x] 主角被打受击及死亡逻辑

### P7 - 核心任务
- [ ] 处理巡逻逻辑
- [x] 兵团预加载

### P6 - 验证与优化
- [x] 关卡内的流场是否正常工作
- [x] 按最新地图重导一份寻路数据
- [x] 第三人称镜头模式之间切换不顺滑，例如上马、RTS等

### P5 - 游戏体验
- [ ] 远程兵的弓箭
- [ ] 部署阶段军团设置位置后，立即瞬移应用位置
- [ ] 军团阵型保持稳定，且不要在接近阵型位置时蠕动，应该快速归位
- [x] 小兵会掉入地下，需要给出一个根治的解决方式，无论是因为何种原因
- [x] 斜坡处击飞会直接掉出去，需要增加检测手段
- [ ] 小兵闪烁检测及修复
- [x] [ArmyNativeProxy] State Mismatch Detected! Unit:271 Native:ManagedGameplay Proxy:NativeSimulation. Resending Command.
UnityEngine.Debug:Log (object)
CY.Refactor.Battle.ArmyUnitNativeProxyComponent:OnUpdate (CY.Refactor.Battle.BattleContext) (at Assets/Script/Refactor/BattleCompatibility/Army/Components/ArmyUnitNativeProxyComponent.cs:42)
CY.Refactor.Battle.BattleObjectContext/BattleComponentLoopItem:Update (CY.Refactor.Battle.IBattleObjectComponent,CY.Refactor.Battle.BattleContext) (at Assets/Script/Refactor/Runtime/Battle/BattleContext/BattleObjectContext.cs:613)
CY.Refactor.Battle.BattleObjectContext/BattleComponentLoopItem:ExecuteOnAllComponents (CY.Refactor.Battle.BattleContext,System.Action`2<CY.Refactor.Battle.IBattleObjectComponent, CY.Refactor.Battle.BattleContext>) (at Assets/Script/Refactor/Runtime/Battle/BattleContext/BattleObjectContext.cs:600)
CY.Refactor.Battle.BattleObjectContext/BattleComponentLoopItem:OnBattleLogicUpdate (CY.Refactor.Battle.BattleContext) (at Assets/Script/Refactor/Runtime/Battle/BattleContext/BattleObjectContext.cs:581)
CY.Refactor.BattleLogicLoop:OnUpdate () (at Assets/Script/Refactor/Runtime/Battle/BattleUpdateLoop/BattleLogicLoop.cs:43)
CY.Refactor.BattleUpdateLoopBase:CY.Refactor.ICustomGameLoop.OnPlayLoopUpdate () (at Assets/Script/Refactor/Runtime/Battle/BattleUpdateLoop/BattleUpdateLoopBase.cs:19)
CY.Refactor.GameLoopInjectHelper/<>c__DisplayClass1_0`2<CY.Refactor.IBattleLogicLoop, UnityEngine.PlayerLoop.Update/ScriptRunBehaviourUpdate>:<Inject>b__0 () (at Assets/Script/Refactor/Runtime/Core/GameLoop/GameLoopInjectHelper.cs:41) 如何处理修正。

### P4 - Bug修复
- [ ] 之前龙会报错，需要处理
- [x] 兵团底部UI选中状态与头顶UI不同步

### P3 - UI体验
- [x] 兵团响应操作音效
- [x] 兵团头顶UI位置错误（没有浮在头顶上）
- [ ] 飘字功能迁移至新的

### P2 - 代码清理
- [ ] 去掉ArmyService与NavigationService的依赖

### 已完成
- [x] 新军团移动模拟稳定性
- [x] 新军团出生位置错误处理
- [x] 战意第三人称列阵操作复刻
- [x] stage_dungeon中的军团部署抽象
- [x] 整理战斗需要的AI数据 -> 玩家位置 仇恨值 阵营 友军 敌军 目标等（AI生成spec来处理）
- [x] 整理战斗需要的各AI状态行为接口 -> 技能 攻击 移动
- [x] 基础攻击
- [x] 投射物系统设计
- [x] 小兵受击后乱动可能是进入locomotion时混合了上个状态导致的！应该强制切换
- [x] Service代码生成按顺序全量初始化
- [x] 军团顶部UI Y轴高度应该固定在上方大概3-5m处，不能完全跟随physicalanchor

## This Week
- [ ] 延期1天 :D 
- [ ] 移除旧阵营枚举 统一走阵营关系配置
- [x] 优化openspec 记住关键信息 不用每次大规模搜索，change过程中用，不参与归档；且增加如何智能在多个时间接续上下文的功能

## Weekly Triage（每周整理一次）
- 把需要长期跟踪/多步推进的事项迁移到：`tasks/` 或 `projects/<project>/`
- 把知识沉淀迁移到：`areas/` 或 `resources/`
- 迁移后从本文件删除，或在末尾标记（migrated）

## Links
- 旧清单备份：`tasks/backlog.md`
