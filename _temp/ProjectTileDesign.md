## 高性能投射物系统初步设计

### 一、设计目标

在现有战斗架构下，设计并实现一个**高性能、可扩展、语义一致的广义投射物系统**。
投射物定义为：**脱离施放者后能够独立存在、独立演化，并作为战斗交互参与者的实体**。

系统需同时满足以下两类极端需求：

* 高并发、低单体复杂度的投射物场景（如大规模箭雨）
* 低并发、高单体复杂度的投射物场景（如投石车、分裂弹、持续效果弹体）

---

### 二、架构一致性与复用约束（强制）

1. 投射物系统**必须建立在现有战斗架构之上**，并与以下层级保持语义一致：

   * 行为层：Ability / AbilityTask / Transition / Trigger
   * 效果层：Modifier / Effect / Feedback
   * 粘合层：Blackboard / InteractionContext / 相关上下文机制

2. 投射物相关的以下行为必须**优先通过既有架构表达**，而非单独实现平行系统：

   * 飞行与生命周期控制
   * 命中判定后的伤害与效果结算
   * 状态变更、分裂、连锁等玩法逻辑

3. 明确禁止为投射物创建一套独立的：

   * 伤害系统
   * 效果系统
   * 状态系统
   * 命中反馈系统

---

### 三、BattleObject 与 Ability 体系的使用原则（核心约束）

4. 投射物必须是 `BattleObject`，具备参与战斗交互的最小身份语义。
   1. 但是，要考虑极端情况，这套系统能否高性能表达：1000人的弓箭军团齐射
   2. 需要你设计出最合适的架构

5. 投射物**可以且应当复用 Ability 系统的执行语义**（Ability / Task / Effect / Modifier），
   但**不得无约束地继承完整的 Unit 行为语义**。

6. 即便现有 AbilityDrivenUnit 中的以下能力是“高度可配置、默认不启用”的，也必须在**架构层面受限**，而不能仅依赖“未配置”：

   * 输入驱动能力
   * 连招系统
   * Unit 级状态（倒地 / 硬直 / 受击方向等）
   * 复杂移动能力（寻路、避障、角色控制）
   * 动画驱动状态切换

7. 投射物应被建模为：
   **“受限能力集的 Ability 执行宿主（Ability Execution Host）”**，
   而非完整意义上的 Unit。

---

### 四、能力访问与语义安全约束（必须显式设计）

8. Ability / Task / Effect 在运行时必须声明其所依赖的**能力前提（Capability）**。

9. 投射物的 Ability 执行环境中：

   * 仅允许显式声明为“投射物可用”的能力
   * 不满足能力前提的 Ability / Task / Effect 必须被拒绝执行，而非静默失效

10. 不得仅通过“配置不填”来防止投射物使用 Unit 专属语义；
    必须通过能力白名单 / 执行环境隔离来保证语义安全。

---

### 五、性能与规模约束（非功能性要求）

11. 系统必须支持高度 Scale：

    * 投射物数量可达到极高规模
    * 单个投射物的逻辑复杂度允许差异化

12. 投射物系统不得强制所有弹体走统一的高成本执行路径；
    应允许：

    * 不同 Tick 频率
    * 聚合执行
    * 条件化 Effect 触发

13. 必须避免投射物作为高频事件源，对 Effect / Modifier 系统造成无节制的调用扇出。

---

### 六、命中检测与空间交互约束

14. 投射物必须支持：

    * 对单位或可命中对象的命中检测与结算
    * 对地形或不可穿透障碍物的阻挡检测

15. 空间检测的职责仅限于**提供可能发生的交互候选**；
    是否命中、是否穿透、是否触发效果，必须由战斗规则（Effect / Modifier）裁决。

16. 地形、单位、障碍物在战斗语义上应被统一视为“可交互对象”，
    而非直接依赖物理类型或 Collider 语义。

---

### 七、逻辑与表现分离约束

17. 投射物必须严格区分：

    * 逻辑实体（战斗、运动、检测、效果触发）
    * 表现实体（模型、特效、音效、动画）

