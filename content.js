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

const slides = [
  // 01–06 开场
  S('开场', '把 AI 变成<br><span class="accent">工程团队</span>', `<p class="lead">从 Rust 云服务、可穿戴设备<br>到 500 页技术书</p>${chip(['AI NATIVE ENGINEERING','3 TOPICS','≈60 SLIDES'])}`, {type:'cover', kicker:'AI NATIVE ENGINEERING · 2026', visual:VISUALS.hero}),
  S('开场', '今天不讲<br>“如何用 AI 写代码”', `<div class="compare"><div class="compare-side"><span class="eyebrow">NOT THIS</span><h3>Prompt 技巧合集</h3><p>一次对话、一次生成；效果依赖当时的上下文与运气，错误不会自动沉淀。</p></div><div class="versus">SHIFT</div><div class="compare-side highlight"><span class="eyebrow">THIS</span><h3>可持续工程系统</h3><p>规则进入仓库，任务有退出标准，失败能被机器读取，修正成为下一次执行的默认能力。</p></div></div>${evidence('判断标准','关掉当前对话后，下一位 Agent 是否仍然知道怎么正确地继续工作？')}`),
  S('开场', '三个产物，<br>三个工程世界', cards([
    ['Rustack','约 8 MB、本地启动不到 1 秒的 AWS 模拟器'],
    ['可穿戴设备','从鞋上传感器到云端 ML 的完整设计'],
    ['AI 写书','两本可自动编译、发布的中文技术书']
  ]), {kicker:'THE ARTIFACTS'}),
  S('开场', '这些东西是 AI<br>“生成”出来的吗？', `<p class="quote">不是。AI 生成了大量代码和内容，但真正让项目成立的是一套工程闭环。</p>`, {kicker:'THE QUESTION'}),
  S('开场', '从助手到系统', `${flow(['代码补全','对话式编程','Agent 执行任务','Spec 驱动开发','多角色协作','AI 工程系统'])}<p class="muted" style="margin-top:34px">能力没有突然跃迁；组织能力在持续叠加。</p>`, {kicker:'EVOLUTION'}),
  S('开场', 'AI 工程产能公式', `<div class="formula"><span class="accent">产能</span> = 模型能力 × 上下文质量 × 任务分解<br>　　 × 反馈速度 × 验证强度 × 人的判断</div><p class="lead" style="margin-top:32px">任何一项接近零，整个系统都会失效。</p>`, {kicker:'THE EQUATION'}),

  // 07–22 Rustack 16
  S('话题一 · Rustack', '01<br><span class="accent">构建协议型软件系统</span>', `<p class="lead">目标不是“写出很多 Handler”，而是建立一个能被 AWS SDK、兼容性套件和 Benchmark 反复检验的协议实现系统。</p>${chip(['18 SERVICES','779 ROUTES','&lt; 1s BOOT','≈ 8MB'])}`, {type:'cover', kicker:'TOPIC 01 · SOFTWARE', visual:VISUALS.rustack}),
  S('话题一 · Rustack', '为什么做 Rustack？', `<div class="grid-2"><div>${list(['CI：每个 Job 都能快速拉起独立环境','本地开发：行为确定，不依赖云端账号与网络','集成测试：失败可以稳定复现','交付：单二进制与小镜像降低分发成本'])}</div><div class="card"><span class="eyebrow">PRODUCT THESIS</span><h3>不是“另一个 AWS”</h3><p>而是为 SDK 测试与本地开发优化的协议兼容层。</p>${chip(['单二进制','< 1s 启动','低内存','小镜像'])}</div></div>`, {kicker:'PROBLEM / OPPORTUNITY'}),
  S('话题一 · Rustack', '先缩小成功的定义', `<div class="compare"><div class="compare-side"><span class="eyebrow">NON-GOALS</span>${list(['第一天支持全部 AWS 服务','重现 AWS 内部实现','用 Route 数量代替行为正确性'])}</div><div class="versus">BOUNDARY</div><div class="compare-side highlight"><span class="eyebrow">SUCCESS</span>${list(['官方 SDK 无需业务代码改造即可连接','同一输入得到可重复的响应与错误','外部兼容性套件持续量化差距'])}</div></div>${evidence('验收问题','用户现有的 AWS 集成测试，能否只改 endpoint 就运行？')}`, {kicker:'SCOPE BEFORE CODE'}),
  S('话题一 · Rustack', '第一个纵向切片：S3', `<div class="architecture"><div class="node"><small>01</small><h3>客户端</h3><p>AWS CLI / SDK</p></div><div class="node"><small>02</small><h3>HTTP 协议</h3><p>路由、签名、XML</p></div><div class="node"><small>03</small><h3>业务逻辑</h3><p>Bucket / Object</p></div><div class="node"><small>04</small><h3>存储与响应</h3><p>内存后端</p></div></div>`, {kicker:'VERTICAL SLICE'}),
  S('话题一 · Rustack', '为什么是 S3？', `${cards([
    ['协议面够宽','REST-XML、SigV4、Streaming、Range、错误响应。'],
    ['状态语义够深','Versioning、Delete Marker、Multipart 生命周期。'],
    ['反馈生态成熟','AWS SDK、MinIO Mint、Ceph 测试给出外部信号。']
  ])}${evidence('纵向切片的价值','一次暴露路由、认证、序列化、存储、错误模型与客户端兼容六类问题。')}`),
  S('话题一 · Rustack', 'AI 最擅长的不是发明，<br>而是<span class="accent">展开</span>', `${flow(['Smithy Model','Rust 类型','协议绑定','Handler','单元测试','兼容测试'])}<p class="lead" style="margin-top:42px">重复结构 + 细微差异 + 明确参照，是 Agent 的高价值区。</p>`, {kicker:'EXPANSION'}),
  S('话题一 · Rustack', '一个好的 Phase，<br>是可验证的能力增量', `<div class="timeline"><div class="timeline-item"><b>模型与类型</b><span>能编译模型</span></div><div class="timeline-item"><b>签名</b><span>通过 SigV4 向量</span></div><div class="timeline-item"><b>协议层</b><span>SDK 请求可解析</span></div><div class="timeline-item"><b>Service</b><span>CRUD 端到端</span></div><div class="timeline-item"><b>自有协议栈</b><span>移除 s3s</span></div><div class="timeline-item"><b>兼容修复</b><span>外部套件回归</span></div></div>${evidence('Phase 退出标准','必须是用户可观察的能力或机器可判断的结果，不能只是“新增了 20 个文件”。')}`, {kicker:'PHASE ≠ FILE BATCH'}),
  S('话题一 · Rustack', 'Prompt 是一次性的，<br>Context 可以演进', `<div class="stack"><div class="stack-layer"><b>AGENTS.md</b><span>长期工程规则</span></div><div class="stack-layer"><b>Skills</b><span>可重复工作流程</span></div><div class="stack-layer"><b>Specs</b><span>当前系统的具体设计</span></div><div class="stack-layer"><b>Tests</b><span>机器可读的事实边界</span></div></div>`, {kicker:'PROJECT CONTEXT'}),
  S('话题一 · Rustack', 'AGENTS.md：<br>项目的操作系统', `<div class="grid-2"><div>${list(['不允许 TODO 与半成品','错误处理与并发模型','类型、安全和资源限制','Rust 工具链与依赖要求'])}</div><div class="code"><span class="c"># Definition of Done</span>\n<span class="f">cargo build</span>\n<span class="f">cargo test</span>\n<span class="f">cargo fmt --check</span>\n<span class="f">cargo clippy -- -D warnings</span></div></div>`, {kicker:'RULES THAT EXECUTE'}),
  S('话题一 · Rustack', 'Spec 不是文档，<br>是 Agent 之间的接口', `<table class="mini-table"><thead><tr><th>DOCUMENT</th><th>SPEC</th></tr></thead><tbody><tr><td>解释系统</td><td>约束系统</td></tr><tr><td>给人阅读</td><td>给人和 Agent 执行</td></tr><tr><td>可以模糊</td><td>减少实现猜测</td></tr><tr><td>描述功能</td><td>边界、错误、测试、退出标准</td></tr></tbody></table>`, {kicker:'CONTRACT'}),
  S('话题一 · Rustack', '从 Phase 到交付', `${flow(['读取 Phase','读取上下文','先补齐 Spec','依赖顺序实现','质量门禁','退出标准','独立 Review'])}<p class="muted" style="margin-top:34px">先让另一位工程师“可以独立实现”，再写生产代码。</p>`, {kicker:'EXECUTION LOOP'}),
  S('话题一 · Rustack', '不要让同一个 Agent<br>包办所有角色', `<div class="grid-3"><div class="card compact"><h3>Research</h3><p>收集事实与未知</p></div><div class="card compact"><h3>Spec</h3><p>约束边界与设计</p></div><div class="card compact"><h3>Implementation</h3><p>按依赖实现</p></div><div class="card compact"><h3>Test</h3><p>构造失败信号</p></div><div class="card compact"><h3>Reviewer</h3><p>独立检查产物</p></div><div class="card compact"><h3>Human</h3><p>方向与最终责任</p></div></div>`, {kicker:'SEPARATION OF CONCERNS'}),
  S('话题一 · Rustack', '外部测试，是最好的<br>AI 教师', `<div class="metric-layout"><div><div class="metric-change"><span>40</span><i>→</i><span>80<sup>%+</sup></span></div><p>Alternator 测试把“看起来能用”拆成数百个具体语义差距。</p></div><div>${list(['表达式：优先级、保留字、Nested path','数值：十进制精度与比较语义','响应：ReturnValues 与分页边界','约束：1 MB 限制与 Validation 顺序'])}</div></div>${evidence('关键变化','Agent 不再猜“DynamoDB 应该怎样”，而是针对可复现的失败补齐最小语义。')}`, {kicker:'MACHINE-READABLE FEEDBACK'}),
  S('话题一 · Rustack', 'AI 不怕测试失败', `<p class="quote">AI 怕的是没有高质量、机器可读的失败信号。</p><div class="formula" style="margin-top:36px">失败测试 → 定位协议语义 → 小范围修改 → 回归验证</div>`, {kicker:'THE REAL FEEDBACK LOOP'}),
  S('话题一 · Rustack', '现场 Demo：<br>展示修复，不展示魔术', `<div class="grid-2"><div>${list(['启动固定版本 Rustack','CLI 操作 S3','SDK 操作 DynamoDB','触发一个已有失败测试'])}</div><div class="card"><span class="eyebrow">6–8 MIN</span><h3>失败 → 定位 → 修改 → 通过</h3><p>边界清楚、结果可验证、随机性可控。</p></div></div>`, {kicker:'DEMO DESIGN'}),
  S('话题一 · Rustack', 'Rustack 的复利资产', cards([
    ['规则','把工程品味写进仓库。'],
    ['Specs','让设计可执行、可审查。'],
    ['测试','把兼容性变成反馈信号。'],
    ['Skills','让正确流程可以重复。']
  ],4), {kicker:'TAKEAWAY'}),
  S('话题一 · Rustack', '软件世界的<br>最终验证者', `<div class="huge-number">TEST</div><p class="lead">协议、兼容性、Benchmark 与独立 Review。</p>`, {type:'cover', kicker:'TOPIC 01 · CONCLUSION'}),

  // 23 中场
  S('转场', '从可重复的测试，<br>到不可忽略的现实', `<p class="lead">软件里的失败可以重放；物理世界还会加入温度、遮挡、冲击、噪声和人的动作。</p>${chip(['TEST → MEASURE','CODE → SIGNAL','ASSUMPTION → EXPERIMENT'])}`, {type:'cover', transition:true, kicker:'FROM BITS TO ATOMS', visual:VISUALS.softwareToHardware}),

  // 24–39 Wearable 16
  S('话题二 · 可穿戴', '02<br><span class="accent">打造软硬件全栈系统</span>', `<p class="lead">从脚下的 IMU、BLE 链路和手机 Session，到云端特征管线：每一个设计判断都要回到测量。</p>${chip(['EDGE','BLE','MOBILE','CLOUD','ML'])}`, {type:'cover', kicker:'TOPIC 02 · HARDWARE', visual:VISUALS.wearable}),
  S('话题二 · 可穿戴', '从产品想法开始，<br>不是从芯片开始', `<div class="compare"><div class="compare-side"><span class="eyebrow">VAGUE</span><h3>做一个足球传感器</h3><p>无法估算，也无法验收。</p></div><div class="versus">SPECIFY</div><div class="compare-side highlight"><span class="eyebrow">EXECUTABLE</span><h3>3 小时高强度运动</h3><p>明确采样、传输、延迟、并发与完整性。</p></div></div>`),
  S('话题二 · 可穿戴', '先把愿望翻译成约束', `<table class="mini-table"><thead><tr><th>用户语言</th><th>工程变量</th><th>验证方式</th></tr></thead><tbody><tr><td>训练时感觉不到</td><td>重量、厚度、安装位置</td><td>佩戴与冲击测试</td></tr><tr><td>一场训练不断线</td><td>续航、丢包、缓存深度</td><td>电流曲线与压力测试</td></tr><tr><td>多人同时使用</td><td>连接数、时隙、射频拥塞</td><td>真实场地并发测试</td></tr><tr><td>数据能用于分析</td><td>采样率、同步误差、质量标志</td><td>标注数据与算法评估</td></tr></tbody></table>`, {kicker:'CONSTRAINT SURFACE'}),
  S('话题二 · 可穿戴', 'AI 的早期价值：<br>快速建立领域地图', `${flow(['用户目标','物理量','传感器','采样与计算','通信','移动端','云端','分析体验'])}<p class="muted" style="margin-top:34px">先发现“需要知道什么”，再决定“买什么”。</p>`, {kicker:'DOMAIN MAPPING'}),
  S('话题二 · 可穿戴', '候选答案 ≠ 工程事实', `<div class="grid-2"><div>${list(['MCU / IMU / GNSS','BLE / LTE-M / NB-IoT','电源 / PCB / 天线','固件 / iOS / 云端 / ML'])}</div><div class="card"><span class="eyebrow">RETURN TO REALITY</span>${chip(['Datasheet','Reference Design','开发板实测','电流分析仪','射频测试','真实运动数据'])}</div></div>`),
  S('话题二 · 可穿戴', '端到端架构', `<div class="architecture"><div class="node"><small>EDGE</small><h3>鞋上传感器</h3><p>IMU · MCU · Flash · Battery<br>Rust Embassy</p></div><div class="node"><small>MOBILE</small><h3>接收端</h3><p>Swift UI · Rust Core<br>Session / Clock / Retry</p></div><div class="node"><small>CLOUD</small><h3>控制平面</h3><p>Auth · API · S3 · DynamoDB<br>Registry / OTA</p></div><div class="node"><small>INTELLIGENCE</small><h3>Data & ML</h3><p>Telemetry · Feature<br>Classification</p></div></div>`, {kicker:'SYSTEM VIEW'}),
  S('话题二 · 可穿戴', '必须同时设计<br>五个系统', `<div class="grid-3"><div class="card compact"><h3>Hardware</h3><p>传感器、电池、PCB、外壳</p></div><div class="card compact"><h3>Firmware</h3><p>采样、缓冲、低功耗、OTA</p></div><div class="card compact"><h3>Mobile</h3><p>连接、Session、离线、上传</p></div><div class="card compact"><h3>Control Plane</h3><p>注册、配置、版本、健康</p></div><div class="card compact"><h3>Data / ML</h3><p>清洗、对齐、特征、评估</p></div><div class="card compact"><h3>Contract</h3><p>让五个系统并行演进</p></div></div>`, {kicker:'CO-DESIGN'}),
  S('话题二 · 可穿戴', '架构决策：<br>两只鞋如何通信？', `<table class="mini-table"><thead><tr><th>OPTION</th><th>TOPOLOGY</th><th>TRADE-OFF</th></tr></thead><tbody><tr><td>A</td><td>两只鞋都连手机</td><td>直观，但占用连接与调度</td></tr><tr><td>B</td><td>副鞋 → 主鞋 → 手机</td><td>省连接，主鞋成为单点</td></tr><tr><td>C</td><td>两只鞋 → 身体 Hub</td><td>稳定，但增加硬件</td></tr><tr><td>D</td><td>直连场边接收器</td><td>适合团队，依赖场地</td></tr></tbody></table>`, {kicker:'DECISION TREE'}),
  S('话题二 · 可穿戴', '不要让 AI 选择答案', `${cards([
    ['发现维度','功耗、同步、丢包、遮挡、成本、单点故障。'],
    ['暴露假设','“手机能稳定连两只鞋”要写成待验证假设。'],
    ['设计实验','两种拓扑、同一场地、同一动作，比较数据。']
  ])}${evidence('决策记录','保留候选方案、选择理由、反证条件和需要重新评估的触发器。')}`, {kicker:'AI AS DECISION SUPPORT'}),
  S('话题二 · 可穿戴', '买硬件之前，<br>先定义数据契约', `<div class="code"><span class="k">TelemetryPacket</span> {\n  device_id, session_id, sequence_number,\n  device_timestamp, sample_rate,\n  accelerometer, gyroscope,\n  battery, firmware_version, quality_flags\n}</div>`, {kicker:'BOUNDARY FIRST'}),
  S('话题二 · 可穿戴', '数据契约里真正困难的事', `<div class="grid-2"><div>${list(['单包包含几个 Sample？','如何发现与恢复丢包？','本地保存多久？','是否压缩、是否重传？'])}</div><div>${list(['设备时间如何与手机对齐？','两只鞋如何对齐？','版本如何向前演进？','质量标志如何传播？'])}</div></div>`, {kicker:'SEMANTICS > FIELDS'}),
  S('话题二 · 可穿戴', '从 Mock 开始，<br>不要等硬件', `${flow(['定义格式','模拟传感器流','Rust 解析核心','iOS Session','云端入口','可视化 / ML','替换真实硬件'])}<div class="grid-3" style="margin-top:30px"><div class="card compact"><h3>正常流</h3><p>稳定频率与双脚同步</p></div><div class="card compact"><h3>故障流</h3><p>丢包、乱序、时钟漂移</p></div><div class="card compact"><h3>容量流</h3><p>多人并发与长 Session</p></div></div>`, {kicker:'DIGITAL TWIN FIRST'}),
  S('话题二 · 可穿戴', '失败模式 ①<br>功耗计算过于乐观', `<div class="grid-2"><div class="stat"><strong>AVG ≠ REAL</strong><span>Datasheet 平均值不能直接相加</span></div><div>${list(['无线发射峰值与重传','Sensor startup / Flash 写入','DC/DC 效率与 CPU 活跃比例','低温、电池老化与容量衰减'])}</div></div>`, {kicker:'POWER'}),
  S('话题二 · 可穿戴', '失败模式 ②<br>无线与传感器被抽象掉', `<div class="grid-2"><div class="card"><span class="eyebrow">RF</span><h3>标称距离不是现场距离</h3><p>鞋内空间、人体遮挡、多人运动、天线方向。</p></div><div class="card"><span class="eyebrow">IMU</span><h3>看起来像数据，不等于可信</h3><p>偏置、噪声、温漂、安装差异、时钟漂移。</p></div></div>`),
  S('话题二 · 可穿戴', '失败模式 ③<br>虚构供应链确定性', `<p class="quote">型号、价格、库存、封装、认证状态，都必须实时核实。</p>${chip(['BOM SNAPSHOT','SECOND SOURCE','LIFECYCLE','CERTIFICATION','LEAD TIME'])}`, {kicker:'SUPPLY CHAIN'}),
  S('话题二 · 可穿戴', '现场 Demo：<br>一个最小纵向切片', `${flow(['模拟 / 真实 IMU','Rust Packet','iPhone / Laptop','实时波形','上传云端','Session 结果'])}<div class="card compact" style="margin-top:32px"><b class="accent">备用路径：</b> 真实设备 + 模拟数据 + 录屏，三条路径都准备。</div>`, {kicker:'DEMO DESIGN'}),
  S('话题二 · 可穿戴', '物理世界是<br>最终测试套件', `<div class="huge-number">MEASURE</div><p class="lead">AI 可以压缩学习时间，但不能替代测量、实验与现场验证。</p>`, {type:'cover', kicker:'TOPIC 02 · CONCLUSION'}),

  // 40 转场
  S('转场', '从测量物理信号，<br>到建立读者信任', `<p class="lead">知识产品同样需要校准：事实靠来源，结构靠概念依赖，表达靠审稿，最终由读者理解来验证。</p>${chip(['SIGNAL → SOURCE','CALIBRATION → REVIEW','DATA → EXPLANATION'])}`, {type:'cover', transition:true, kicker:'FROM ATOMS TO IDEAS', visual:VISUALS.hardwareToKnowledge}),

  // 41–53 Book 13
  S('话题三 · AI 写书', '03<br><span class="accent">构建长期一致的知识系统</span>', `<p class="lead">章节只是局部产物；真正的系统还包括读者契约、概念依赖、来源、审稿、构建与发布。</p>${chip(['PLAN','RESEARCH','DRAFT','REVIEW','BUILD'])}`, {type:'cover', kicker:'TOPIC 03 · KNOWLEDGE', visual:VISUALS.book}),
  S('话题三 · AI 写书', '写书，本质上也是<br>大型工程项目', `<table class="mini-table"><thead><tr><th>SOFTWARE</th><th>BOOK</th></tr></thead><tbody><tr><td>PRD</td><td>读者契约</td></tr><tr><td>系统架构</td><td>全书主线</td></tr><tr><td>API Contract</td><td>术语与概念契约</td></tr><tr><td>Dependency Graph</td><td>概念阶梯</td></tr><tr><td>Test / Lint</td><td>事实核查 / 文风检查</td></tr><tr><td>Build / Release</td><td>PDF / GitHub Release</td></tr></tbody></table>`),
  S('话题三 · AI 写书', '把“记忆”搬进仓库', `<div class="code">books/&lt;book-name&gt;/\n├── <span class="s">AGENTS.md</span>\n├── bukit.yaml\n├── <span class="s">plan/</span>\n├── <span class="s">chapters/</span>\n├── docs/{research,reviews}/\n├── assets/\n├── drafts/\n└── output/</div><p class="muted" style="margin-top:22px">不要让 Agent 记住整本书；让仓库记住最重要的约束。</p>`, {kicker:'REPOSITORY AS MEMORY'}),
  S('话题三 · AI 写书', '先设计读者旅程，<br>再设计目录', `<div class="compare"><div class="compare-side"><span class="eyebrow">ENCYCLOPEDIA</span><p>基础 → 原理 → 算法 → 应用</p><p class="muted">容易变成知识点堆叠。</p></div><div class="versus">STORY</div><div class="compare-side highlight"><span class="eyebrow">READER JOURNEY</span><p>现在会什么 → 缺什么 → 能判断什么</p><p class="muted">沿一条主线建立能力。</p></div></div>`),
  S('话题三 · AI 写书', '建立概念阶梯', `${flow(['数据','表示','模型','损失','优化','泛化','评估','部署','反馈'])}<div class="grid-2" style="margin-top:30px"><div class="card compact"><h3>前置契约</h3><p>本章允许假设读者已经理解什么？</p></div><div class="card compact"><h3>后续铺垫</h3><p>本章必须留下哪个概念，供后文继续使用？</p></div></div>`, {kicker:'CONCEPT LADDER'}),
  S('话题三 · AI 写书', 'Book AGENTS：<br>写作的类型系统', `<div class="grid-2"><div>${list(['面向无 ML 经验的软件工程师','先工程直觉，再引入数学','严肃、清晰、克制','比喻必须说明失效边界'])}</div><div>${list(['避免 AI 腔、翻译腔、讲义腔','公式之后回到工程意义','图表必须承担解释任务','段落必须完成论证'])}</div></div>`, {kicker:'WRITING CONTRACT'}),
  S('话题三 · AI 写书', '章节不是一个 Prompt<br>写出来的', `${flow(['全书 Plan','章节 Plan','Research','初稿','技术 / 结构 / 文风 Review','事实核查','图表','排版','人工审校'])}`, {kicker:'CHAPTER PIPELINE'}),
  S('话题三 · AI 写书', '一章如何展开？', `<div class="formula"><span class="accent">直觉</span> → 机制 → 表达 → 边界 → 工程判断</div><div class="grid-3" style="margin-top:34px"><div class="card compact"><h3>Before</h3><p>全书计划、章节计划</p></div><div class="card compact"><h3>Inputs</h3><p>研究材料、相邻章节</p></div><div class="card compact"><h3>After</h3><p>多角色 Review 与构建</p></div></div>`, {kicker:'WRITING ORDER'}),
  S('话题三 · AI 写书', '四种常见失败', `${cards([
    ['没有主线','每一章单看都不错。'],
    ['文风漂移','越写越像不同作者。'],
    ['合理但不存在','事实被流畅语言掩盖。'],
    ['像课程讲义','定义、列表与模板化结构。']
  ],4)}${evidence('对应护栏','概念阶梯 / Writing Contract / Source Dossier / 独立结构 Review。')}`, {kicker:'FAILURE MODES'}),
  S('话题三 · AI 写书', '生成式图片<br>不负责技术准确性', `<div class="compare"><div class="compare-side highlight"><span class="eyebrow">CODE / SVG</span><h3>准确性图形</h3><p>数据图、坐标图、流程图；保留生成脚本。</p></div><div class="versus">ROLE</div><div class="compare-side"><span class="eyebrow">GENERATIVE IMAGE</span><h3>叙事性图形</h3><p>封面、插画、氛围；必须进行视觉 Review。</p></div></div>`),
  S('话题三 · AI 写书', '把排版与发布<br>也工程化', `${flow(['Markdown / DSL','bukit','Typst','PDF','Git tag','GitHub Actions','Release'])}<div class="chips">${['可重复构建','版本化','可 Diff','自动发布','多格式'].map(x=>`<span class="chip">${x}</span>`).join('')}</div>`, {kicker:'PUBLISHING PIPELINE'}),
  S('话题三 · AI 写书', 'AI 写书的真实成本', `<div class="grid-4"><div class="stat"><strong>400–500</strong><span>页 / 本</span></div><div class="stat"><strong>25h+</strong><span>Agent 工作</span></div><div class="stat"><strong>40–50%</strong><span>周额度</span></div><div class="stat"><strong>5–10h</strong><span>人工审校</span></div></div><p class="lead" style="margin-top:46px">不是一键生成，而是把数月重复劳动压缩为高密度的工程流程。</p>`, {kicker:'REALITY CHECK'}),
  S('话题三 · AI 写书', '知识系统的<br>最终验证者', `<div class="huge-number">TRUST</div><p class="lead">来源、审稿、读者理解与出版质量。</p>`, {type:'cover', kicker:'TOPIC 03 · CONCLUSION'}),

  // 统一方法论
  S('转场', '三种工程对象，<br>汇入同一个闭环', `<p class="lead">代码、设备和书稿看似不同；它们都需要把意图变成约束，把执行接入反馈，再把修正沉淀为记忆。</p>${chip(['SPEC','EXECUTION','VERIFICATION','MEMORY'])}`, {type:'cover', transition:true, kicker:'THREE WORLDS · ONE LOOP', visual:VISUALS.converge}),
  S('统一方法论', '三个世界，<br>同一个工程闭环', `<table class="mini-table"><thead><tr><th>CASE</th><th>OBJECT</th><th>HARD PART</th><th>VALIDATOR</th></tr></thead><tbody><tr><td>Rustack</td><td>纯软件</td><td>协议与兼容性</td><td>测试 / Benchmark</td></tr><tr><td>可穿戴</td><td>软硬件</td><td>功耗、无线、端云</td><td>测量 / 实物 / 现场</td></tr><tr><td>AI 写书</td><td>知识内容</td><td>事实、结构、文风</td><td>来源 / 审稿 / 读者</td></tr></tbody></table>`, {kicker:'ONE METHOD'}),
  S('统一方法论', 'AI 原生工程循环', `${flow(['Intent<br><small>问题与目标</small>','Constraints<br><small>边界与预算</small>','Specs<br><small>可执行描述</small>','Decompose<br><small>Phase / Milestone</small>','Execute<br><small>研究 / 实现</small>','Verify<br><small>测试 / 测量 / 审稿</small>','Memory<br><small>Git / Spec / Skill</small>'])}<div class="loop-example"><b>一次失败如何复利：</b><span>S3 XML 解析错误</span><i>→</i><span>新增回归测试</span><i>→</i><span>补充协议 Spec</span><i>→</i><span>以后默认正确</span></div>`, {kicker:'THE LOOP'}),
  S('统一方法论', '人的工作发生了什么变化？', `<div class="compare"><div class="compare-side"><span class="eyebrow">BEFORE</span>${flow(['理解','设计','编码','调试','测试'])}</div><div class="versus">SHIFT</div><div class="compare-side highlight"><span class="eyebrow">NOW</span>${list(['定义问题与约束','设计验证方法','分解和调度任务','审查产物','处理例外与未知'])}</div></div>`),
  S('统一方法论', 'AI 降低实现成本，<br>没有降低这些成本', cards([
    ['架构判断','在多种可行方案中做取舍。'],
    ['责任','为最终产物与后果负责。'],
    ['验证','把“看起来对”变成证据。'],
    ['品味','知道什么值得留下。']
  ],4)),
  S('统一方法论', '十条原则 · 01—05', `<div class="grid-2"><div>${list(['把重要上下文写进仓库','先定义成功与非目标','以端到端纵向切片推进','先写验收条件，再生成实现','用确定性工具包围概率性模型'])}</div><div class="card"><span class="eyebrow">THE PATTERN</span><h3>Context → Contract → Feedback</h3><p>工程系统的稳定性，来自模型之外。</p></div></div>`, {kicker:'PRINCIPLES'}),
  S('统一方法论', '十条原则 · 06—10', `<div class="grid-2"><div>${list(['研究、设计、实现、Review 分角色','AI 生成广度，人控制方向与质量','软件靠测试，硬件靠测量，写作靠来源','修正沉淀为 Spec、Skill、测试或规则','AI 会放大工程纪律的价值'])}</div><div class="card"><span class="eyebrow">THE COMPOUNDING ASSET</span><h3>不是某次 Prompt</h3><p>而是可以不断复用的工程记忆。</p></div></div>`, {kicker:'PRINCIPLES'}),
  S('结束', 'AI 让实现变得廉价', `<p class="quote">定义问题、建立反馈和判断质量，正在成为工程师最昂贵的能力。</p><div class="chips" style="margin-top:50px"><span class="chip">Q&A</span><span class="chip">谢谢</span></div>`, {type:'cover', kicker:'BUILD THE SYSTEM · NOT THE PROMPT'})
];

window.SLIDE_CONTENT = slides;
