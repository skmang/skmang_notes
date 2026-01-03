先把这套“输入 + 流（NodeStream）”的模型用一句话概括：

  - FlowContext 提供“这帧可被 Job 安全读取的全量数据快照（全局/军团级/单位级）”
  - NodeStream 只表达“这帧要处理的单位子集（indices+count）以及它什么时候准备好（dependency）”
  - 节点做的事是：用 FlowContext 读取数据 → 对输入流的单位子集做过滤/选择/产生命令 → 输出新的流或写入命
    令缓冲

  ———

  ## 1) FlowContext 是什么（“输入面”）

  JobAIGraphFlowContext（在 Assets/Script/LogicGraph/Extend/JobAIGraph/JobAIGraphDAG.cs）是每帧调度时构
  造的一坨只读输入，典型包含：

  - 全局 SOA：unitBasicData、movementStates、spatialHashMap…
  - 全局快照：阵营关系矩阵 factionRelationMatrix…
  - per-army 状态表：armyAITacticStateMap、armySimInfoMap…
  - per-unit 快照：unitAIParamSnapshot（给 Job 读的“单位参数快照”）
  - per-unit 状态：unitAIState（跨帧状态，Job 只读，写通过 command buffer 再 Apply）

  关键点：Job 不直接碰 Unity 对象/组件/服务，所以你想让节点用到的任何信息，都必须在 PreUpdate（安全窗
  口）写进这些 Native 结构里。

  ———

  ## 2) NodeStream 是什么（“流面”）

  JobAINodeStream 就三个东西：

  - indices：一串 globalIndex（指向 SOA 的索引）
  - count：这串 indices 里有效的前 N 个
  - dependency：生产这串流的 JobHandle

  它表达的是“谁要被处理”，不是“怎么处理”。

  例子（用自然语言）：

  - Entry 节点输出“军团全量单位索引流”
  - Filter 节点把它变成“没有目标的那批单位索引流”
  - Select 节点对这批单位“选最近敌人”，把结果写到 UnitAIStateCommandBuffer，输出流可以继续透传让下游
    Action 用同一批单位
  - Action 节点写 ArmyAICommandBuffer（意图），下一帧主线程 Apply

  依赖链为什么重要：下游节点 schedule 的时候必须依赖上游流的 dependency，否则会出现“读到还没写完的数据/
  读写冲突”。

  ———

  ## 3) 节点是不是应该带 AI 参数（比如索敌范围）？

  应该，但要分清“参数属于谁”，否则会演化成新的硬编码/维护噩梦。推荐按这三层来放：

  ### A. 单位级参数（per-unit，可能随 Buff/状态变化）

  典型：索敌范围、射程、脱战距离、是否能对峙等。

  - 这些放在 UnitAIParamSnapshot 最合理：Job 读快照，PreUpdate 每帧同步（或脏更新）。
  - 即使“这个军团所有单位共用”，也可以把同一个值写进该军团所有单位的 snapshot；这样不会破坏“单位能力差
    异/Buff 改值”的扩展空间。

  适用场景：你提的“索敌范围”本质上更像单位属性（有的兵种远程/近战不同，有 Buff 也会变），强烈建议仍走
  per-unit snapshot。

  ### B. 军团级参数（per-army，全军团共享）

  典型：战术模式、优先攻击目标军团、队形策略、是否允许索敌/撤退等。

  - 更适合放在 per-army 的 map（例如 ArmyAITacticStateMap 这一类），由 FlowContext 注入。
  - 节点读取时先看“军团态”，再结合单位态做细化。

  适用场景：你说“该军团所有单位共用”的那类，通常属于这一层。

  ### C. 节点参数（per-node/per-graph，图配置的一部分）

  典型：算法/策略参数，不是角色属性本身，例如：

  - 选择策略：优先“战略目标军团”还是纯最近
  - 过滤阈值：只让距离 < X 才进入某 Action（注意这个 X 更像策略阈值，而不是单位射程）
  - 行为模式：Orbit 的方向分配策略、是否允许清目标、是否写 facing override 等

  节点参数的优势：同一套运行时代码，通过图配置就能调不同 AI 风格。

  但要注意一个红线：

  - 节点参数不要承载“应该由单位/属性系统决定的能力数值”（如射程/索敌半径）。否则你会把数值体系拆成两套
    （属性 vs 图参数），后面 Buff/装备一接入就会对不上。

  ———

  ## 4) 针对你问的“索敌范围（军团共用）”怎么选

  我的建议是：仍然放在 UnitAIParamSnapshot.searchRangeOne/Two，只是在快照同步时让该军团所有单位写成同一
  个值即可。

  原因：

  - 以后你几乎一定会遇到“同军团不同兵种 range 不同 / Buff 改 range / 英雄光环改 range”，这时候 per-unit
    快照不会推翻架构；
  - 放节点参数会让“数值体系”与“AI 图体系”耦合过深，后面非常难统一口径；
  - 放 per-army state 也可以，但最终 Job 里还是要转成 per-unit 访问（要么每单位读 armyId->param 的 map，
    多一次查表；要么预展开到 per-unit snapshot，反而更直接）。

  ———

  如果你愿意，我可以用你们当前已有节点举一个“正确分层”的示例表（每个字段该放 Unit snapshot / Army
  tactic / Node param 哪一层），把这套范式固化成一张规则表，后面加节点就不会反复纠结。