18. 投射物逻辑不得依赖表现实体的存在；
    在极端规模下，表现可被合批、简化或省略。

19. 系统需清晰管理逻辑与表现对象的生命周期关系，避免反向依赖。

---

### 八、玩法扩展与 Rogue 适配约束

20. 投射物系统必须支持高度不可预期的 Rogue-like 玩法组合，包括但不限于：

    * 飞行过程中持续检测并触发效果
    * 命中后一次性结算并销毁
    * 命中或结束时生成其他投射物或战斗实体

21. 上述玩法必须通过 Ability / Task / Effect / Modifier 的组合表达，
    而非为特定投射物编写专用逻辑。

22. 系统设计必须假设未来投射物效果无法穷举，
    因此禁止枚举式、类型分支式的玩法实现方式。

---



我提1个问题，你看架构能否满足，并告诉我整个执行链路（从投射物由谁生成到执行完伤害解算结束）：1.玩家按
  下大招，朝天空发射一个子弹球，落地后，每秒向周围旋转释放1000颗子弹，命中周围单位造成一次伤害后弹射至
  最近单位，再造成一次伤害后消失。落地持续5秒后子弹球消失。问题关键点：投射物执行流程、投射物执行方案选
  择（Fast、heavy）、heavy逻辑如何执行的（子弹球自身的上升降落逻辑）。


