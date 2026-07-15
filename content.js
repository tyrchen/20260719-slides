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
  S('开场', '把 AI 变成<br><span class="accent">工程团队</span>', `<p class="lead">从 Rust 云服务、可穿戴设备、500 页技术书<br>到 AI 时代的工程师</p>${chip(['AI NATIVE ENGINEERING','4 TOPICS','76 SLIDES'])}`, {type:'cover', kicker:'AI NATIVE ENGINEERING · 2026', visual:VISUALS.hero}),
  S('开场', '今天不讲<br>“如何用 AI 写代码”', `<div class="compare"><div class="compare-side negative"><span class="eyebrow">临时性</span><h3>Prompt 技巧合集</h3><p>一次对话、一次生成；效果依赖当时的上下文与运气，错误不会自动沉淀。</p></div><div class="versus">SHIFT</div><div class="compare-side highlight"><span class="eyebrow">可持续性</span><h3>工程系统</h3><p>规则进入仓库，任务有退出标准，失败能被机器读取，修正成为下一次执行的默认能力。</p></div></div>${evidence('判断标准','关掉当前对话后，下一位 Agent 是否仍然知道怎么正确地继续工作？')}`),
  S('开场', '三个产物，<br>三个工程世界', `<div class="case-landscape"><div><span class="case-id">01 · 软件</span><h3>Rustack</h3><b>协议广度与兼容性</b><i>↓</i><strong>测试 · 兼容套件 · 性能基准</strong></div><div><span class="case-id">02 · 软硬件</span><h3>可穿戴设备</h3><b>功耗、无线与端云协同</b><i>↓</i><strong>仪器 · 实物 · 现场数据</strong></div><div><span class="case-id">03 · 知识</span><h3>技术书</h3><b>事实、结构与长期一致性</b><i>↓</i><strong>来源 · 审稿 · 读者理解</strong></div></div>`, {kicker:'THE ENGINEERING LANDSCAPE'}),
  S('开场', '这些东西是 AI<br>“生成”出来的吗？', quotation('<em>不是。</em> AI 生成了大量代码和内容，但真正让项目成立的是一套<strong>工程闭环</strong>。','从生成结果，转向设计能够持续交付的系统。'), {kicker:'THE QUESTION'}),
  S('开场', '从助手到系统', `<div class="d3-chart d3-evolution" data-chart="evolution" aria-label="AI 工程能力从代码补全演进到工程系统"></div><p class="chart-caption">能力没有突然跃迁；上下文、角色与反馈机制在持续叠加。</p>`, {kicker:'EVOLUTION'}),
  S('开场', 'AI 工程产能公式', `<div class="d3-chart d3-factors" data-chart="factors" aria-label="AI 工程产能因素网络"></div><p class="chart-caption">六项因素形成乘法关系：任何一项接近零，整个系统都会失效。</p>`, {kicker:'THE EQUATION'}),

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
  S('话题一 · Rustack', '不要让同一个 Agent<br>包办所有角色', `<div class="role-loop"><div class="role-human"><span>人类负责人</span><b>方向 · 取舍 · 责任</b></div><div class="role-track"><div><span>01</span><b>研究</b><small>事实与未知</small></div><i>→</i><div><span>02</span><b>规格</b><small>边界与设计</small></div><i>→</i><div><span>03</span><b>实现</b><small>按依赖展开</small></div><i>→</i><div><span>04</span><b>测试</b><small>制造失败信号</small></div><i>→</i><div><span>05</span><b>审查</b><small>独立检查</small></div></div><div class="role-feedback"><span>决策与约束 ↓</span><b>产物、证据与例外 ↑</b></div></div>`, {kicker:'ROLE SEPARATION · FEEDBACK LOOP'}),
  S('话题一 · Rustack', '外部测试，是最好的<br>AI 教师', `<div class="d3-split"><div class="d3-chart d3-compatibility" data-chart="compatibility" aria-label="DynamoDB 兼容率从约 40% 提升到 80% 以上"></div><div>${list(['表达式：优先级、保留字、Nested path','数值：十进制精度与比较语义','响应：ReturnValues 与分页边界','约束：1 MB 限制与 Validation 顺序'])}</div></div>${evidence('关键变化','测试把“看起来能用”拆成可复现的语义差距；Agent 不再猜测，而是针对证据补齐最小语义。')}`, {kicker:'MACHINE-READABLE FEEDBACK'}),
  S('话题一 · Rustack', 'AI 不怕测试失败', `${quotation('AI 怕的是没有<strong>高质量、机器可读</strong>的失败信号。','失败测试 → 定位协议语义 → 小范围修改 → 回归验证')}`, {kicker:'THE REAL FEEDBACK LOOP'}),
  S('话题一 · Rustack', 'DEMO', ``, {type:'demo', kicker:'LIVE'}),
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
  S('话题二 · 可穿戴', '一场训练，如何变成个性化洞察', `<div class="d3-chart d3-product-loop" data-chart="productLoop" aria-label="从球鞋传感器到手机、云端和个性化反馈的数据产品闭环"></div><p class="chart-caption">个人数据进入群体分布与长期历史后，才会从遥测数据变成可行动的训练反馈。</p>`, {kicker:'DATA PRODUCT LOOP · BLE → QUIC → INSIGHT'}),
  S('话题二 · 可穿戴', '必须同时设计<br>五个系统', `<div class="d3-chart d3-system" data-chart="system" aria-label="五个系统围绕数据契约协同"></div>${evidence('协同原则','五个系统围绕同一份数据契约并行演进；连接线代表接口与反馈，而不是单向交接。')}`, {kicker:'CO-DESIGN · CONTRACT AT THE CENTER'}),
  S('话题二 · 可穿戴', '架构决策：<br>两只鞋如何通信？', `<div class="decision-matrix"><div class="dm-head"><span>拓扑</span><span>手机压力</span><span>同步难度</span><span>额外硬件</span><span>适合场景</span></div><div class="dm-row"><b>A</b><strong>双鞋 → 手机</strong><span class="level high">高</span><span class="level mid">中</span><span>无</span><em>个人原型</em></div><div class="dm-row"><b>B</b><strong>副鞋 → 主鞋 → 手机</strong><span class="level low">低</span><span class="level high">高</span><span>无</span><em>连接受限</em></div><div class="dm-row"><b>C</b><strong>双鞋 → 身体中继</strong><span class="level low">低</span><span class="level low">低</span><span>中继器</span><em>稳定训练</em></div><div class="dm-row"><b>D</b><strong>双鞋 → 场边接收器</strong><span class="level low">低</span><span class="level low">低</span><span>接收器</span><em>多人团队</em></div></div><p class="muted" style="margin-top:18px">这不是答案表，而是把隐藏的取舍变成可讨论、可实验的决策面。</p>`, {kicker:'ARCHITECTURE DECISION MATRIX'}),
  S('话题二 · 可穿戴', '不要让 AI 选择答案', `${cards([
    ['发现维度','功耗、同步、丢包、遮挡、成本、单点故障。'],
    ['暴露假设','“手机能稳定连两只鞋”要写成待验证假设。'],
    ['设计实验','两种拓扑、同一场地、同一动作，比较数据。']
  ])}${evidence('决策记录','保留候选方案、选择理由、反证条件和需要重新评估的触发器。')}`, {kicker:'AI AS DECISION SUPPORT'}),
  S('话题二 · 可穿戴', '买硬件之前，<br>先定义数据契约', `<div class="packet-map"><div class="packet-label">遥测数据包</div><div class="packet-segments"><div class="identity"><span>身份</span><b>设备编号</b><b>会话编号</b></div><div class="ordering"><span>顺序与时间</span><b>序列号</b><b>设备时间</b><b>采样率</b></div><div class="payload"><span>运动数据</span><b>加速度</b><b>角速度</b></div><div class="health"><span>状态</span><b>电量</b><b>固件版本</b><b>质量标志</b></div></div><div class="packet-questions"><span>丢包检测</span><i>·</i><span>双脚对时</span><i>·</i><span>向前兼容</span><i>·</i><span>质量传播</span></div></div>`, {kicker:'DATA CONTRACT · BOUNDARY FIRST'}),
  S('话题二 · 可穿戴', '数据契约里真正困难的事', `<div class="grid-2"><div>${list(['单包包含几个 Sample？','如何发现与恢复丢包？','本地保存多久？','是否压缩、是否重传？'])}</div><div>${list(['设备时间如何与手机对齐？','两只鞋如何对齐？','版本如何向前演进？','质量标志如何传播？'])}</div></div>`, {kicker:'SEMANTICS > FIELDS'}),
  S('话题二 · 可穿戴', '从 Mock 开始，<br>不要等硬件', `${flow(['定义格式','模拟传感器流','Rust 解析核心','iOS Session','云端入口','可视化 / ML','替换真实硬件'])}<div class="grid-3" style="margin-top:30px"><div class="card compact"><h3>正常流</h3><p>稳定频率与双脚同步</p></div><div class="card compact"><h3>故障流</h3><p>丢包、乱序、时钟漂移</p></div><div class="card compact"><h3>容量流</h3><p>多人并发与长 Session</p></div></div>`, {kicker:'DIGITAL TWIN FIRST'}),
  S('话题二 · 可穿戴', '失败模式 ①<br>功耗计算过于乐观', `<div class="grid-2"><div class="stat"><strong>AVG ≠ REAL</strong><span>Datasheet 平均值不能直接相加</span></div><div>${list(['无线发射峰值与重传','Sensor startup / Flash 写入','DC/DC 效率与 CPU 活跃比例','低温、电池老化与容量衰减'])}</div></div>`, {kicker:'POWER'}),
  S('话题二 · 可穿戴', '失败模式 ②<br>无线与传感器被抽象掉', `<div class="grid-2"><div class="card"><span class="eyebrow">RF</span><h3>标称距离不是现场距离</h3><p>鞋内空间、人体遮挡、多人运动、天线方向。</p></div><div class="card"><span class="eyebrow">IMU</span><h3>看起来像数据，不等于可信</h3><p>偏置、噪声、温漂、安装差异、时钟漂移。</p></div></div>`),
  S('话题二 · 可穿戴', '失败模式 ③<br>虚构供应链确定性', `${quotation('型号、价格、库存、封装和认证状态，都必须<strong>实时核实</strong>。','物料快照 · 第二来源 · 生命周期 · 认证 · 交期')}`, {kicker:'SUPPLY CHAIN'}),
  S('话题二 · 可穿戴', 'DEMO', ``, {type:'demo', kicker:'LIVE'}),
  S('话题二 · 可穿戴', '物理世界是<br>最终测试套件', `<div class="huge-number">MEASURE</div><p class="lead">AI 可以压缩学习时间，但不能替代测量、实验与现场验证。</p>`, {type:'cover', kicker:'TOPIC 02 · CONCLUSION'}),

  // 40 转场
  S('转场', '从测量物理信号，<br>到建立读者信任', `<p class="lead">知识产品同样需要校准：事实靠来源，结构靠概念依赖，表达靠审稿，最终由读者理解来验证。</p>${chip(['SIGNAL → SOURCE','CALIBRATION → REVIEW','DATA → EXPLANATION'])}`, {type:'cover', transition:true, kicker:'FROM ATOMS TO IDEAS', visual:VISUALS.hardwareToKnowledge}),

  // 41–53 Book 13
  S('话题三 · AI 写书', '03<br><span class="accent">构建长期一致的知识系统</span>', `<p class="lead">章节只是局部产物；真正的系统还包括读者契约、概念依赖、来源、审稿、构建与发布。</p>${chip(['PLAN','RESEARCH','DRAFT','REVIEW','BUILD'])}`, {type:'cover', kicker:'TOPIC 03 · KNOWLEDGE', visual:VISUALS.book}),
  S('话题三 · AI 写书', '写书，本质上也是<br>大型工程项目', `<div class="engineering-bridge"><div class="bridge-head"><span>软件工程</span><i>共同职责</i><span>书籍工程</span></div><div><b>产品需求</b><i>定义服务对象</i><strong>读者契约</strong></div><div><b>系统架构</b><i>组织长期结构</i><strong>全书主线</strong></div><div><b>接口契约</b><i>保持边界一致</i><strong>术语与概念契约</strong></div><div><b>依赖关系图</b><i>安排先后关系</i><strong>知识脉络</strong></div><div><b>测试与检查</b><i>阻止错误进入</i><strong>事实与文风审查</strong></div><div><b>构建与发布</b><i>产生可交付物</i><strong>PDF 与版本发布</strong></div></div>`),
  S('话题三 · AI 写书', '把“记忆”搬进仓库', `<div class="code">books/&lt;book-name&gt;/\n├── <span class="s">AGENTS.md</span>\n├── bukit.yaml\n├── <span class="s">plan/</span>\n├── <span class="s">chapters/</span>\n├── docs/{research,reviews}/\n├── assets/\n├── drafts/\n└── output/</div><p class="muted" style="margin-top:22px">不要让 Agent 记住整本书；让仓库记住最重要的约束。</p>`, {kicker:'REPOSITORY AS MEMORY'}),
  S('话题三 · AI 写书', '先设计读者旅程，<br>再设计目录', `<div class="compare"><div class="compare-side"><span class="eyebrow">ENCYCLOPEDIA</span><p>基础 → 原理 → 算法 → 应用</p><p class="muted">容易变成知识点堆叠。</p></div><div class="versus">STORY</div><div class="compare-side highlight"><span class="eyebrow">READER JOURNEY</span><p>现在会什么 → 缺什么 → 能判断什么</p><p class="muted">沿一条主线建立能力。</p></div></div>`),
  S('话题三 · AI 写书', '梳理全书的知识脉络', `${flow(['数据','表示','模型','损失','优化','泛化','评估','部署','反馈'])}<div class="grid-2" style="margin-top:30px"><div class="card compact"><h3>前置知识</h3><p>本章允许假设读者已经理解什么？</p></div><div class="card compact"><h3>后续铺垫</h3><p>本章必须留下哪个概念，供后文继续使用？</p></div></div>`, {kicker:'KNOWLEDGE PATH'}),
  S('话题三 · AI 写书', 'Book AGENTS：<br>写作的类型系统', `<div class="grid-2"><div>${list(['面向无 ML 经验的软件工程师','先工程直觉，再引入数学','严肃、清晰、克制','比喻必须说明失效边界'])}</div><div>${list(['避免 AI 腔、翻译腔、讲义腔','公式之后回到工程意义','图表必须承担解释任务','段落必须完成论证'])}</div></div>`, {kicker:'WRITING CONTRACT'}),
  S('话题三 · AI 写书', '一章书，是一条生产流水线', `<div class="chapter-pipeline"><div class="lane-labels"><span>规划</span><span>研究</span><span>写作</span><span>审查</span><span>出版</span></div><div class="pipeline-track"><div><b>全书规划</b><small>主线与读者</small></div><i>›</i><div><b>章节规划</b><small>目标与依赖</small></div><i>›</i><div><b>资料汇编</b><small>问题与来源</small></div><i class="gate">◆</i><div><b>初稿</b><small>直觉到判断</small></div><i>›</i><div><b>三类审查</b><small>技术 · 结构 · 文风</small></div><i class="gate">◆</i><div><b>事实与图表</b><small>证据与解释</small></div><i>›</i><div><b>排版发布</b><small>构建与人工审校</small></div></div><div class="pipeline-gates"><span>阶段门 ①：来源足够支撑写作</span><span>阶段门 ②：审查问题已经闭环</span></div></div>`, {kicker:'CHAPTER PRODUCTION PIPELINE'}),
  S('话题三 · AI 写书', '一章如何展开？', `<div class="formula"><span class="accent">直觉</span> → 机制 → 表达 → 边界 → 工程判断</div><div class="grid-3" style="margin-top:34px"><div class="card compact"><h3>Before</h3><p>全书计划、章节计划</p></div><div class="card compact"><h3>Inputs</h3><p>研究材料、相邻章节</p></div><div class="card compact"><h3>After</h3><p>多角色 Review 与构建</p></div></div>`, {kicker:'WRITING ORDER'}),
  S('话题三 · AI 写书', '四种常见失败', `${cards([
    ['没有主线','每一章单看都不错。'],
    ['文风漂移','越写越像不同作者。'],
    ['合理但不存在','事实被流畅语言掩盖。'],
    ['像课程讲义','定义、列表与模板化结构。']
  ],4)}${evidence('对应护栏','知识脉络 / 写作契约 / 资料汇编 / 独立结构审查。')}`, {kicker:'FAILURE MODES'}),
  S('话题三 · AI 写书', '生成式图片<br>不负责技术准确性', `<div class="compare"><div class="compare-side highlight"><span class="eyebrow">CODE / SVG</span><h3>准确性图形</h3><p>数据图、坐标图、流程图；保留生成脚本。</p></div><div class="versus">ROLE</div><div class="compare-side"><span class="eyebrow">GENERATIVE IMAGE</span><h3>叙事性图形</h3><p>封面、插画、氛围；必须进行视觉 Review。</p></div></div>`),
  S('话题三 · AI 写书', '把排版与发布<br>也工程化', `${flow(['Markdown / DSL','bukit','Typst','PDF','Git tag','GitHub Actions','Release'])}<div class="chips">${['可重复构建','版本化','可 Diff','自动发布','多格式'].map(x=>`<span class="chip">${x}</span>`).join('')}</div>`, {kicker:'PUBLISHING PIPELINE'}),
  S('话题三 · AI 写书', 'AI 写书的真实成本', `<div class="grid-4"><div class="stat"><strong>400–500</strong><span>页 / 本</span></div><div class="stat"><strong>25h+</strong><span>Agent 工作</span></div><div class="stat"><strong>40–50%</strong><span>周额度</span></div><div class="stat"><strong>5–10h</strong><span>人工审校</span></div></div><p class="lead" style="margin-top:46px">不是一键生成，而是把数月重复劳动压缩为高密度的工程流程。</p>`, {kicker:'REALITY CHECK'}),
  S('话题三 · AI 写书', 'DEMO', ``, {type:'demo', kicker:'LIVE'}),
  S('话题三 · AI 写书', '知识系统的<br>最终验证者', `<div class="huge-number">TRUST</div><p class="lead">来源、审稿、读者理解与出版质量。</p>`, {type:'cover', kicker:'TOPIC 03 · CONCLUSION'}),

  // 统一方法论
  S('转场', '三种工程对象，<br>汇入同一个闭环', `<p class="lead">代码、设备和书稿看似不同；它们都需要把意图变成约束，把执行接入反馈，再把修正沉淀为记忆。</p>${chip(['SPEC','EXECUTION','VERIFICATION','MEMORY'])}`, {type:'cover', transition:true, kicker:'THREE WORLDS · ONE LOOP', visual:VISUALS.converge}),
  S('统一方法论', '三个世界，<br>同一个工程闭环', `<div class="case-convergence"><div class="cc-lanes"><div><span>软件</span><b>协议与兼容性</b><strong>测试 / 性能基准</strong></div><div><span>硬件</span><b>功耗、无线、端云</b><strong>测量 / 现场数据</strong></div><div><span>知识</span><b>事实、结构、文风</b><strong>来源 / 审稿 / 读者</strong></div></div><div class="cc-arrows"><i>↘</i><i>→</i><i>↗</i></div><div class="cc-loop"><b>验证闭环</b><span>意图 → 约束 → 执行</span><span>验证 → 审查 → 记忆</span></div></div>${evidence('共同规律','工程对象不同，可靠性都来自外部证据和持续回流的项目记忆。')}`, {kicker:'THREE WORLDS · ONE METHOD'}),
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

  // 话题四：AI 时代的软件开发与职业规划
  S('转场', '当系统可以执行，<br>工程师还负责什么？', `<p class="lead">前三个案例回答“怎样与 AI 一起交付”；下一个问题是：当这种能力成为基础设施，团队和个人应该怎样重新定位？</p>${chip(['DELIVERY → DIRECTION','OUTPUT → OUTCOME','TOOL → LEVERAGE'])}`, {type:'cover', transition:true, kicker:'FROM METHOD TO CAREER', visual:VISUALS.systemToCareer}),
  S('话题四 · 下一站：工程师', '04<br><span class="accent">下一站：工程师</span>', `<p class="lead">AI 不只改变编码速度，它会重新定义软件的生产单位、团队边界，以及工程师的职业杠杆。</p>${chip(['SOFTWARE','TEAM','CAREER','RESPONSIBILITY'])}`, {type:'cover', kicker:'TOPIC 04 · THE ENGINEER', visual:VISUALS.futureEngineer}),
  S('话题四 · 下一站：工程师', '软件的生产单位<br>正在改变', `<div class="production-shift"><div><span>过去</span><strong>代码行 / PR</strong><p>衡量“写了多少、合了多少”。</p></div><i>→</i><div class="active"><span>未来</span><strong>已验证的能力增量</strong><p>从需求、实现、测试到运行证据的完整闭环。</p></div></div>${evidence('真正的产出','不是 Agent 生成了多少文件，而是系统获得了多少可验证、可维护、可运营的新能力。')}`, {kicker:'UNIT OF PRODUCTION'}),
  S('话题四 · 下一站：工程师', '开发生命周期<br>从流水线变成反馈网', `<div class="d3-chart d3-lifecycle" data-chart="lifecycle" aria-label="AI 时代开发生命周期注意力变化"></div><p class="chart-caption">实现不再是唯一的长板；定义、验证与运行反馈会获得更多工程注意力。</p>`, {kicker:'LIFECYCLE SHIFT'}),
  S('话题四 · 下一站：工程师', '团队不会消失，<br>但拓扑会改变', `<div class="team-topology"><div class="human-node"><b>Human Lead</b><span>方向 · 取舍 · 责任</span></div><div class="agent-ring"><span>Research</span><span>Spec</span><span>Build</span><span>Test</span><span>Review</span><span>Operate</span></div><div class="feedback-node"><b>Reality</b><span>用户 · 测试 · 生产</span></div></div>${evidence('组织变化','少数人可以管理更宽的工程面，但前提是角色、权限、反馈和升级路径被清楚设计。')}`, {kicker:'TEAM TOPOLOGY'}),
  S('话题四 · 下一站：工程师', '哪些工作被压缩，<br>哪些能力被放大？', `<div class="d3-chart d3-value" data-chart="value" aria-label="工程能力价值矩阵"></div>`, {kicker:'VALUE MATRIX'}),
  S('话题四 · 下一站：工程师', '未来工程师的<br>四层护城河', `<div class="moat-stack"><div style="--w:52%"><b>04 · 领导力与品味</b><span>决定什么值得做</span></div><div style="--w:66%"><b>03 · 验证与责任</b><span>知道怎样证明正确</span></div><div style="--w:80%"><b>02 · 系统与领域</b><span>理解约束和长期结构</span></div><div style="--w:94%"><b>01 · 工具与实现</b><span>熟练调用模型和自动化</span></div></div><p class="muted" style="margin-top:24px">工具层最容易获得，也最容易被复制；越向上，越依赖长期经验。</p>`, {kicker:'CAREER MOAT'}),
  S('话题四 · 下一站：工程师', 'IC 与管理者，<br>都需要新的杠杆', `<div class="career-paths"><div><span class="eyebrow">INDIVIDUAL CONTRIBUTOR</span><h3>成为系统型 IC</h3>${list(['掌握一个真实领域','设计可执行的上下文','建立高强度验证工具','负责跨组件结果'])}</div><div><span class="eyebrow">ENGINEERING LEADER</span><h3>成为 AI 组织设计者</h3>${list(['划分人和 Agent 权限','设计任务与升级路径','管理质量、成本和风险','让团队经验持续沉淀'])}</div></div>`, {kicker:'TWO PATHS'}),
  S('话题四 · 下一站：工程师', '一个可执行的<br>30 / 90 / 365 天计划', `<div class="d3-chart d3-roadmap" data-chart="roadmap" aria-label="工程师 30、90、365 天行动路线"></div>`, {kicker:'ACTION PLAN'}),
  S('话题四 · 下一站：工程师', '理解与责任不能外包', `<div class="responsibility-map"><div class="delegation-core"><span>可以委托</span><b>实现</b><small>生成 · 修改 · 执行</small></div><div class="responsibility-boundary">人的责任边界</div><div class="responsibility-items"><div><span>01</span><b>解释</b><small>为什么这样设计</small></div><div><span>02</span><b>识别未知</b><small>模型不知道什么</small></div><div><span>03</span><b>接管失败</b><small>缩小并解决问题</small></div><div><span>04</span><b>承担后果</b><small>安全 · 成本 · 用户</small></div></div></div>`, {kicker:'RESPONSIBILITY BOUNDARY'}),
  S('话题四 · 下一站：工程师', '不要和 AI 比谁写得更快', `<div class="manifesto-quote"><span class="quote-mark">“</span><p>去成为那个<br><em>定义方向</em>、<em>设计系统</em>、<em>建立证据</em><br>并对结果负责的人。</p><div class="manifesto-rule"></div><footer><span>方向</span><span>系统</span><span>证据</span><span>责任</span></footer></div>`, {type:'manifesto', kicker:'TOPIC 04 · CONCLUSION'}),
  S('结束', 'AI 让实现变得廉价', `${quotation('<em>定义问题</em>、<em>建立反馈</em>和<em>判断质量</em>，正在成为工程师最昂贵的能力。','BUILD THE SYSTEM · NOT THE PROMPT')}`, {type:'cover', kicker:'谢谢 · Q&A'})
];

window.SLIDE_CONTENT = slides;
