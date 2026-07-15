/*
 * 幻灯片内容文件
 * ------------------------------------------------------------------
 * 修改文字：编辑下方 S('章节', '标题', `正文`, { 选项 })。
 * 常用正文组件：cards([...])、list([...])、flow([...])、chip([...])。
 * type:'cover' 生成章节封面；visual:VISUALS.xxx 添加 visuals.js 中的图。
 * 本文件不包含导航逻辑和视觉样式。
 */
const S = (section, title, content, options = {}) => ({ section, title, content, ...options });
const cards = (items, cols = 3) => `<div class="grid-${cols}">${items.map((x,i)=>`<div class="card"><span class="num">${String(i+1).padStart(2,'0')}</span><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join('')}</div>`;
const flow = (items, vertical = false) => `<div class="flow${vertical?' vertical':''}">${items.map(x=>`<div class="flow-item">${x}</div>`).join('')}</div>`;
const list = items => `<ul class="clean">${items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const chip = items => `<div class="chips">${items.map(x=>`<span class="chip">${x}</span>`).join('')}</div>`;
const evidence = (label, text) => `<div class="evidence"><span>${label}</span><p>${text}</p></div>`;
const quotation = (text, note) => `<blockquote class="quote"><span class="quote-mark">“</span><p>${text}</p><footer>${note}</footer></blockquote>`;

const slides = [
  // 01–06 开场
  S('开场', '把 AI 变成<br><span class="accent">工程团队</span>', `<p class="lead">从 Rust 云服务、可穿戴设备、500 页技术书<br>到 AI 时代的工程师</p>${chip(['AI NATIVE ENGINEERING','4 TOPICS','80 SLIDES'])}`, {type:'cover', kicker:'AI NATIVE ENGINEERING · 2026', visual:VISUALS.hero}),
  S('开场', '今天不讲<br>“如何用 AI 写代码”', `<div class="compare"><div class="compare-side negative"><span class="eyebrow">临时性</span><h3>Prompt 技巧合集</h3><p>一次对话、一次生成；效果依赖当时的上下文与运气，同样的错误还会再犯。</p></div><div class="versus">转变</div><div class="compare-side highlight"><span class="eyebrow">可持续性</span><h3>工程系统</h3><p>规则写进仓库，任务有完成标准，失败会自动暴露；修过的问题不必一再重来。</p></div></div>${evidence('判断标准','关掉当前对话后，下一位 Agent 是否仍然知道怎么正确地继续工作？')}`),
  S('开场', '三个产物，<br>三个工程世界', `<div class="case-landscape"><div><span class="case-id">01 · 软件</span><h3>Rustack</h3><b>协议广度与兼容性</b><i>↓</i><strong>测试 · 兼容套件 · 性能基准</strong></div><div><span class="case-id">02 · 软硬件</span><h3>可穿戴设备</h3><b>功耗、无线与端云协同</b><i>↓</i><strong>仪器 · 实物 · 现场数据</strong></div><div><span class="case-id">03 · 知识</span><h3>技术书</h3><b>事实、结构与长期一致性</b><i>↓</i><strong>来源 · 审稿 · 读者理解</strong></div></div>`, {kicker:'THE ENGINEERING LANDSCAPE'}),
  S('开场', '这些东西是 AI<br>“生成”出来的吗？', quotation('<em>不是。</em> AI 写出了大量代码和文字；项目之所以成立，是因为背后有一套<strong>能持续运转的工程闭环</strong>。','代码和文字只是产物，能够反复交付的才是系统。'), {kicker:'THE QUESTION'}),
  S('开场', '从助手到系统', `<div class="d3-chart d3-evolution" data-chart="evolution" aria-label="AI 工程能力从代码补全演进到工程系统"></div><p class="chart-caption">变化不只来自模型变强，也来自上下文、分工和反馈逐步完善。</p>`, {kicker:'EVOLUTION'}),
  S('开场', 'AI 工程产能公式', `<div class="d3-chart d3-factors" data-chart="factors" aria-label="AI 工程产能因素网络"></div><p class="chart-caption">六项因素形成乘法关系：任何一项接近零，整个系统都会失效。</p>`, {kicker:'THE EQUATION'}),

  // 07–23 Rustack
  S('话题一 · Rustack', '01<br><span class="accent">构建协议型软件系统</span>', `<p class="lead">目标不是多写几个接口，而是让 AWS SDK 真能连、兼容性测试真能跑、每一次差距都能被看见。</p>${chip(['18 SERVICES','779 ROUTES','&lt; 1s BOOT','≈ 8MB'])}`, {type:'cover', kicker:'TOPIC 01 · SOFTWARE', visual:VISUALS.rustack}),
  S('话题一 · Rustack', '为什么做 Rustack？', `<div class="grid-2"><div>${list(['CI：每个 Job 都能快速拉起独立环境','本地开发：行为确定，不依赖云端账号与网络','集成测试：失败可以稳定复现','交付：单二进制与小镜像降低分发成本'])}</div><div class="card"><span class="eyebrow">PRODUCT THESIS</span><h3>不是“另一个 AWS”</h3><p>而是为 SDK 测试与本地开发优化的协议兼容层。</p>${chip(['单二进制','< 1s 启动','低内存','小镜像'])}</div></div>`, {kicker:'PROBLEM / OPPORTUNITY'}),
  S('话题一 · Rustack', '先说清楚：做到什么才算成功', `<div class="compare"><div class="compare-side"><span class="eyebrow">不做什么</span>${list(['第一天支持全部 AWS 服务','重现 AWS 内部实现','用接口数量代替行为正确性'])}</div><div class="versus">边界</div><div class="compare-side highlight"><span class="eyebrow">做到什么</span>${list(['官方 SDK 无需改业务代码即可连接','同一输入得到可重复的响应与错误','用外部兼容性测试持续量化差距'])}</div></div>${evidence('验收问题','现有 AWS 集成测试，能不能只改服务地址就运行？')}`, {kicker:'SCOPE BEFORE CODE'}),
  S('话题一 · Rustack', '第一个纵向切片：S3', `<div class="architecture"><div class="node"><small>01</small><h3>客户端</h3><p>AWS CLI / SDK</p></div><div class="node"><small>02</small><h3>HTTP 协议</h3><p>路由、签名、XML</p></div><div class="node"><small>03</small><h3>业务逻辑</h3><p>Bucket / Object</p></div><div class="node"><small>04</small><h3>存储与响应</h3><p>内存后端</p></div></div>`, {kicker:'VERTICAL SLICE'}),
  S('话题一 · Rustack', '为什么是 S3？', `${cards([
    ['协议面够宽','REST-XML、SigV4、Streaming、Range、错误响应。'],
    ['状态语义够深','Versioning、Delete Marker、Multipart 生命周期。'],
    ['现成的检验工具多','AWS SDK、MinIO Mint、Ceph 测试都能给出外部证据。']
  ])}${evidence('纵向切片的价值','一次暴露路由、认证、序列化、存储、错误模型与客户端兼容六类问题。')}`),
  S('话题一 · Rustack', '规则越清楚，AI 越能把工作铺开', `${flow(['Smithy 模型','Rust 类型','协议绑定','接口实现','单元测试','兼容测试'])}<p class="lead" style="margin-top:42px">结构重复、差异明确、参照可靠，这类工作最适合交给 Agent。</p>`, {kicker:'EXPANSION'}),
  S('话题一 · Rustack', '一个阶段，必须交付可验证的结果', `<div class="timeline"><div class="timeline-item"><b>模型与类型</b><span>模型可以编译</span></div><div class="timeline-item"><b>签名</b><span>通过 SigV4 用例</span></div><div class="timeline-item"><b>协议层</b><span>SDK 请求可解析</span></div><div class="timeline-item"><b>服务逻辑</b><span>增删改查跑通</span></div><div class="timeline-item"><b>自有协议栈</b><span>移除 s3s</span></div><div class="timeline-item"><b>兼容修复</b><span>外部测试回归</span></div></div>${evidence('阶段完成的标准','必须是用户看得见的能力，或机器能判断的结果，不能只是“新增了 20 个文件”。')}`, {kicker:'PHASE ≠ FILE BATCH'}),
  S('话题一 · Rustack', '对话会结束，项目上下文会留下', `<div class="stack"><div class="stack-layer"><b>AGENTS.md</b><span>长期工程规则</span></div><div class="stack-layer"><b>Skills</b><span>可重复的工作方法</span></div><div class="stack-layer"><b>Specs</b><span>当前功能的具体设计</span></div><div class="stack-layer"><b>Tests</b><span>机器可读的事实边界</span></div></div>`, {kicker:'PROJECT CONTEXT'}),
  S('话题一 · Rustack', 'AGENTS.md：<br>项目的操作系统', `<div class="grid-2"><div>${list(['不允许 TODO 与半成品','错误处理与并发模型','类型、安全和资源限制','Rust 工具链与依赖要求'])}</div><div class="code"><span class="c"># Definition of Done</span>\n<span class="f">cargo build</span>\n<span class="f">cargo test</span>\n<span class="f">cargo fmt --check</span>\n<span class="f">cargo clippy -- -D warnings</span></div></div>`, {kicker:'RULES THAT EXECUTE'}),
  S('话题一 · Rustack', 'Spec 不是说明书，而是协作契约', `<table class="mini-table"><thead><tr><th>普通文档</th><th>可执行规格</th></tr></thead><tbody><tr><td>解释系统</td><td>约束系统</td></tr><tr><td>主要给人阅读</td><td>人和 Agent 都能执行</td></tr><tr><td>允许保留模糊</td><td>尽量减少实现时的猜测</td></tr><tr><td>描述功能</td><td>写清边界、错误、测试和完成标准</td></tr></tbody></table>`, {kicker:'CONTRACT'}),
  S('话题一 · Rustack', '一个阶段，怎样走到交付', `${flow(['读取阶段目标','读取项目上下文','先补齐规格','按依赖顺序实现','通过质量检查','核对完成标准','独立审查'])}<p class="muted" style="margin-top:34px">先把规格写到另一位工程师能够独立实现，再开始写生产代码。</p>`, {kicker:'EXECUTION LOOP'}),
  S('话题一 · Rustack', '不要让同一个 Agent<br>包办所有角色', `<div class="role-loop"><div class="role-human"><span>人类负责人</span><b>方向 · 取舍 · 责任</b></div><div class="role-track"><div><span>01</span><b>研究</b><small>事实与未知</small></div><i>→</i><div><span>02</span><b>规格</b><small>边界与设计</small></div><i>→</i><div><span>03</span><b>实现</b><small>按依赖展开</small></div><i>→</i><div><span>04</span><b>测试</b><small>把问题变成可复现的失败</small></div><i>→</i><div><span>05</span><b>审查</b><small>独立检查</small></div></div><div class="role-feedback"><span>决策与约束 ↓</span><b>产物、证据与例外 ↑</b></div></div>`, {kicker:'ROLE SEPARATION · FEEDBACK LOOP'}),
  S('话题一 · Rustack', '外部测试，是 AI 最好的老师', `<div class="d3-split"><div class="d3-chart d3-compatibility" data-chart="compatibility" aria-label="DynamoDB 兼容率从约 40% 提升到 80% 以上"></div><div>${list(['表达式：优先级、保留字、嵌套路径','数值：十进制精度与比较规则','响应：ReturnValues 与分页边界','约束：1 MB 限制与校验顺序'])}</div></div>${evidence('关键变化','测试把“看起来能用”拆成一个个可以复现的问题；Agent 不再凭感觉猜，而是根据证据补齐缺失的语义。')}`, {kicker:'MACHINE-READABLE FEEDBACK'}),
  S('话题一 · Rustack', 'AI 不怕测试失败', `${quotation('AI 怕的是没有<strong>高质量、机器可读</strong>的失败信号。','失败测试 → 定位协议语义 → 小范围修改 → 回归验证')}`, {kicker:'THE REAL FEEDBACK LOOP'}),
  S('话题一 · Rustack', 'DEMO', ``, {type:'demo', kicker:'LIVE'}),
  S('话题一 · Rustack', 'Rustack 留下的不只是代码', cards([
    ['规则','把长期要求写进仓库。'],
    ['规格','让设计能够执行和审查。'],
    ['测试','让兼容性问题自己说话。'],
    ['工作方法','让走通过的路可以重走。']
  ],4), {kicker:'TAKEAWAY'}),
  S('话题一 · Rustack', '软件系统，最终由测试说话', `<div class="huge-number">TEST</div><p class="lead">协议测试、兼容性测试、性能基准与独立审查。</p>`, {type:'cover', kicker:'TOPIC 01 · CONCLUSION'}),

  // 24 转场
  S('转场', '从可重复的测试，<br>到不可忽略的现实', `<p class="lead">软件里的失败可以重放；物理世界还会加入温度、遮挡、冲击、噪声和人的动作。</p>${chip(['TEST → MEASURE','CODE → SIGNAL','ASSUMPTION → EXPERIMENT'])}`, {type:'cover', transition:true, kicker:'FROM BITS TO ATOMS', visual:VISUALS.softwareToHardware}),

  // 25–42 Wearable
  S('话题二 · 可穿戴', '02<br><span class="accent">打造软硬件全栈系统</span>', `<p class="lead">从脚下的 IMU、BLE 链路和手机训练会话，到云端的数据处理：每一个判断最终都要回到测量。</p>${chip(['EDGE','BLE','MOBILE','CLOUD','ML'])}`, {type:'cover', kicker:'TOPIC 02 · HARDWARE', visual:VISUALS.wearable}),
  S('话题二 · 可穿戴', '从产品想法开始，<br>不是从芯片开始', `<div class="compare"><div class="compare-side"><span class="eyebrow">VAGUE</span><h3>做一个足球传感器</h3><p>无法估算，也无法验收。</p></div><div class="versus">SPECIFY</div><div class="compare-side highlight"><span class="eyebrow">EXECUTABLE</span><h3>3 小时高强度运动</h3><p>明确采样、传输、延迟、并发与完整性。</p></div></div>`),
  S('话题二 · 可穿戴', '先把产品愿望写成工程约束', `<table class="mini-table"><thead><tr><th>用户怎么说</th><th>工程上看什么</th><th>怎样验证</th></tr></thead><tbody><tr><td>训练时感觉不到</td><td>重量、厚度、安装位置</td><td>佩戴与冲击测试</td></tr><tr><td>一场训练不断线</td><td>续航、丢包、缓存深度</td><td>电流曲线与压力测试</td></tr><tr><td>多人同时使用</td><td>连接数、时隙、射频拥塞</td><td>真实场地并发测试</td></tr><tr><td>数据能用于分析</td><td>采样率、同步误差、质量标志</td><td>标注数据与算法评估</td></tr></tbody></table>`, {kicker:'CONSTRAINT SURFACE'}),
  S('话题二 · 可穿戴', '先摸清陌生领域，再谈选型', `${flow(['用户目标','需要测什么','用什么传感器','怎样采样计算','怎样通信','手机端','云端','分析体验'])}<p class="muted" style="margin-top:34px">先弄清楚“还需要知道什么”，再决定“应该买什么”。</p>`, {kicker:'DOMAIN MAPPING'}),
  S('话题二 · 可穿戴', '候选答案 ≠ 工程事实', `<div class="grid-2"><div>${list(['MCU / IMU / GNSS','BLE / LTE-M / NB-IoT','电源 / PCB / 天线','固件 / iOS / 云端 / 机器学习'])}</div><div class="card"><span class="eyebrow">回到真实世界</span>${chip(['规格书','参考设计','开发板实测','电流分析仪','射频测试','真实运动数据'])}</div></div>`),
  S('话题二 · 可穿戴', '端到端架构', `<div class="architecture"><div class="node"><small>设备端</small><h3>鞋上传感器</h3><p>惯性传感器 · 微控制器 · 存储 · 电池<br>Rust Embassy 固件</p></div><div class="node"><small>手机端</small><h3>接收端</h3><p>Swift 界面 · Rust 核心<br>会话 / 对时 / 重试</p></div><div class="node"><small>云端</small><h3>控制平面</h3><p>认证 · API · S3 · DynamoDB<br>设备注册 / 无线升级</p></div><div class="node"><small>分析</small><h3>数据与模型</h3><p>遥测数据 · 特征处理<br>动作分类</p></div></div>`, {kicker:'SYSTEM VIEW'}),
  S('话题二 · 可穿戴', '一场训练，如何变成个性化洞察', `<div class="d3-chart d3-product-loop" data-chart="productLoop" aria-label="从球鞋传感器到手机、云端和个性化反馈的数据产品闭环"></div><p class="chart-caption">个人数据只有和自己的长期记录、同类人群放在一起比较，才可能变成有用的训练建议。</p>`, {kicker:'DATA PRODUCT LOOP · BLE → QUIC → INSIGHT'}),
  S('话题二 · 可穿戴', '五个系统必须一起设计', `<div class="d3-chart d3-system" data-chart="system" aria-label="五个系统围绕数据契约协同"></div>${evidence('协同原则','五个系统围绕同一份数据契约并行推进；它们之间是来回反馈，不是做完一个再交给下一个。')}`, {kicker:'CO-DESIGN · CONTRACT AT THE CENTER'}),
  S('话题二 · 可穿戴', '架构决策：<br>两只鞋如何通信？', `<div class="decision-matrix"><div class="dm-head"><span>连接方式</span><span>手机压力</span><span>同步难度</span><span>额外硬件</span><span>适合场景</span></div><div class="dm-row"><b>A</b><strong>双鞋 → 手机</strong><span class="level high">高</span><span class="level mid">中</span><span>无</span><em>个人原型</em></div><div class="dm-row"><b>B</b><strong>副鞋 → 主鞋 → 手机</strong><span class="level low">低</span><span class="level high">高</span><span>无</span><em>连接受限</em></div><div class="dm-row"><b>C</b><strong>双鞋 → 身体中继</strong><span class="level low">低</span><span class="level low">低</span><span>中继器</span><em>稳定训练</em></div><div class="dm-row"><b>D</b><strong>双鞋 → 场边接收器</strong><span class="level low">低</span><span class="level low">低</span><span>接收器</span><em>多人团队</em></div></div><p class="muted" style="margin-top:18px">这张表不给答案，只把原本藏着的取舍摆到台面上，方便讨论和实测。</p>`, {kicker:'ARCHITECTURE DECISION MATRIX'}),
  S('话题二 · 可穿戴', 'AI 可以列选项，不能替你拍板', `${cards([
    ['找全维度','功耗、同步、丢包、遮挡、成本、单点故障。'],
    ['说清假设','把“手机能稳定连两只鞋”写成待验证的判断。'],
    ['安排实验','两种连接方式、同一场地、同一动作，比较实测数据。']
  ])}${evidence('决策记录','保留有哪些选择、为什么这样选、什么证据会推翻它，以及何时需要重做判断。')}`, {kicker:'AI AS DECISION SUPPORT'}),
  S('话题二 · 可穿戴', '买硬件之前，<br>先定义数据契约', `<div class="packet-map"><div class="packet-label">遥测数据包</div><div class="packet-segments"><div class="identity"><span>身份</span><b>设备编号</b><b>会话编号</b></div><div class="ordering"><span>顺序与时间</span><b>序列号</b><b>设备时间</b><b>采样率</b></div><div class="payload"><span>运动数据</span><b>加速度</b><b>角速度</b></div><div class="health"><span>状态</span><b>电量</b><b>固件版本</b><b>质量标志</b></div></div><div class="packet-questions"><span>丢包检测</span><i>·</i><span>双脚对时</span><i>·</i><span>向前兼容</span><i>·</i><span>质量传播</span></div></div>`, {kicker:'DATA CONTRACT · BOUNDARY FIRST'}),
  S('话题二 · 可穿戴', '字段不难，语义才难', `<div class="grid-2"><div>${list(['一个数据包放几个采样点？','如何发现和补回丢失的数据？','设备本地保存多久？','要不要压缩、要不要重传？'])}</div><div>${list(['设备时间怎样和手机对齐？','两只鞋怎样对齐？','新旧版本怎样共存？','数据质量怎样一路传到云端？'])}</div></div>`, {kicker:'SEMANTICS > FIELDS'}),
  S('话题二 · 可穿戴', '硬件没到，也可以先动手', `${flow(['定义格式','模拟传感器数据','Rust 解析核心','iOS 训练会话','云端入口','可视化与模型','换上真实硬件'])}<div class="grid-3" style="margin-top:30px"><div class="card compact"><h3>正常数据</h3><p>稳定频率与双脚同步</p></div><div class="card compact"><h3>故障数据</h3><p>丢包、乱序、时钟漂移</p></div><div class="card compact"><h3>容量数据</h3><p>多人并发与长时间训练</p></div></div>`, {kicker:'DIGITAL TWIN FIRST'}),
  S('话题二 · 可穿戴', '平均功耗，往往最会骗人', `<div class="grid-2"><div class="stat"><strong>AVG ≠ REAL</strong><span>规格书上的平均值不能直接相加</span></div><div>${list(['无线发射峰值与重传','传感器启动与 Flash 写入','电源转换效率与 CPU 活跃时间','低温、电池老化与容量衰减'])}</div></div>`, {kicker:'POWER'}),
  S('话题二 · 可穿戴', '标称参数，到了现场都要重算', `<div class="grid-2"><div class="card"><span class="eyebrow">无线</span><h3>标称距离不是现场距离</h3><p>鞋内空间、人体遮挡、多人运动、天线方向都会改变结果。</p></div><div class="card"><span class="eyebrow">传感器</span><h3>看起来像数据，不等于可信</h3><p>偏置、噪声、温漂、安装差异和时钟漂移都藏在里面。</p></div></div>`),
  S('话题二 · 可穿戴', '供应链信息不能靠猜', `${quotation('型号、价格、库存、封装和认证状态，都要回到<strong>当下的信息</strong>逐项核实。','物料快照 · 第二来源 · 生命周期 · 认证 · 交期')}`, {kicker:'SUPPLY CHAIN'}),
  S('话题二 · 可穿戴', 'DEMO', ``, {type:'demo', kicker:'LIVE'}),
  S('话题二 · 可穿戴', '到了物理世界，只认测量结果', `<div class="huge-number">MEASURE</div><p class="lead">AI 可以帮你少走弯路，但不能替你测功耗、跑现场、看真实数据。</p>`, {type:'cover', kicker:'TOPIC 02 · CONCLUSION'}),

  // 43 转场
  S('转场', '从测量物理信号，<br>到建立读者信任', `<p class="lead">知识产品同样需要校准：事实靠来源，结构靠概念依赖，表达靠审稿，最终由读者理解来验证。</p>${chip(['SIGNAL → SOURCE','CALIBRATION → REVIEW','DATA → EXPLANATION'])}`, {type:'cover', transition:true, kicker:'FROM ATOMS TO IDEAS', visual:VISUALS.hardwareToKnowledge}),

  // 44–57 Book
  S('话题三 · AI 写书', '03<br><span class="accent">构建长期一致的知识系统</span>', `<p class="lead">单独写好一章不难，难的是几十万字始终讲同一件事、使用同一套概念，并且每个事实都有来处。</p>${chip(['PLAN','RESEARCH','DRAFT','REVIEW','BUILD'])}`, {type:'cover', kicker:'TOPIC 03 · KNOWLEDGE', visual:VISUALS.book}),
  S('话题三 · AI 写书', '写一本书，也是一项系统工程', `<div class="engineering-bridge"><div class="bridge-head"><span>软件工程</span><i>解决同类问题</i><span>写书</span></div><div><b>产品需求</b><i>先明确为谁服务</i><strong>读者约定</strong></div><div><b>系统架构</b><i>组织长期结构</i><strong>全书主线</strong></div><div><b>接口契约</b><i>保持边界一致</i><strong>术语与概念约定</strong></div><div><b>依赖关系图</b><i>安排先后关系</i><strong>知识脉络</strong></div><div><b>测试与检查</b><i>阻止错误进入</i><strong>事实与文风审查</strong></div><div><b>构建与发布</b><i>产生最终交付物</i><strong>PDF 与版本发布</strong></div></div>`),
  S('话题三 · AI 写书', '把“记忆”搬进仓库', `<div class="code">books/&lt;book-name&gt;/\n├── <span class="s">AGENTS.md</span>\n├── bukit.yaml\n├── <span class="s">plan/</span>\n├── <span class="s">chapters/</span>\n├── docs/{research,reviews}/\n├── assets/\n├── drafts/\n└── output/</div><p class="muted" style="margin-top:22px">不要让 Agent 记住整本书；让仓库记住最重要的约束。</p>`, {kicker:'REPOSITORY AS MEMORY'}),
  S('话题三 · AI 写书', '先想清楚读者怎样学会，再排目录', `<div class="compare"><div class="compare-side"><span class="eyebrow">知识点目录</span><p>基础 → 原理 → 算法 → 应用</p><p class="muted">容易写成一摞彼此松散的文章。</p></div><div class="versus">转变</div><div class="compare-side highlight"><span class="eyebrow">学习过程</span><p>现在懂什么 → 卡在哪里 → 最后能判断什么</p><p class="muted">让读者沿着一条主线逐步建立能力。</p></div></div>`),
  S('话题三 · AI 写书', '梳理全书的知识脉络', `${flow(['数据','表示','模型','损失','优化','泛化','评估','部署','反馈'])}<div class="grid-2" style="margin-top:30px"><div class="card compact"><h3>前置知识</h3><p>本章允许假设读者已经理解什么？</p></div><div class="card compact"><h3>后续铺垫</h3><p>本章必须留下哪个概念，供后文继续使用？</p></div></div>`, {kicker:'KNOWLEDGE PATH'}),
  S('话题三 · AI 写书', '写作约定，决定一本书的边界', `<div class="grid-2"><div>${list(['面向没有机器学习经验的软件工程师','先讲工程直觉，再引入数学','文字严肃、清楚、克制','比喻必须说明在哪里会失效'])}</div><div>${list(['避免 AI 腔、翻译腔和讲义腔','公式之后必须回到工程意义','图表必须真正帮助解释','每个段落都要完成一段论证'])}</div></div>`, {kicker:'WRITING CONTRACT'}),
  S('话题三 · AI 写书', '一章书，也有自己的流水线', `<div class="chapter-pipeline"><div class="lane-labels"><span>规划</span><span>研究</span><span>写作</span><span>审查</span><span>出版</span></div><div class="pipeline-track"><div><b>全书规划</b><small>主线与读者</small></div><i>›</i><div><b>章节规划</b><small>目标与前后关系</small></div><i>›</i><div><b>资料汇编</b><small>问题与来源</small></div><i class="gate">◆</i><div><b>初稿</b><small>从直觉写到判断</small></div><i>›</i><div><b>三类审查</b><small>技术 · 结构 · 文风</small></div><i class="gate">◆</i><div><b>事实与图表</b><small>证据与解释</small></div><i>›</i><div><b>排版发布</b><small>构建与人工审校</small></div></div><div class="pipeline-gates"><span>第一道门：来源足以支撑写作</span><span>第二道门：审查发现的问题已经解决</span></div></div>`, {kicker:'CHAPTER PRODUCTION PIPELINE'}),
  S('话题三 · AI 写书', '一章内容，应该怎样讲清楚？', `<div class="formula"><span class="accent">直觉</span> → 机制 → 表达 → 边界 → 工程判断</div><div class="grid-3" style="margin-top:34px"><div class="card compact"><h3>动笔之前</h3><p>全书规划、章节规划</p></div><div class="card compact"><h3>写作材料</h3><p>研究资料、相邻章节</p></div><div class="card compact"><h3>写完之后</h3><p>分角色审查与构建</p></div></div>`, {kicker:'WRITING ORDER'}),
  S('话题三 · AI 写书', '四种常见失败', `${cards([
    ['没有主线','每一章单看都不错。'],
    ['文风漂移','越写越像不同作者。'],
    ['读起来合理，事实却不存在','流畅的语言掩盖了事实错误。'],
    ['像课程讲义','定义、列表与模板化结构。']
  ],4)}${evidence('对应护栏','知识脉络 / 写作契约 / 资料汇编 / 独立结构审查。')}`, {kicker:'FAILURE MODES'}),
  S('话题三 · AI 写书', '技术图，不能靠生成式图片', `<div class="compare"><div class="compare-side highlight"><span class="eyebrow">代码 / SVG</span><h3>需要准确的图</h3><p>数据图、坐标图、流程图；保留生成脚本，随时可以重建。</p></div><div class="versus">分工</div><div class="compare-side"><span class="eyebrow">生成式图片</span><h3>负责叙事和氛围</h3><p>适合封面与插画；每一张都要经过人工检查。</p></div></div>`),
  S('话题三 · AI 写书', '排版和发布，也交给流水线', `${flow(['Markdown / DSL','bukit','Typst','PDF','Git 标签','GitHub Actions','发布'])}<div class="chips">${['可重复构建','版本可追踪','可以比较修改','自动发布','多种格式'].map(x=>`<span class="chip">${x}</span>`).join('')}</div>`, {kicker:'PUBLISHING PIPELINE'}),
  S('话题三 · AI 写书', 'AI 写书的真实成本', `<div class="grid-4"><div class="stat"><strong>400–500</strong><span>页 / 本</span></div><div class="stat"><strong>25h+</strong><span>Agent 工作</span></div><div class="stat"><strong>40–50%</strong><span>周额度</span></div><div class="stat"><strong>5–10h</strong><span>人工审校</span></div></div><p class="lead" style="margin-top:46px">AI 没有一键写完一本书，只是把数月的重复劳动压缩进一条更紧凑的流程。</p>`, {kicker:'REALITY CHECK'}),
  S('话题三 · AI 写书', 'DEMO', ``, {type:'demo', kicker:'LIVE'}),
  S('话题三 · AI 写书', '一本书，最后要过读者这一关', `<div class="huge-number">TRUST</div><p class="lead">事实有没有来源，论证能不能读懂，整本书是否值得信任。</p>`, {type:'cover', kicker:'TOPIC 03 · CONCLUSION'}),

  // 统一方法论
  S('转场', '项目不同，做成事的方法相通', `<p class="lead">代码、设备和书稿看起来毫不相干；但都要先说清目标和边界，再让执行接受反馈，最后把教训留在项目里。</p>${chip(['SPEC','EXECUTION','VERIFICATION','MEMORY'])}`, {type:'cover', transition:true, kicker:'THREE WORLDS · ONE LOOP', visual:VISUALS.converge}),
  S('统一方法论', '三个项目，用的是同一套方法', `<div class="case-convergence"><div class="cc-lanes"><div><span>软件</span><b>协议与兼容性</b><strong>测试 / 性能基准</strong></div><div><span>硬件</span><b>功耗、无线、端云</b><strong>测量 / 现场数据</strong></div><div><span>知识</span><b>事实、结构、文风</b><strong>来源 / 审稿 / 读者</strong></div></div><div class="cc-arrows"><i>↘</i><i>→</i><i>↗</i></div><div class="cc-loop"><b>验证闭环</b><span>意图 → 约束 → 执行</span><span>验证 → 审查 → 留存</span></div></div>${evidence('共同点','工程对象虽然不同，可靠性都来自外部证据，也都要把每次修正留给下一次工作。')}`, {kicker:'THREE WORLDS · ONE METHOD'}),
  S('统一方法论', '把一次失败变成下一次的起点', `${flow(['意图<br><small>问题与目标</small>','约束<br><small>边界与预算</small>','规格<br><small>可执行的描述</small>','拆分<br><small>阶段与里程碑</small>','执行<br><small>研究与实现</small>','验证<br><small>测试 / 测量 / 审稿</small>','记忆<br><small>Git / 规格 / 工作方法</small>'])}<div class="loop-example"><b>一次失败怎样留下价值：</b><span>S3 XML 解析错误</span><i>→</i><span>新增回归测试</span><i>→</i><span>补充协议规格</span><i>→</i><span>以后不再犯同样的错</span></div>`, {kicker:'THE LOOP'}),
  S('统一方法论', '人的工作发生了什么变化？', `<div class="compare"><div class="compare-side"><span class="eyebrow">过去</span>${flow(['理解','设计','编码','调试','测试'])}</div><div class="versus">转变</div><div class="compare-side highlight"><span class="eyebrow">现在</span>${list(['定义问题与约束','设计验证方法','拆分和调度任务','审查产物','处理例外与未知'])}</div></div>`),
  S('统一方法论', '实现变便宜了，这四件事依然昂贵', cards([
    ['架构判断','在多种可行方案中做取舍。'],
    ['责任','为最终产物与后果负责。'],
    ['验证','把“看起来对”变成证据。'],
    ['品味','知道什么值得留下。']
  ],4)),
  S('统一方法论', '十条原则 · 01—05', `<div class="grid-2"><div>${list(['把重要上下文写进仓库','先定义成功与非目标','以端到端纵向切片推进','先写验收条件，再生成实现','用确定性工具约束概率性模型'])}</div><div class="card"><span class="eyebrow">共同结构</span><h3>上下文 → 契约 → 反馈</h3><p>系统是否稳定，不能只看模型有多强。</p></div></div>`, {kicker:'PRINCIPLES'}),
  S('统一方法论', '十条原则 · 06—10', `<div class="grid-2"><div>${list(['研究、设计、实现和审查由不同角色承担','AI 负责铺开，人负责方向与质量','软件靠测试，硬件靠测量，写作靠来源','把每次修正写进规格、工作方法、测试或规则','AI 会放大工程纪律带来的差距'])}</div><div class="card"><span class="eyebrow">越用越值钱的资产</span><h3>不是某一次提示词</h3><p>而是项目里不断积累的工程记忆。</p></div></div>`, {kicker:'PRINCIPLES'}),

  // 话题四：AI 时代的软件开发与职业规划
  S('转场', '当 AI 能独立执行任务，工程师还负责什么？', `<p class="lead">前三个案例讲的是怎样和 AI 一起交付。接下来要问：当这种能力越来越普遍，团队怎么分工，个人又该把时间花在哪里？</p>${chip(['交付 → 方向','产出 → 结果','工具 → 能力'])}`, {type:'cover', transition:true, kicker:'FROM METHOD TO CAREER', visual:VISUALS.systemToCareer}),
  S('话题四 · 下一站：工程师的未来', '04<br><span class="accent">下一站：工程师的未来</span>', `<p class="lead">AI 改变的不只是编码速度，也会改变我们怎样衡量产出、怎样组织团队，以及工程师靠什么建立长期价值。</p>${chip(['SOFTWARE','TEAM','CAREER','RESPONSIBILITY'])}`, {type:'cover', kicker:'TOPIC 04 · THE ENGINEER', visual:VISUALS.futureEngineer}),
  S('话题四 · 下一站：工程师的未来', '软件产出，该怎么衡量？', `<div class="production-shift"><div><span>过去</span><strong>代码行 / PR</strong><p>关心“写了多少、合了多少”。</p></div><i>→</i><div class="active"><span>接下来</span><strong>经过验证的新能力</strong><p>从需求、实现、测试一直到运行证据。</p></div></div>${evidence('看结果','别数 Agent 生成了多少文件，要看系统最后多了什么：能不能验证、能不能维护、能不能长期运行。')}`, {kicker:'UNIT OF PRODUCTION'}),
  S('话题四 · 下一站：工程师的未来', '开发不再是一条单向流水线', `<div class="d3-chart d3-lifecycle" data-chart="lifecycle" aria-label="AI 时代开发生命周期注意力变化"></div><p class="chart-caption">实现会越来越快，更多工程注意力将回到问题定义、验证和运行中的真实反馈。</p>`, {kicker:'LIFECYCLE SHIFT'}),
  S('话题四 · 下一站：工程师的未来', '团队不会消失，协作方式会变', `<div class="team-topology"><div class="human-node"><b>负责人</b><span>方向 · 取舍 · 责任</span></div><div class="agent-ring"><span>研究</span><span>规格</span><span>实现</span><span>测试</span><span>审查</span><span>运行</span></div><div class="feedback-node"><b>真实反馈</b><span>用户 · 测试 · 生产</span></div></div>${evidence('组织变化','更少的人可以负责更大的工程范围，但角色、权限、反馈和出问题后的接管路径必须先设计清楚。')}`, {kicker:'TEAM TOPOLOGY'}),
  S('话题四 · 下一站：工程师的未来', '哪些工作会变便宜，哪些能力会更值钱？', `<div class="d3-chart d3-value" data-chart="value" aria-label="工程能力价值矩阵"></div>`, {kicker:'VALUE MATRIX'}),
  S('话题四 · 下一站：工程师的未来', '未来工程师的四层能力', `<div class="moat-stack"><div style="--w:52%"><b>04 · 领导力与品味</b><span>决定什么值得做</span></div><div style="--w:66%"><b>03 · 验证与责任</b><span>知道怎样证明正确</span></div><div style="--w:80%"><b>02 · 系统与领域</b><span>理解约束和长期结构</span></div><div style="--w:94%"><b>01 · 工具与实现</b><span>熟练调用模型和自动化</span></div></div><p class="muted" style="margin-top:24px">工具最容易学会，也最容易被复制；越往上，越需要长期实践。</p>`, {kicker:'CAREER MOAT'}),
  S('话题四 · 下一站：工程师的未来', '个人贡献者和管理者，各自要补什么？', `<div class="career-paths"><div><span class="eyebrow">个人贡献者</span><h3>成为系统型工程师</h3>${list(['扎进一个真实领域','设计可执行的项目上下文','建立可靠的验证工具','对跨组件结果负责'])}</div><div><span class="eyebrow">工程管理者</span><h3>重新设计团队协作</h3>${list(['划分人和 Agent 的权限','设计任务与接管路径','管理质量、成本和风险','把团队经验写进系统'])}</div></div>`, {kicker:'TWO PATHS'}),
  S('话题四 · 下一站：工程师的未来', '接下来一年，可以从哪里开始？', `<div class="d3-chart d3-roadmap" data-chart="roadmap" aria-label="工程师 30、90、365 天行动路线"></div>`, {kicker:'ACTION PLAN'}),
  S('话题四 · 下一站：工程师的未来', '答案越来越便宜，问题反而更重要', `${quotation('工具能替我们回答问题，却不能替我们决定：<em>什么值得追问，什么值得做成现实。</em>','好奇心让我们继续追问；想象力让我们看见还不存在的可能。')}`, {kicker:'CURIOSITY'}),
  S('话题四 · 下一站：工程师的未来', '想象力，也是一种工程能力', `${cards([
    ['看见需要','发现那些还没有被说清楚的问题。'],
    ['提出可能','敢于设想今天尚不存在的产品与体验。'],
    ['动手验证','把“不可能”拆成一个个可以检验的假设。'],
    ['接受修正','让现实改变方案，而不是只捍卫最初的想法。']
  ],4)}${evidence('缺一不可','没有想象力，AI 只会更快地重复昨天；没有验证，想象力也只能停在故事里。')}`, {kicker:'IMAGINATION'}),
  S('话题四 · 下一站：工程师的未来', '理解与责任不能外包', `<div class="responsibility-map"><div class="delegation-core"><span>可以委托</span><b>实现</b><small>生成 · 修改 · 执行</small></div><div class="responsibility-boundary">人的责任边界</div><div class="responsibility-items"><div><span>01</span><b>解释</b><small>为什么这样设计</small></div><div><span>02</span><b>识别未知</b><small>模型不知道什么</small></div><div><span>03</span><b>接管失败</b><small>缩小并解决问题</small></div><div><span>04</span><b>承担后果</b><small>安全 · 成本 · 用户</small></div></div></div>`, {kicker:'RESPONSIBILITY BOUNDARY'}),
  S('话题四 · 下一站：工程师的未来', '不要和 AI 比谁写得更快', `<div class="manifesto-quote"><span class="quote-mark">“</span><p>去成为那个<br><em>定义方向</em>、<em>设计系统</em>、<em>建立证据</em><br>并对结果负责的人。</p><div class="manifesto-rule"></div><footer><span>方向</span><span>系统</span><span>证据</span><span>责任</span></footer></div>`, {type:'manifesto', kicker:'TOPIC 04 · CONCLUSION'}),
  S('结束', '当实现不再稀缺', `<div class="future-questions"><p>我们会做出更多真正有用的软件，<br>还是更多没人需要的功能？</p><p>当一个人可以调度一支 Agent 团队，<br>权力和责任应该怎样分配？</p><p>当代码随时可以重写，<br>什么仍然值得我们长期维护？</p></div>`, {kicker:'QUESTIONS FOR THE FUTURE'}),
  S('结束', '我们想把未来带向哪里？', `<div class="future-questions future-questions-final"><p>哪些判断，永远不该交给模型？</p><p>当每个人都能快速创造，什么让一个作品值得信任？</p><p>AI 省下的时间，能否让我们更理解人、更敢于探索未知？</p><p>十年后回头看，我们希望 AI 放大的只是效率，<br>还是人的好奇心、想象力与责任感？</p></div>`, {kicker:'THE FUTURE IS A CHOICE'}),
  S('结束', 'AI 让实现变得廉价', `${quotation('<em>定义问题</em>、<em>建立反馈</em>和<em>判断质量</em>，正在成为工程师最昂贵的能力。','BUILD THE SYSTEM · NOT THE PROMPT')}`, {type:'cover', kicker:'谢谢 · Q&A'})
];

window.SLIDE_CONTENT = slides;