• 能满足，且这个例子正好体现“方案A：HeavyHost 承载复杂宿主 + FastBatch 承载海量子弹”的价值。下面给你完整
  执行链路（从生成到伤害解算结束），并标明每一步是谁负责。

  1）玩家按下大招（起点：施法者 Ability）

  - 玩家单位（BattleObject）上的某个大招 Ability 被触发（输入/技能系统触发不重要，关键是最终进入 Ability
    执行）。
  - Ability 时间轴里在某个 AbilityTask 执行“发射子弹球”（可继续复用 ATLaunchProjectile 或等价任务）。

  2）生成“子弹球”（选择 HeavyHost）

  - ATLaunchProjectile → 调用 ProjectileService.Launch(LaunchData)（这里 LaunchData 明确声明：通道
    =HeavyHost、运动模型=上升+下落、落地后进入“炮台态”、总生命周期=5s、表现 prefab 等）。
  - ProjectileService 走 HeavyHost 分支：创建/复用一个 ProjectileBattleObject(子弹球)（受限能力宿主），
    注册进 BattleObjectContext，并把它加入战斗更新循环。
  - 重点：子弹球是“少量高复杂度实体”，它需要自己的状态机/计时/发射逻辑/落地判定，因此 HeavyHost 合理。

  3）子弹球自身的上升/下落逻辑如何跑（HeavyHost 内部执行）

  - 子弹球 BattleObject 上跑一个专用的“投射物生命周期 Ability”（例如 BallLifecycleAbility 的概念），其
    Task 形态类似：
      - ATBallAscend：按配置上升（可用简单运动学，不依赖表现）。
      - ATBallDescendAndCheckGround：下落过程中每帧做一次轻量地面检测（单体数量极少，用 Raycast/
        RaycastCommand 都可），检测到 HitWorld 后切到“落地态”。
      - ATBallTurretTick：落地后进入 5 秒持续计时；每秒触发一次“发射 1000 颗子弹”的任务；到时退出并销毁/
        回收子弹球。
  - 这里的“落地”不需要进 Modifier：它是子弹球自身的状态转换，走 HeavyHost 内部逻辑即可；只有当你希望“落
    地也触发一个落点玩法（召唤圈/地面效果）”时，才额外发一条世界命中交互进交互链。

  4）子弹球每秒旋转喷射 1000 子弹（选择 FastBatch）

  - 在 ATBallTurretTick 里，每秒计算 1000 个方向（由“旋转角速度 + 累计相位”决定，形成环绕/螺旋），批量调
    用 ProjectileService 发射“子弹子投射物”。
  - 这 1000 颗子弹全部走 FastBatch：因为数量巨大、单体逻辑应当被批处理（即便带“命中一次+弹射一次”的规
    则，也能用策略化的 FastBatch 表达，避免 1000 个 HeavyHost）。

  5）FastBatch 子弹的命中→伤害解算（统一走交互链）

  - FastBatch 在 Job/批处理中更新运动与检测，产出命中记录 ProjectileHitRecord(HitTarget/HitBlocker/
    HitWorld)。
  - 命中单位（HitTarget）时：
      - 主线程将命中记录转换为 EventCombatInteraction：
          - sourceObject：玩家（或子弹球，取决于归因需求；通常归因给玩家便于吃到属性/天赋）。
          - targetObject：被命中的单位 BattleObject。
          - payload：写入命中点/法线/子弹 id/第几段命中等。
          - modifierProfiles：这次伤害对应的 ModifierProfile（“造成一次伤害”就配一条）。
      - BattleService 收到 EventCombatInteraction → InteractionHandlerChain.Handle() →
        BattleModifierContext.CreateModifier() → Modifier/Effect/Feedback 完成伤害结算并结束。

  6）“命中后弹射到最近单位，再造成一次伤害后消失”（FastBatch 的两段式）

  - 第一段命中结算完成后，FastBatch 不把“找最近目标/重定向”塞进 Modifier（避免 Modifier 扇出变成控制中
    心），而是走投射物策略扩展点：
      - 命中记录携带一个 BounceToNearest 标记与必要参数（最大弹射次数=1）。
      - 在 ProjectileService 的“命中后处理阶段”对这批记录做一次“最近目标查询”（可用战斗对象空间索引/简化
        查询；实现阶段会专门做性能优化，避免对每颗子弹暴力遍历所有单位）。
      - 为每条记录发射“第二段子弹”（仍是 FastBatch，目标锁定为最近单位，命中一次后立即销毁）。
  - 第二段子弹命中后重复第 5 步交互链结算一次，然后子弹生命周期结束并回收。

  7）5 秒结束，子弹球消失（HeavyHost 收尾）

  - 子弹球的生命周期计时到 5 秒 → 标记删除 → BattleObjectContext 帧末回收（表现对象可延迟回收播放收尾特
    效，但逻辑已结束）。

  关键选择总结

  - 子弹球：HeavyHost（原因：低数量、高复杂度、有明确生命周期与阶段行为：上升→落地→持续喷射→消失）。
  - 旋转喷射的 1000/秒 子弹：FastBatch（原因：高数量，必须批处理；“两段命中+一次弹射”用 FastBatch 的命中
    策略扩展点做，两段式发射避免把复杂逻辑摊到每颗 HeavyHost 上）。

  如果你希望我把“最近目标查询”的性能策略也写进 design.md/tasks.md（例如空间索引/分帧/批处理），我可以在
  不进入实现的前提下继续细化补充。


› 如果弹射次数是rogue升级效果，这个逻辑好写好配置吗？


• 好写、也好配，前提是把“弹射次数”当成 FastBatch 的命中策略参数，而不是写死在某个投射物类型里。

  - 配置形态：在投射物模板/LaunchData 里提供 baseBounceCount + bounceBonusKey（从施法者黑板/属性读取）+
    bounceTargetQuery（“最近单位”的查询模板）+ bounceRadius/排除已命中/每段伤害Modifier 等参数。
  - Rogue 升级落点：升级效果只需要给施法者（或子弹球宿主）加一个“投射物弹射次数+X”的黑板值/属性（通过现
    有 Modifier/Effect 实现即可），不改投射物代码。
  - 执行方式（易扩展）：FastBatch 子弹状态里存 remainingBounces；每次 HitTarget 完成一次交互链伤害结算
    后，若 remainingBounces>0 就用 bounceTargetQuery 找最近目标并生成“下一段子弹”（仍是 FastBatch），
    remainingBounces--，直到 0 自动消失。
  - 性能建议：默认在“发射时快照”读取一次弹射次数（避免飞行中频繁读属性）；后续要做“动态变化”也能支持，但
    成本更高