/* D3-powered slide charts. Data and labels remain local for offline presenting. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#59e3ff';
  const colors = () => ({
    accent: accent(), text: '#f4f6fa', muted: '#9ca8b8', line: 'rgba(255,255,255,.14)', bg: '#080b12'
  });
  const svgFor = (el, width = 1100, height = 360) => {
    el.replaceChildren();
    return d3.select(el).append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
  };
  const multiline = (selection, lines, x, y, lineHeight = 18) => {
    const text = selection.append('text').attr('x', x).attr('y', y);
    lines.forEach((line, i) => text.append('tspan').attr('x', x).attr('dy', i ? lineHeight : 0).text(line));
    return text;
  };

  function factors(el) {
    const c = colors(), svg = svgFor(el, 1100, 350), cx = 550, cy = 170;
    const data = ['模型能力','上下文质量','任务分解','反馈速度','验证强度','人的判断'].map((label,i) => ({
      label, x:cx + Math.cos(-Math.PI/2 + i*Math.PI/3)*390, y:cy + Math.sin(-Math.PI/2 + i*Math.PI/3)*125
    }));
    const links = svg.append('g').selectAll('line').data(data).join('line')
      .attr('x1',cx).attr('y1',cy).attr('x2',cx).attr('y2',cy)
      .attr('stroke',c.accent).attr('stroke-opacity',.32).attr('stroke-width',1.5);
    links.transition().duration(800).delay((d,i)=>i*80).attr('x2',d=>d.x).attr('y2',d=>d.y);
    const nodes = svg.append('g').selectAll('g').data(data).join('g').attr('transform',`translate(${cx},${cy})`).attr('opacity',0);
    nodes.append('rect').attr('x',-72).attr('y',-26).attr('width',144).attr('height',52).attr('rx',2)
      .attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-opacity',.62);
    nodes.append('text').attr('text-anchor','middle').attr('dominant-baseline','middle').attr('fill',c.text).attr('font-size',16).text(d=>d.label);
    nodes.transition().duration(650).delay((d,i)=>220+i*80).attr('transform',d=>`translate(${d.x},${d.y})`).attr('opacity',1);
    const core = svg.append('g').attr('transform',`translate(${cx},${cy})`).attr('opacity',0);
    core.append('circle').attr('r',72).attr('fill',c.accent).attr('fill-opacity',.12).attr('stroke',c.accent).attr('stroke-width',2);
    core.append('circle').attr('r',58).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-opacity',.35);
    core.append('text').attr('text-anchor','middle').attr('y',-4).attr('fill',c.accent).attr('font-size',21).attr('font-weight',700).text('工程产能');
    core.append('text').attr('text-anchor','middle').attr('y',22).attr('fill',c.muted).attr('font-size',11).attr('letter-spacing',2).text('MULTIPLY');
    core.transition().duration(700).attr('opacity',1);
    svg.append('text').attr('x',cx).attr('y',338).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',12).text('不是能力清单，而是一条乘法链');
  }

  function evolution(el) {
    const c=colors(), svg=svgFor(el,1100,340), m={l:80,r:55,t:42,b:70};
    const data=[
      {label:'代码补全',sub:'局部建议',level:18}, {label:'对话式编程',sub:'一次协作',level:31},
      {label:'Agent 执行',sub:'完整任务',level:46}, {label:'规格驱动',sub:'约束实现',level:64},
      {label:'多角色协作',sub:'职责分离',level:81}, {label:'AI 工程系统',sub:'持续闭环',level:96}
    ];
    const x=d3.scalePoint().domain(d3.range(data.length)).range([m.l,1100-m.r]).padding(.4);
    const y=d3.scaleLinear().domain([0,100]).range([340-m.b,m.t]);
    const defs=svg.append('defs');
    const grad=defs.append('linearGradient').attr('id','evolution-area').attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
    grad.append('stop').attr('offset','0%').attr('stop-color',c.accent).attr('stop-opacity',.22);
    grad.append('stop').attr('offset','100%').attr('stop-color',c.accent).attr('stop-opacity',0);
    const area=d3.area().x((d,i)=>x(i)).y0(340-m.b).y1(d=>y(d.level)).curve(d3.curveMonotoneX);
    const line=d3.line().x((d,i)=>x(i)).y(d=>y(d.level)).curve(d3.curveMonotoneX);
    svg.append('path').datum(data).attr('d',area).attr('fill','url(#evolution-area)').attr('opacity',0).transition().duration(900).attr('opacity',1);
    const path=svg.append('path').datum(data).attr('d',line).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',3);
    const len=path.node().getTotalLength(); path.attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(1200).attr('stroke-dashoffset',0);
    const nodes=svg.append('g').selectAll('g').data(data).join('g').attr('transform',(d,i)=>`translate(${x(i)},${y(d.level)})`).attr('opacity',0);
    nodes.append('circle').attr('r',8).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-width',3);
    nodes.append('line').attr('y1',14).attr('y2',46).attr('stroke',c.accent).attr('stroke-opacity',.35);
    nodes.append('text').attr('y',66).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',16).attr('font-weight',650).text(d=>d.label);
    nodes.append('text').attr('y',87).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',12).text(d=>d.sub);
    nodes.transition().duration(450).delay((d,i)=>180+i*160).attr('opacity',1);
    svg.append('text').attr('x',m.l).attr('y',22).attr('fill',c.muted).attr('font-size',13).text('系统化程度 ↑');
    svg.append('text').attr('x',1100-m.r).attr('y',330).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',13).text('能力边界扩展 →');
  }

  function rustackHistory(el) {
    const c=colors(), svg=svgFor(el,1100,360);
    const phaseData=[
      {id:'01',name:'S3 纵向切片',commits:35},
      {id:'02',name:'兼容性驱动扩展',commits:50},
      {id:'03',name:'代码生成与批量扩张',commits:36},
      {id:'04',name:'产品化与真实执行',commits:14},
      {id:'05',name:'生态与运行时',commits:11}
    ];
    const daily=[
      {d:0,b:0,f:0,v:0,s:1},{d:1,b:7,f:6,v:0,s:1},{d:2,b:2,f:13,v:3,s:2},{d:3,b:9,f:1,v:1,s:1},
      {d:4,b:3,f:1,v:0,s:1},{d:7,b:5,f:5,v:1,s:1},{d:8,b:5,f:1,v:1,s:0},{d:9,b:2,f:3,v:1,s:1},
      {d:10,b:1,f:3,v:1,s:1},{d:11,b:0,f:1,v:0,s:0},{d:19,b:6,f:4,v:1,s:0},{d:20,b:4,f:1,v:0,s:0},
      {d:21,b:5,f:0,v:0,s:1},{d:22,b:2,f:2,v:0,s:0},{d:23,b:1,f:5,v:1,s:3},{d:27,b:1,f:0,v:0,s:0},
      {d:28,b:0,f:0,v:0,s:1},{d:33,b:1,f:1,v:0,s:2},{d:47,b:1,f:0,v:0,s:0},{d:51,b:1,f:0,v:0,s:1},
      {d:52,b:1,f:0,v:0,s:0},{d:55,b:0,f:1,v:0,s:0},{d:56,b:1,f:0,v:0,s:2},{d:88,b:0,f:2,v:0,s:5},
      {d:89,b:0,f:0,v:0,s:1},{d:90,b:0,f:0,v:0,s:2},{d:91,b:0,f:0,v:0,s:1}
    ];
    const services=[
      {d:1,n:1},{d:3,n:2},{d:4,n:3},{d:7,n:4},{d:8,n:5},{d:9,n:6},
      {d:19,n:7},{d:20,n:10},{d:21,n:15},{d:22,n:17},{d:51,n:18},{d:91,n:18}
    ];
    const typeColors={b:c.accent,f:'#ff79b7',v:'#b9f46c',s:'#687385'};
    const x=d3.scaleLinear().domain([0,91]).range([50,1050]);
    const yService=d3.scaleLinear().domain([1,18]).range([190,82]);

    svg.append('text').attr('x',22).attr('y',-1).attr('fill',c.muted).attr('font-size',10).attr('letter-spacing',1.4).text('五个阶段 · 提交数');
    const phase=svg.append('g').selectAll('g').data(phaseData).join('g').attr('transform',(d,i)=>`translate(${22+i*214},7)`);
    phase.append('rect').attr('width',202).attr('height',52).attr('rx',3).attr('fill',c.accent).attr('fill-opacity',(d,i)=>.035+i*.012).attr('stroke',c.accent).attr('stroke-opacity',.28);
    phase.append('text').attr('x',13).attr('y',19).attr('fill',c.accent).attr('font-size',10).attr('font-weight',650).text(d=>d.id);
    phase.append('text').attr('x',13).attr('y',40).attr('fill',c.text).attr('font-size',14).attr('font-weight',650).text(d=>d.name);
    phase.append('text').attr('x',187).attr('y',35).attr('text-anchor','end').attr('fill',c.accent).attr('font-size',22).attr('font-weight',700).text(d=>d.commits);

    const legend=[['b','功能'],['f','修复'],['v','测试 / CI'],['s','文档 / 工程']];
    const legendGroup=svg.append('g').attr('transform','translate(730,70)');
    legend.forEach(([type,label],i)=>{
      legendGroup.append('circle').attr('cx',i*88).attr('cy',0).attr('r',3.5).attr('fill',typeColors[type]);
      legendGroup.append('text').attr('x',7+i*88).attr('y',4).attr('fill',c.muted).attr('font-size',11).text(label);
    });
    svg.append('text').attr('x',50).attr('y',74).attr('fill',c.muted).attr('font-size',11).text('服务数量');

    [1,6,12,18].forEach(value=>{
      svg.append('line').attr('x1',50).attr('x2',1050).attr('y1',yService(value)).attr('y2',yService(value)).attr('stroke',c.line).attr('stroke-dasharray','2 8');
      svg.append('text').attr('x',39).attr('y',yService(value)+4).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',9).text(value);
    });
    const serviceLine=d3.line().x(d=>x(d.d)).y(d=>yService(d.n)).curve(d3.curveStepAfter);
    svg.append('path').datum(services).attr('d',serviceLine).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',8).attr('stroke-opacity',.08);
    const growth=svg.append('path').datum(services).attr('d',serviceLine).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',2.5);
    const growthLength=growth.node().getTotalLength();
    growth.attr('stroke-dasharray',growthLength).attr('stroke-dashoffset',growthLength).transition().duration(1500).ease(d3.easeCubicOut).attr('stroke-dashoffset',0);
    svg.append('g').selectAll('circle').data(services.slice(0,-1)).join('circle').attr('cx',d=>x(d.d)).attr('cy',d=>yService(d.n)).attr('r',4).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-width',2);

    const labels=[
      {d:2,n:1,text:'S3 · Mint 8/15',dx:8,dy:-8,anchor:'start'},
      {d:3,n:2,text:'DynamoDB · 457/457',dx:8,dy:18,anchor:'start'},
      {d:19,n:7,text:'配置化代码生成',dx:9,dy:-10,anchor:'start'},
      {d:22,n:17,text:'17 个服务',dx:9,dy:18,anchor:'start'},
      {d:51,n:18,text:'CloudFront → 18',dx:9,dy:-9,anchor:'start'}
    ];
    svg.append('g').selectAll('text').data(labels).join('text').attr('x',d=>x(d.d)+d.dx).attr('y',d=>yService(d.n)+d.dy).attr('text-anchor',d=>d.anchor)
      .attr('fill',c.text).attr('font-size',11).attr('font-weight',650).attr('paint-order','stroke').attr('stroke',c.bg).attr('stroke-width',4).text(d=>d.text);

    const dots=[];
    daily.forEach(day=>{
      let index=0;
      ['s','b','f','v'].forEach(type=>{
        for(let i=0;i<day[type];i+=1) dots.push({day:day.d,type,index:index++});
      });
    });
    svg.append('line').attr('x1',50).attr('x2',1050).attr('y1',326).attr('y2',326).attr('stroke',c.line);
    const commitDots=svg.append('g').selectAll('circle').data(dots).join('circle')
      .attr('cx',d=>x(d.day)+((d.index%2)*2.6-1.3)).attr('cy',d=>322-d.index*5.1).attr('r',2.8)
      .attr('fill',d=>typeColors[d.type]).attr('opacity',.22);
    commitDots.transition().delay((d,i)=>d.day*10+i*.8).duration(260).attr('opacity',.95);
    svg.append('text').attr('x',50).attr('y',214).attr('fill',c.muted).attr('font-size',11).text('每个圆点代表一次提交');

    const ticks=[{d:0,t:'02.26'},{d:19,t:'03.17'},{d:51,t:'04.18'},{d:91,t:'05.28'}];
    ticks.forEach(t=>{
      svg.append('line').attr('x1',x(t.d)).attr('x2',x(t.d)).attr('y1',326).attr('y2',332).attr('stroke',c.muted);
      svg.append('text').attr('x',x(t.d)).attr('y',348).attr('text-anchor',t.d===0?'start':t.d===91?'end':'middle').attr('fill',c.muted).attr('font-size',10).text(t.t);
    });
    svg.append('line').attr('x1',x(91)).attr('x2',x(91)).attr('y1',206).attr('y2',326).attr('stroke','#c792ff').attr('stroke-opacity',.45).attr('stroke-dasharray','3 6');
    svg.append('text').attr('x',x(91)-5).attr('y',221).attr('text-anchor','end').attr('fill','#c792ff').attr('font-size',10).attr('font-weight',650).text('Pulumi · 快照 · Squib');
  }

  function compatibility(el) {
    const c = colors(), svg = svgFor(el, 440, 320), cx=220, cy=248, inner=118, outer=152;
    const arc = d3.arc().innerRadius(inner).outerRadius(outer).cornerRadius(5).startAngle(-Math.PI/2);
    svg.append('path').attr('transform',`translate(${cx},${cy})`).attr('d',arc({endAngle:Math.PI/2})).attr('fill','rgba(255,255,255,.07)');
    const progress = svg.append('path').attr('transform',`translate(${cx},${cy})`).attr('fill',c.accent)
      .attr('d',arc({endAngle:-Math.PI/2}));
    progress.transition().duration(1200).ease(d3.easeCubicOut).attrTween('d',()=>{
      const i=d3.interpolate(-Math.PI/2,-Math.PI/2+Math.PI*.82); return t=>arc({endAngle:i(t)});
    });
    const markerAngle=-Math.PI/2+Math.PI*.4;
    svg.append('line').attr('x1',cx+Math.sin(markerAngle)*(inner-12)).attr('y1',cy-Math.cos(markerAngle)*(inner-12))
      .attr('x2',cx+Math.sin(markerAngle)*(outer+12)).attr('y2',cy-Math.cos(markerAngle)*(outer+12)).attr('stroke',c.text).attr('stroke-width',2);
    const start=svg.append('g').attr('transform','translate(32,28)');
    start.append('rect').attr('width',118).attr('height',34).attr('rx',17).attr('fill','rgba(255,255,255,.045)').attr('stroke',c.line);
    start.append('text').attr('x',59).attr('y',22).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',13).text('起点 ≈ 40%');
    const current=svg.append('g').attr('transform','translate(286,28)');
    current.append('rect').attr('width',122).attr('height',34).attr('rx',17).attr('fill',c.accent).attr('fill-opacity',.12).attr('stroke',c.accent);
    current.append('text').attr('x',61).attr('y',22).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',13).attr('font-weight',650).text('当前 80%+');
    const number=svg.append('text').attr('x',cx).attr('y',cy-20).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',64).attr('font-weight',650).text('40');
    number.transition().duration(1200).tween('text',function(){const i=d3.interpolateNumber(40,80);return t=>this.textContent=`${Math.round(i(t))}%+`;});
    svg.append('text').attr('x',cx).attr('y',cy+12).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',19).attr('font-weight',600).text('兼容语义覆盖');
    svg.append('text').attr('x',cx).attr('y',cy+42).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',14).text('由外部兼容性测试持续驱动');
    svg.append('line').attr('x1',35).attr('x2',405).attr('y1',312).attr('y2',312).attr('stroke',c.line);
  }

  function system(el) {
    const c=colors(), svg=svgFor(el,1100,360), cx=550, cy=180;
    const data=[
      {id:'硬件',sub:'传感器 · 电池 · PCB',x:165,y:82}, {id:'固件',sub:'采样 · 缓冲 · 低功耗',x:550,y:55},
      {id:'移动端',sub:'连接 · 会话 · 离线',x:935,y:82}, {id:'控制平面',sub:'注册 · 配置 · 升级',x:850,y:286},
      {id:'数据与模型',sub:'对齐 · 特征 · 评估',x:250,y:286}
    ];
    const link=svg.append('g').selectAll('path').data(data).join('path').attr('fill','none').attr('stroke',c.accent).attr('stroke-opacity',.28).attr('stroke-width',2)
      .attr('d',d=>`M${cx},${cy} Q${(cx+d.x)/2},${cy-35} ${d.x},${d.y}`)
      .attr('stroke-dasharray',function(){return this.getTotalLength()}).attr('stroke-dashoffset',function(){return this.getTotalLength()});
    link.transition().duration(1000).delay((d,i)=>i*100).attr('stroke-dashoffset',0);
    const nodes=svg.append('g').selectAll('g').data(data).join('g').attr('transform',d=>`translate(${d.x},${d.y})`).attr('opacity',0);
    nodes.append('rect').attr('x',-108).attr('y',-34).attr('width',216).attr('height',68).attr('rx',2).attr('fill',c.bg).attr('stroke',c.line);
    nodes.append('text').attr('x',-86).attr('y',-5).attr('fill',c.text).attr('font-size',17).attr('font-weight',650).text(d=>d.id);
    nodes.append('text').attr('x',-86).attr('y',18).attr('fill',c.muted).attr('font-size',11).text(d=>d.sub);
    nodes.transition().duration(500).delay((d,i)=>320+i*100).attr('opacity',1);
    const core=svg.append('g').attr('transform',`translate(${cx},${cy})`).attr('opacity',0);
    core.append('circle').attr('r',79).attr('fill',c.accent).attr('fill-opacity',.12).attr('stroke',c.accent).attr('stroke-width',2);
    core.append('circle').attr('r',61).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-opacity',.4);
    core.append('text').attr('text-anchor','middle').attr('y',-5).attr('fill',c.accent).attr('font-size',22).attr('font-weight',700).text('数据契约');
    core.append('text').attr('text-anchor','middle').attr('y',22).attr('fill',c.muted).attr('font-size',11).text('格式 · 时间 · 版本 · 质量');
    core.transition().duration(700).attr('opacity',1);
  }

  function convergence(el) {
    const c=colors(), svg=svgFor(el,680,600), cx=340, cy=292, ringRadius=116;
    const palette={software:'#6b8cff',hardware:'#b9f46c',knowledge:'#ffad66'};
    const defs=svg.append('defs');
    Object.entries(palette).forEach(([name,color])=>{
      defs.append('marker').attr('id',`converge-${name}`).attr('viewBox','0 0 10 10').attr('refX',9).attr('refY',5)
        .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
        .append('path').attr('d','M0 0 L10 5 L0 10 Z').attr('fill',color);
    });
    const glow=defs.append('filter').attr('id','converge-glow');
    glow.append('feGaussianBlur').attr('stdDeviation',3).attr('result','blur');

    const sources=[
      {id:'software',title:'软件',proof:'测试',x:105,y:105,tx:235,ty:260,path:'M154,139 C178,171 190,220 235,260'},
      {id:'hardware',title:'软硬件',proof:'测量',x:575,y:105,tx:445,ty:260,path:'M526,139 C502,171 490,220 445,260'},
      {id:'knowledge',title:'知识',proof:'来源 · 审稿',x:340,y:492,tx:340,ty:408,path:'M340,434 C340,426 340,418 340,408'}
    ].map(d=>({...d,color:palette[d.id]}));

    const streams=svg.append('g').selectAll('path').data(sources).join('path').attr('d',d=>d.path).attr('fill','none')
      .attr('stroke',d=>d.color).attr('stroke-width',2.5).attr('stroke-opacity',.58).attr('stroke-dasharray','5 9')
      .attr('marker-end',d=>`url(#converge-${d.id})`);
    streams.each(function(){const len=this.getTotalLength();d3.select(this).attr('stroke-dashoffset',len).transition().duration(950).attr('stroke-dashoffset',0);});

    const source=svg.append('g').selectAll('g').data(sources).join('g').attr('transform',d=>`translate(${d.x},${d.y})`);
    source.append('circle').attr('r',58).attr('fill',d=>d.color).attr('fill-opacity',.07).attr('stroke',d=>d.color).attr('stroke-width',2);
    source.append('circle').attr('r',47).attr('fill',c.bg).attr('stroke',d=>d.color).attr('stroke-opacity',.3);
    source.append('text').attr('text-anchor','middle').attr('y',-6).attr('fill',c.text).attr('font-size',20).attr('font-weight',700).text(d=>d.title);
    source.append('text').attr('text-anchor','middle').attr('y',23).attr('fill',d=>d.color).attr('font-size',13).attr('font-weight',650).text(d=>d.proof);

    const ringPath=`M${cx},${cy-ringRadius} A${ringRadius},${ringRadius} 0 1 1 ${cx},${cy+ringRadius} A${ringRadius},${ringRadius} 0 1 1 ${cx},${cy-ringRadius}`;
    svg.append('path').attr('d',ringPath).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',16).attr('stroke-opacity',.055);
    svg.append('path').attr('d',ringPath).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',2).attr('stroke-opacity',.52).attr('stroke-dasharray','4 8');

    const core=svg.append('g').attr('transform',`translate(${cx},${cy})`);
    core.append('circle').attr('r',78).attr('fill',c.accent).attr('fill-opacity',.09).attr('stroke',c.accent).attr('stroke-width',2);
    core.append('circle').attr('r',61).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-opacity',.32);
    core.append('text').attr('text-anchor','middle').attr('y',-7).attr('fill',c.accent).attr('font-size',16).attr('font-weight',650).text('同一套');
    core.append('text').attr('text-anchor','middle').attr('y',23).attr('fill',c.text).attr('font-size',22).attr('font-weight',750).text('工程方法');

    const steps=[['目标',0,-ringRadius],['执行',ringRadius,0],['验证',0,ringRadius],['记忆',-ringRadius,0]];
    const step=core.selectAll('g.step').data(steps).join('g').attr('class','step').attr('transform',d=>`translate(${d[1]},${d[2]})`);
    step.append('rect').attr('x',-30).attr('y',-16).attr('width',60).attr('height',32).attr('rx',16).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-width',1.5);
    step.append('text').attr('text-anchor','middle').attr('y',5).attr('fill',c.text).attr('font-size',13).attr('font-weight',650).text(d=>d[0]);

    svg.append('text').attr('x',cx).attr('y',592).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',13).text('对象不同 · 证据不同 · 方法相同');

    const loopAlong=(pathNode,color,delay,duration,radius=4)=>{
      const len=pathNode.getTotalLength();
      const particle=svg.append('circle').attr('r',radius).attr('fill',color).attr('opacity',0).attr('filter','url(#converge-glow)');
      const run=()=>{
        const slide=el.closest('.slide');
        if(!particle.node()?.isConnected || !slide?.classList.contains('active')) { particle.interrupt().attr('opacity',0); return; }
        particle.attr('opacity',0).transition().delay(delay).duration(duration).ease(d3.easeLinear).attr('opacity',1)
          .attrTween('transform',()=>t=>{const p=pathNode.getPointAtLength(t*len);return `translate(${p.x},${p.y})`;})
          .transition().duration(120).attr('opacity',0).on('end',run);
      };
      run();
    };
    streams.each(function(d,i){d3.range(2).forEach(n=>loopAlong(this,d.color,260+n*520+i*90,1250,4));});
    const orbit=svg.append('path').attr('d',ringPath).attr('fill','none').attr('stroke','transparent').node();
    d3.range(4).forEach(i=>loopAlong(orbit,c.accent,i*360,1750,3.5));
  }

  function flywheel(el) {
    const c=colors(), svg=svgFor(el,1100,350), cx=220, cy=164, radius=112;
    const palette={software:'#6b8cff',hardware:'#b9f46c',knowledge:'#ffad66'};
    const defs=svg.append('defs');
    defs.append('marker').attr('id','flywheel-arrow').attr('viewBox','0 0 10 10').attr('refX',8).attr('refY',5)
      .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
      .append('path').attr('d','M0 0 L10 5 L0 10 Z').attr('fill',c.accent);
    const glow=defs.append('filter').attr('id','flywheel-glow');
    glow.append('feGaussianBlur').attr('stdDeviation',2.5).attr('result','blur');

    const points=[
      {label:'构建',sub:'把想法做出来',angle:-Math.PI/2},
      {label:'衡量',sub:'让现实给证据',angle:Math.PI/6},
      {label:'学习',sub:'把结果写回系统',angle:Math.PI*5/6}
    ].map(d=>({...d,x:cx+Math.cos(d.angle)*radius,y:cy+Math.sin(d.angle)*radius}));

    svg.append('circle').attr('cx',cx).attr('cy',cy).attr('r',radius).attr('fill','none')
      .attr('stroke',c.accent).attr('stroke-opacity',.14).attr('stroke-width',18);
    const arcPaths=points.map((point,i)=>{
      const next=points[(i+1)%points.length];
      return svg.append('path').attr('d',`M${point.x},${point.y} A${radius},${radius} 0 0 1 ${next.x},${next.y}`)
        .attr('fill','none').attr('stroke',c.accent).attr('stroke-width',3).attr('stroke-opacity',.75)
        .attr('marker-end','url(#flywheel-arrow)').node();
    });

    const core=svg.append('g').attr('transform',`translate(${cx},${cy})`);
    core.append('circle').attr('r',66).attr('fill',c.accent).attr('fill-opacity',.1).attr('stroke',c.accent).attr('stroke-width',2);
    core.append('circle').attr('r',50).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-opacity',.35);
    core.append('text').attr('text-anchor','middle').attr('y',-5).attr('fill',c.accent).attr('font-size',22).attr('font-weight',750).text('AI 加速');
    core.append('text').attr('text-anchor','middle').attr('y',20).attr('fill',c.muted).attr('font-size',10).text('上下文 · 自动化 · 反馈');

    const nodes=svg.append('g').selectAll('g').data(points).join('g').attr('transform',d=>`translate(${d.x},${d.y})`);
    nodes.append('circle').attr('r',41).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-width',2);
    nodes.append('text').attr('text-anchor','middle').attr('y',-3).attr('fill',c.text).attr('font-size',18).attr('font-weight',700).text(d=>d.label);
    nodes.append('text').attr('text-anchor','middle').attr('y',16).attr('fill',c.muted).attr('font-size',9).text(d=>d.sub);
    svg.append('text').attr('x',cx).attr('y',337).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',12).text('每转一轮，速度更快，证据更多');

    const cases=[
      {id:'01',name:'Rustack',color:palette.software,steps:['构建协议','兼容测试','补齐语义']},
      {id:'02',name:'可穿戴设备',color:palette.hardware,steps:['做出原型','现场测量','修正设计']},
      {id:'03',name:'技术书',color:palette.knowledge,steps:['生成章节','来源审稿','重写结构']}
    ];
    const rows=svg.append('g').attr('transform','translate(420,30)').selectAll('g.case').data(cases).join('g').attr('class','case').attr('transform',(d,i)=>`translate(0,${i*101})`);
    rows.append('rect').attr('width',650).attr('height',82).attr('rx',3).attr('fill',d=>d.color).attr('fill-opacity',.045).attr('stroke',d=>d.color).attr('stroke-opacity',.36);
    rows.append('rect').attr('width',4).attr('height',82).attr('fill',d=>d.color);
    rows.append('text').attr('x',22).attr('y',27).attr('fill',d=>d.color).attr('font-size',10).attr('font-weight',650).text(d=>d.id);
    rows.append('text').attr('x',22).attr('y',55).attr('fill',c.text).attr('font-size',16).attr('font-weight',700).text(d=>d.name);
    rows.each(function(d){
      const row=d3.select(this), start=160, gap=152;
      d.steps.forEach((step,i)=>{
        row.append('rect').attr('x',start+i*gap).attr('y',21).attr('width',116).attr('height',40).attr('rx',20).attr('fill',d.color).attr('fill-opacity',.1).attr('stroke',d.color).attr('stroke-opacity',.5);
        row.append('text').attr('x',start+58+i*gap).attr('y',46).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',13).text(step);
        if(i<2) row.append('text').attr('x',start+132+i*gap).attr('y',47).attr('text-anchor','middle').attr('fill',d.color).attr('font-size',18).text('→');
      });
      row.append('text').attr('x',626).attr('y',50).attr('text-anchor','middle').attr('fill',d.color).attr('font-size',21).text('↺');
    });

    const ring=svg.append('path').attr('d',`M${cx},${cy-radius} A${radius},${radius} 0 1 1 ${cx-.1},${cy-radius}`)
      .attr('fill','none').attr('stroke','transparent').node();
    const ringLength=ring.getTotalLength();
    const loopParticle=(delay=0)=>{
      const particle=svg.append('circle').attr('r',4).attr('fill',c.accent).attr('opacity',0).attr('filter','url(#flywheel-glow)');
      const run=()=>{
        const slide=el.closest('.slide');
        if(!particle.node()?.isConnected || !slide?.classList.contains('active')) { particle.interrupt().attr('opacity',0); return; }
        particle.attr('opacity',0).transition().delay(delay).duration(1500).ease(d3.easeLinear).attr('opacity',1)
          .attrTween('transform',()=>t=>{const p=ring.getPointAtLength(t*ringLength);return `translate(${p.x},${p.y})`;})
          .transition().duration(120).attr('opacity',0).on('end',run);
      };
      run();
    };
    d3.range(5).forEach(i=>loopParticle(i*310));
  }

  function lifecycle(el) {
    const c=colors(), svg=svgFor(el,1100,360), margin={l:70,r:35,t:42,b:62}, stages=['需求','设计','实现','验证','运行'];
    const human=[92,86,46,82,88], automation=[30,55,93,67,38];
    const x=d3.scalePoint().domain(stages).range([margin.l,1100-margin.r]).padding(.35), y=d3.scaleLinear().domain([0,100]).range([360-margin.b,margin.t]);
    [25,50,75,100].forEach(v=>svg.append('line').attr('x1',margin.l).attr('x2',1100-margin.r).attr('y1',y(v)).attr('y2',y(v)).attr('stroke',c.line).attr('stroke-dasharray','3 8'));
    const line=d3.line().x((d,i)=>x(stages[i])).y(d=>y(d)).curve(d3.curveMonotoneX);
    const draw=(values,color,label,offset)=>{
      const path=svg.append('path').attr('d',line(values)).attr('fill','none').attr('stroke',color).attr('stroke-width',3);
      const len=path.node().getTotalLength(); path.attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(1100).attr('stroke-dashoffset',0);
      svg.append('g').selectAll('circle').data(values).join('circle').attr('cx',(d,i)=>x(stages[i])).attr('cy',d=>y(d)).attr('r',0).attr('fill',color).transition().delay((d,i)=>450+i*100).attr('r',6);
      svg.append('text').attr('x',1100-margin.r).attr('y',y(values[4])+offset).attr('text-anchor','end').attr('fill',color).attr('font-size',16).attr('font-weight',600).text(label);
    };
    draw(human,c.accent,'人的判断与注意力',-12); draw(automation,'#59e3ff','AI 可自动化程度',20);
    svg.selectAll('.stage').data(stages).join('text').attr('class','stage').attr('x',d=>x(d)).attr('y',330).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',18).attr('font-weight',600).text(d=>d);
    svg.append('text').attr('x',margin.l).attr('y',22).attr('fill',c.muted).attr('font-size',13).text('相对强度 · 概念示意');
  }

  function teamTopology(el) {
    const c=colors(), svg=svgFor(el,1100,370), feedback='#59e3ff', alert='#ffad66';
    const defs=svg.append('defs');
    [['accent',c.accent],['feedback',feedback],['alert',alert]].forEach(([name,color])=>{
      defs.append('marker').attr('id',`team-${name}`).attr('viewBox','0 0 10 10').attr('refX',9).attr('refY',5)
        .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
        .append('path').attr('d','M0 0 L10 5 L0 10 Z').attr('fill',color);
    });
    const glow=defs.append('filter').attr('id','team-glow');
    glow.append('feGaussianBlur').attr('stdDeviation',2.6).attr('result','blur');

    const human=svg.append('g').attr('transform','translate(28,125)');
    human.append('rect').attr('width',164).attr('height',116).attr('rx',4).attr('fill',c.accent).attr('fill-opacity',.08).attr('stroke',c.accent).attr('stroke-width',2);
    human.append('text').attr('x',82).attr('y',39).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',21).attr('font-weight',750).text('负责人');
    human.append('text').attr('x',82).attr('y',67).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',12).text('方向 · 取舍 · 权限');
    human.append('text').attr('x',82).attr('y',92).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',10).text('决定边界，也负责接管异常');

    const reality=svg.append('g').attr('transform','translate(908,125)');
    reality.append('rect').attr('width',164).attr('height',116).attr('rx',4).attr('fill',feedback).attr('fill-opacity',.06).attr('stroke',feedback).attr('stroke-width',2);
    reality.append('text').attr('x',82).attr('y',39).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',21).attr('font-weight',750).text('真实反馈');
    reality.append('text').attr('x',82).attr('y',67).attr('text-anchor','middle').attr('fill',feedback).attr('font-size',12).text('用户 · 测试 · 生产');
    reality.append('text').attr('x',82).attr('y',92).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',10).text('结果必须回到现实接受检验');

    svg.append('rect').attr('x',236).attr('y',44).attr('width',628).attr('height',272).attr('rx',136)
      .attr('fill',c.accent).attr('fill-opacity',.022).attr('stroke',c.accent).attr('stroke-opacity',.42).attr('stroke-dasharray','4 7');
    svg.append('text').attr('x',550).attr('y',65).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',11).attr('font-weight',650).attr('letter-spacing',1.4).text('Agent 协作区 · 任务边界与权限');

    const agents=[
      {id:'research',name:'研究',sub:'事实与未知',x:350,y:125},
      {id:'spec',name:'规格',sub:'边界与设计',x:550,y:105},
      {id:'build',name:'实现',sub:'代码与内容',x:750,y:125},
      {id:'test',name:'测试',sub:'制造证据',x:350,y:245},
      {id:'review',name:'审查',sub:'独立检查',x:550,y:265},
      {id:'operate',name:'运行',sub:'交付与观察',x:750,y:245}
    ];
    const byId=Object.fromEntries(agents.map(d=>[d.id,d]));
    const links=[
      ['research','spec'],['spec','build'],['research','test'],['spec','review'],
      ['build','operate'],['test','review'],['review','operate'],['build','test']
    ].map(([from,to])=>({from:byId[from],to:byId[to]}));
    const mesh=svg.append('g').selectAll('path').data(links).join('path')
      .attr('d',d=>`M${d.from.x},${d.from.y} Q${(d.from.x+d.to.x)/2},${(d.from.y+d.to.y)/2-18} ${d.to.x},${d.to.y}`)
      .attr('fill','none').attr('stroke',c.accent).attr('stroke-opacity',.24).attr('stroke-width',1.5).attr('marker-end','url(#team-accent)');
    mesh.each(function(){const len=this.getTotalLength();d3.select(this).attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(900).attr('stroke-dashoffset',0);});

    const node=svg.append('g').selectAll('g').data(agents).join('g').attr('transform',d=>`translate(${d.x},${d.y})`);
    node.append('rect').attr('x',-65).attr('y',-30).attr('width',130).attr('height',60).attr('rx',3).attr('fill',c.bg).attr('stroke',c.line);
    node.append('circle').attr('cx',-49).attr('cy',-14).attr('r',3).attr('fill',c.accent);
    node.append('text').attr('text-anchor','middle').attr('y',-2).attr('fill',c.text).attr('font-size',16).attr('font-weight',680).text(d=>d.name);
    node.append('text').attr('text-anchor','middle').attr('y',18).attr('fill',c.muted).attr('font-size',10).text(d=>d.sub);

    const delegation=svg.append('path').attr('d','M192,183 C215,183 228,183 255,183').attr('fill','none').attr('stroke',c.accent).attr('stroke-width',3).attr('marker-end','url(#team-accent)');
    svg.append('text').attr('x',224).attr('y',166).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',10).text('任务 · 权限');
    const delivery=svg.append('path').attr('d','M845,183 C870,183 885,183 908,183').attr('fill','none').attr('stroke',feedback).attr('stroke-width',3).attr('marker-end','url(#team-feedback)');
    svg.append('text').attr('x',876).attr('y',166).attr('text-anchor','middle').attr('fill',feedback).attr('font-size',10).text('产物 · 证据');

    const feedbackPath=svg.append('path').attr('d','M990,242 C930,342 725,350 550,315').attr('fill','none').attr('stroke',feedback).attr('stroke-width',2.5).attr('stroke-opacity',.7).attr('stroke-dasharray','6 7').attr('marker-end','url(#team-feedback)');
    svg.append('text').attr('x',790).attr('y',352).attr('text-anchor','middle').attr('fill',feedback).attr('font-size',11).text('常规反馈回到 Agent 协作区');
    const escalation=svg.append('path').attr('d','M990,125 C900,14 235,14 110,125').attr('fill','none').attr('stroke',alert).attr('stroke-width',2.5).attr('stroke-opacity',.72).attr('stroke-dasharray','7 8').attr('marker-end','url(#team-alert)');
    svg.append('text').attr('x',550).attr('y',23).attr('text-anchor','middle').attr('fill',alert).attr('font-size',11).attr('font-weight',650).text('方向变化、风险和例外，升级给人');

    const loopAlong=(pathNode,color,delay,duration,radius=4)=>{
      const len=pathNode.getTotalLength(), particle=svg.append('circle').attr('r',radius).attr('fill',color).attr('opacity',0).attr('filter','url(#team-glow)');
      const run=()=>{
        const slide=el.closest('.slide');
        if(!particle.node()?.isConnected || !slide?.classList.contains('active')) { particle.interrupt().attr('opacity',0); return; }
        particle.attr('opacity',0).transition().delay(delay).duration(duration).ease(d3.easeLinear).attr('opacity',1)
          .attrTween('transform',()=>t=>{const p=pathNode.getPointAtLength(t*len);return `translate(${p.x},${p.y})`;})
          .transition().duration(100).attr('opacity',0).on('end',run);
      };
      run();
    };
    d3.range(2).forEach(i=>loopAlong(delegation.node(),c.accent,i*420,850,4));
    [0,1,5,6].forEach((index,i)=>loopAlong(mesh.nodes()[index],c.accent,280+i*170,1050,3.5));
    d3.range(2).forEach(i=>loopAlong(delivery.node(),feedback,180+i*420,850,4));
    d3.range(2).forEach(i=>loopAlong(feedbackPath.node(),feedback,420+i*650,1900,4));
    loopAlong(escalation.node(),alert,900,2500,5);
  }

  function futureCompass(el) {
    const c=colors(), svg=svgFor(el,1100,380), cx=550, cy=190;
    const palette={direction:'#6b8cff',evidence:'#b9f46c',imagination:'#ff79b7',responsibility:'#ffad66'};
    const defs=svg.append('defs');
    Object.entries(palette).forEach(([name,color])=>{
      defs.append('marker').attr('id',`future-${name}`).attr('viewBox','0 0 10 10').attr('refX',9).attr('refY',5)
        .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
        .append('path').attr('d','M0 0 L10 5 L0 10 Z').attr('fill',color);
    });
    const glow=defs.append('filter').attr('id','future-glow');
    glow.append('feGaussianBlur').attr('stdDeviation',3).attr('result','blur');

    const choices=[
      {id:'direction',title:'方向',question:'什么值得做？',x:205,y:92,path:'M495,154 C440,105 375,92 330,92'},
      {id:'evidence',title:'证据',question:'怎样知道做对了？',x:895,y:92,path:'M605,154 C660,105 725,92 770,92'},
      {id:'imagination',title:'想象力',question:'还可能创造什么？',x:205,y:288,path:'M495,226 C440,275 375,288 330,288'},
      {id:'responsibility',title:'责任',question:'谁来承担后果？',x:895,y:288,path:'M605,226 C660,275 725,288 770,288'}
    ].map(d=>({...d,color:palette[d.id]}));

    const spokes=svg.append('g').selectAll('path').data(choices).join('path').attr('d',d=>d.path).attr('fill','none')
      .attr('stroke',d=>d.color).attr('stroke-width',2.5).attr('stroke-opacity',.52).attr('marker-end',d=>`url(#future-${d.id})`);
    spokes.each(function(){const len=this.getTotalLength();d3.select(this).attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(1000).attr('stroke-dashoffset',0);});

    const choice=svg.append('g').selectAll('g').data(choices).join('g').attr('transform',d=>`translate(${d.x},${d.y})`);
    choice.append('rect').attr('x',-125).attr('y',-38).attr('width',250).attr('height',76).attr('rx',4).attr('fill',d=>d.color).attr('fill-opacity',.055).attr('stroke',d=>d.color).attr('stroke-opacity',.62);
    choice.append('rect').attr('x',-125).attr('y',-38).attr('width',4).attr('height',76).attr('fill',d=>d.color);
    choice.append('text').attr('x',-101).attr('y',-7).attr('fill',d=>d.color).attr('font-size',12).attr('font-weight',700).text(d=>d.title);
    choice.append('text').attr('x',-101).attr('y',20).attr('fill',c.text).attr('font-size',18).attr('font-weight',650).text(d=>d.question);

    const topicColors=['#6b8cff','#b9f46c','#ffad66'];
    const arc=d3.arc().innerRadius(79).outerRadius(88).cornerRadius(4);
    topicColors.forEach((color,i)=>svg.append('path').attr('transform',`translate(${cx},${cy})`)
      .attr('d',arc({startAngle:-Math.PI/2+i*Math.PI*2/3+.045,endAngle:-Math.PI/2+(i+1)*Math.PI*2/3-.045}))
      .attr('fill',color).attr('fill-opacity',.82));
    svg.append('circle').attr('cx',cx).attr('cy',cy).attr('r',67).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-opacity',.38);
    svg.append('circle').attr('cx',cx).attr('cy',cy).attr('r',58).attr('fill',c.accent).attr('fill-opacity',.08);
    svg.append('text').attr('x',cx).attr('y',cy-7).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',24).attr('font-weight',760).text('我们');
    svg.append('text').attr('x',cx).attr('y',cy+22).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',13).attr('font-weight',650).text('选择方向');
    [['软件',cx,cy-103,topicColors[0]],['软硬件',cx+91,cy+73,topicColors[1]],['知识',cx-91,cy+73,topicColors[2]]].forEach(([label,x,y,color])=>
      svg.append('text').attr('x',x).attr('y',y).attr('text-anchor','middle').attr('fill',color).attr('font-size',10).attr('font-weight',650).text(label));

    svg.append('text').attr('x',cx).attr('y',371).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',15).attr('font-weight',550).text('AI 提供速度，人决定方向。问题从这里开始。');

    const ringPath=`M${cx},${cy-84} A84,84 0 1 1 ${cx},${cy+84} A84,84 0 1 1 ${cx},${cy-84}`;
    const orbit=svg.append('path').attr('d',ringPath).attr('fill','none').attr('stroke','transparent').node();
    const loopAlong=(pathNode,color,delay,duration,radius=4)=>{
      const len=pathNode.getTotalLength(), particle=svg.append('circle').attr('r',radius).attr('fill',color).attr('opacity',0).attr('filter','url(#future-glow)');
      const run=()=>{
        const slide=el.closest('.slide');
        if(!particle.node()?.isConnected || !slide?.classList.contains('active')) { particle.interrupt().attr('opacity',0); return; }
        particle.attr('opacity',0).transition().delay(delay).duration(duration).ease(d3.easeLinear).attr('opacity',1)
          .attrTween('transform',()=>t=>{const p=pathNode.getPointAtLength(t*len);return `translate(${p.x},${p.y})`;})
          .transition().duration(110).attr('opacity',0).on('end',run);
      };
      run();
    };
    d3.range(6).forEach(i=>loopAlong(orbit,topicColors[i%3],i*280,1750,3.5));
    spokes.each(function(d,i){loopAlong(this,d.color,620+i*210,1450,4);});
  }

  function value(el) {
    const c=colors(), svg=svgFor(el,1100,380), m={l:90,r:55,t:40,b:60};
    const data=[
      ['架构取舍',82,88,34],['领域建模',65,82,31],['验证设计',91,68,30],['复杂调试',28,78,29],['事故分析',43,62,30],
      ['模板代码',91,18,23],['机械迁移',78,32,22],['文档同步',62,38,22],['孤立实现',32,32,22],['无反馈生成',16,16,22]
    ].map(([name,x,y,r])=>({name,x,y,r}));
    const x=d3.scaleLinear().domain([0,100]).range([m.l,1100-m.r]), y=d3.scaleLinear().domain([0,100]).range([380-m.b,m.t]);
    svg.append('rect').attr('x',x(50)).attr('y',m.t).attr('width',x(100)-x(50)).attr('height',y(50)-m.t).attr('fill',c.accent).attr('fill-opacity',.035);
    svg.append('line').attr('x1',x(50)).attr('x2',x(50)).attr('y1',m.t).attr('y2',380-m.b).attr('stroke',c.line);
    svg.append('line').attr('x1',m.l).attr('x2',1100-m.r).attr('y1',y(50)).attr('y2',y(50)).attr('stroke',c.line);
    [
      ['先借助工具',8,95,'start'],['值得长期投入',92,95,'end'],
      ['容易被替代',8,5,'start'],['优先自动化',92,5,'end']
    ].forEach(([t,px,py,anchor])=>svg.append('text').attr('x',x(px)).attr('y',y(py)).attr('text-anchor',anchor).attr('fill',c.accent).attr('fill-opacity',.68).attr('font-size',22).attr('font-weight',700).text(t));
    const g=svg.append('g').selectAll('g').data(data).join('g').attr('transform',`translate(${x(50)},${y(50)})`).attr('opacity',0);
    g.append('circle').attr('r',d=>d.r).attr('fill',d=>d.y>50?c.accent:'#657087').attr('fill-opacity',d=>d.y>50?.18:.12).attr('stroke',d=>d.y>50?c.accent:'#778293');
    g.append('text').attr('text-anchor','middle').attr('dominant-baseline','middle').attr('fill',c.text).attr('font-size',13).attr('font-weight',550).text(d=>d.name);
    g.transition().duration(750).delay((d,i)=>i*70).attr('transform',d=>`translate(${x(d.x)},${y(d.y)})`).attr('opacity',1);
    svg.append('text').attr('x',(m.l+1100-m.r)/2).attr('y',371).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',14).text('可验证性 →');
    svg.append('text').attr('transform','rotate(-90)').attr('x',-(m.t+380-m.b)/2).attr('y',20).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',14).text('需要多少判断 →');
  }

  function roadmap(el) {
    const c=colors(), svg=svgFor(el,1100,360);
    const data=[
      {day:'30',title:'建立一个闭环',lines:['选择真实重复任务','写清上下文与验收条件','补上回归测试'],x:170,y:225},
      {day:'90',title:'交付端到端项目',lines:['让 Agent 跨越多个阶段','记录失败与修正','沉淀规则和工作流程'],x:550,y:145},
      {day:'365',title:'形成长期能力',lines:['建立领域资产与方法','管理人和 Agent 协作','对复杂结果负责'],x:930,y:72}
    ];
    const path=d3.path(); path.moveTo(data[0].x,data[0].y); path.bezierCurveTo(350,225,380,145,data[1].x,data[1].y); path.bezierCurveTo(730,145,770,72,data[2].x,data[2].y);
    const line=svg.append('path').attr('d',path.toString()).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',3);
    const len=line.node().getTotalLength(); line.attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(1200).attr('stroke-dashoffset',0);
    const nodes=svg.append('g').selectAll('g').data(data).join('g').attr('transform',d=>`translate(${d.x},${d.y})`).attr('opacity',0);
    nodes.append('circle').attr('r',39).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-width',2);
    nodes.append('text').attr('text-anchor','middle').attr('y',7).attr('fill',c.accent).attr('font-size',25).attr('font-weight',700).text(d=>d.day);
    nodes.append('text').attr('text-anchor','middle').attr('y',60).attr('fill',c.text).attr('font-size',19).attr('font-weight',650).text(d=>d.title);
    nodes.each(function(d){ multiline(d3.select(this),d.lines,0,87,21).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',13); });
    nodes.transition().duration(500).delay((d,i)=>300+i*350).attr('opacity',1);
    svg.append('text').attr('x',170).attr('y',32).attr('fill',c.muted).attr('font-size',13).text('从一个可复现任务开始');
    svg.append('text').attr('x',930).attr('y',337).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',13).text('从会用工具，走向真正理解一个领域');
  }

  function productLoop(el) {
    const c=colors(), svg=svgFor(el,1200,430);
    const palette={edge:'#b9f46c',ble:'#59e3ff',quic:'#6b8cff',cloud:'#ffad66',insight:'#c792ff'};
    const defs=svg.append('defs');
    Object.entries(palette).forEach(([name,color])=>{
      defs.append('marker').attr('id',`arrow-${name}`).attr('viewBox','0 0 10 10').attr('refX',9).attr('refY',5)
        .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto-start-reverse')
        .append('path').attr('d','M 0 0 L 10 5 L 0 10 z').attr('fill',color);
    });
    const glow=defs.append('filter').attr('id','particle-glow'); glow.append('feGaussianBlur').attr('stdDeviation',3).attr('result','blur');
    const stageData=[['EDGE · 球鞋',35,270,palette.edge],['MOBILE · 本地',320,210,palette.ble],['CLOUD · 汇聚',535,330,palette.cloud],['INTELLIGENCE · 个性化',870,300,palette.insight]];
    stageData.forEach(([label,x,w,color])=>{
      svg.append('text').attr('x',x).attr('y',24).attr('fill',color).attr('font-size',12).attr('font-weight',650).attr('letter-spacing',1.4).text(label);
      svg.append('line').attr('x1',x).attr('x2',x+w).attr('y1',35).attr('y2',35).attr('stroke',color).attr('stroke-opacity',.35);
    });

    const linkData=[
      {d:'M105,132 L181,170',color:palette.edge},{d:'M105,222 L181,170',color:palette.edge},
      {d:'M249,170 L342,170',color:palette.ble,label:'BLE'},
      {d:'M452,170 L548,170',color:palette.quic,label:'QUIC'},
      {d:'M620,170 L702,170',color:palette.cloud,label:'会话流'},
      {d:'M822,170 L886,170',color:palette.cloud,label:'群体基线'},
      {d:'M988,170 L1024,170',color:palette.insight,label:'个性化结果'}
    ];
    const links=svg.append('g').selectAll('path').data(linkData).join('path').attr('d',d=>d.d).attr('fill','none')
      .attr('stroke',d=>d.color).attr('stroke-width',2).attr('stroke-opacity',.6).attr('marker-end',d=>`url(#arrow-${Object.keys(palette).find(k=>palette[k]===d.color)})`);
    links.each(function(d){ const len=this.getTotalLength(); d3.select(this).attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(900).attr('stroke-dashoffset',0); });
    linkData.filter(d=>d.label).forEach(d=>{
      const nums=d.d.match(/[\d.]+/g).map(Number), mx=(nums[0]+nums[2])/2;
      svg.append('text').attr('x',mx).attr('y',148).attr('text-anchor','middle').attr('fill',d.color).attr('font-size',11).attr('font-weight',650).text(d.label);
    });

    // Dual shoes and edge aggregation.
    [['左鞋 IMU',58,110],['右鞋 IMU',58,200]].forEach(([label,x,y],i)=>{
      const g=svg.append('g').attr('transform',`translate(${x},${y})`);
      g.append('rect').attr('x',-47).attr('y',-24).attr('width',94).attr('height',48).attr('rx',12).attr('fill',c.bg).attr('stroke',palette.edge);
      g.append('path').attr('d','M-26 5 Q-4 -15 26 3').attr('fill','none').attr('stroke',palette.edge).attr('stroke-width',2);
      g.append('text').attr('text-anchor','middle').attr('y',40).attr('fill',c.text).attr('font-size',12).text(label);
    });
    const edge=svg.append('g').attr('transform','translate(215,170)');
    edge.append('circle').attr('r',35).attr('fill',palette.edge).attr('fill-opacity',.11).attr('stroke',palette.edge).attr('stroke-width',2);
    edge.append('text').attr('text-anchor','middle').attr('y',-3).attr('fill',palette.edge).attr('font-size',14).attr('font-weight',700).text('鞋端');
    edge.append('text').attr('text-anchor','middle').attr('y',15).attr('fill',c.text).attr('font-size',11).text('简单聚合');

    // Phone aggregation.
    const phone=svg.append('g').attr('transform','translate(397,170)');
    phone.append('rect').attr('x',-55).attr('y',-82).attr('width',110).attr('height',164).attr('rx',14).attr('fill',c.bg).attr('stroke',palette.ble).attr('stroke-width',2);
    phone.append('rect').attr('x',-43).attr('y',-61).attr('width',86).attr('height',91).attr('fill',palette.ble).attr('fill-opacity',.06).attr('stroke',palette.ble).attr('stroke-opacity',.25);
    [0,1,2].forEach(i=>phone.append('line').attr('x1',-30).attr('x2',30-i*8).attr('y1',-42+i*25).attr('y2',-42+i*25).attr('stroke',palette.ble));
    phone.append('circle').attr('cy',57).attr('r',6).attr('fill',palette.ble);
    phone.append('text').attr('text-anchor','middle').attr('y',105).attr('fill',c.text).attr('font-size',14).attr('font-weight',650).text('手机本地聚合');
    phone.append('text').attr('text-anchor','middle').attr('y',125).attr('fill',c.muted).attr('font-size',11).text('对时 · 会话 · 缓存');

    // Cloud ingress.
    const cloud=svg.append('g').attr('transform','translate(584,170)');
    cloud.append('path').attr('d','M-36 15 C-55 4 -48 -22 -27 -23 C-14 -51 29 -44 35 -18 C58 -15 58 18 37 22 H-34 Z').attr('fill',palette.cloud).attr('fill-opacity',.1).attr('stroke',palette.cloud).attr('stroke-width',2);
    cloud.append('text').attr('text-anchor','middle').attr('y',50).attr('fill',c.text).attr('font-size',14).attr('font-weight',650).text('云端入口');
    cloud.append('text').attr('text-anchor','middle').attr('y',69).attr('fill',c.muted).attr('font-size',11).text('认证 · 去重 · 入湖');

    // Population data cloud with deterministic particles.
    const population=svg.append('g').attr('transform','translate(762,170)');
    population.append('circle').attr('r',61).attr('fill',palette.cloud).attr('fill-opacity',.045).attr('stroke',palette.cloud).attr('stroke-opacity',.45).attr('stroke-dasharray','3 7');
    const dots=d3.range(54).map(i=>{const a=i*2.399,r=10+(i%9)*5.4;return {x:Math.cos(a)*r,y:Math.sin(a)*r};});
    population.selectAll('circle.dot').data(dots).join('circle').attr('class','dot').attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',3.2).attr('fill',palette.cloud).attr('opacity',.18)
      .transition().delay((d,i)=>180+i*15).attr('opacity',d=>.62+(Math.abs(d.x)%4)/12);
    population.append('text').attr('text-anchor','middle').attr('y',82).attr('fill',c.text).attr('font-size',14).attr('font-weight',650).text('海量样本汇聚');
    population.append('text').attr('text-anchor','middle').attr('y',101).attr('fill',c.muted).attr('font-size',11).text('球队 · 年龄 · 位置 · 历史');

    // Personalization engine.
    const personal=svg.append('g').attr('transform','translate(936,170)');
    personal.append('path').attr('d','M0-58 L50-29 L50 29 L0 58 L-50 29 L-50-29 Z').attr('fill',palette.insight).attr('fill-opacity',.1).attr('stroke',palette.insight).attr('stroke-width',2);
    personal.append('circle').attr('r',22).attr('fill','none').attr('stroke',palette.insight).attr('stroke-dasharray','3 4');
    personal.append('text').attr('text-anchor','middle').attr('y',-2).attr('fill',palette.insight).attr('font-size',14).attr('font-weight',700).text('个性化');
    personal.append('text').attr('text-anchor','middle').attr('y',17).attr('fill',c.text).attr('font-size',11).text('特征 · 基线');
    personal.append('text').attr('text-anchor','middle').attr('y',83).attr('fill',c.muted).attr('font-size',11).text('个人历史 × 群体分布');

    // User insight card and percentile comparison.
    const report=svg.append('g').attr('transform','translate(1024,65)');
    report.append('rect').attr('width',158).attr('height',238).attr('rx',7).attr('fill',c.bg).attr('stroke',palette.insight).attr('stroke-width',2);
    report.append('text').attr('x',16).attr('y',27).attr('fill',palette.insight).attr('font-size',11).attr('font-weight',650).text('你的训练洞察');
    report.append('text').attr('x',16).attr('y',68).attr('fill',c.text).attr('font-size',28).attr('font-weight',700).text('P68');
    report.append('text').attr('x',77).attr('y',67).attr('fill',c.muted).attr('font-size',11).text('爆发力');
    const px=d3.scaleLinear().domain([40,90]).range([16,142]);
    report.append('line').attr('x1',16).attr('x2',142).attr('y1',116).attr('y2',116).attr('stroke',c.line).attr('stroke-width',5);
    [50,75].forEach((v,i)=>{ report.append('circle').attr('cx',px(v)).attr('cy',116).attr('r',5).attr('fill',i?palette.insight:c.muted); report.append('text').attr('x',px(v)).attr('y',139).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',10).text(`${v}%`); });
    report.append('path').attr('d',`M${px(68)-6},102 L${px(68)+6},102 L${px(68)},112 Z`).attr('fill',palette.edge);
    report.append('text').attr('x',px(68)).attr('y',92).attr('text-anchor','middle').attr('fill',palette.edge).attr('font-size',10).attr('font-weight',650).text('你');
    report.append('text').attr('x',16).attr('y',172).attr('fill',c.text).attr('font-size',12).attr('font-weight',650).text('距前 25%：7 个百分点');
    report.append('text').attr('x',16).attr('y',196).attr('fill',c.muted).attr('font-size',10).text('建议：提升短距离启动训练');
    report.append('rect').attr('x',16).attr('y',211).attr('width',126).attr('height',12).attr('rx',6).attr('fill',palette.insight).attr('fill-opacity',.16);
    report.append('rect').attr('x',16).attr('y',211).attr('width',82).attr('height',12).attr('rx',6).attr('fill',palette.insight).attr('fill-opacity',.7);

    // Feedback closes the product loop.
    const feedback=svg.append('path').attr('d','M1104,306 C1104,382 555,401 397,292').attr('fill','none').attr('stroke',palette.insight).attr('stroke-width',3).attr('stroke-opacity',.72).attr('stroke-dasharray','8 8').attr('marker-end','url(#arrow-insight)');
    svg.append('text').attr('x',750).attr('y',395).attr('text-anchor','middle').attr('fill',palette.insight).attr('font-size',12).attr('font-weight',650).text('个性化建议返回手机 → 下一次训练 → 新数据');

    // Moving packets loop while this slide is active and stop when it is left.
    const loopParticle=(pathNode,color,delay=0,duration=1250,radius=3.5)=>{
      const len=pathNode.getTotalLength();
      const particle=svg.append('circle').attr('r',radius).attr('fill',color).attr('opacity',0).attr('filter','url(#particle-glow)');
      const run=()=>{
        const node=particle.node(), slide=el.closest('.slide');
        if(!node?.isConnected || !slide?.classList.contains('active')) { particle.interrupt().attr('opacity',0); return; }
        particle.attr('opacity',0).transition().delay(delay).duration(duration).ease(d3.easeLinear).attr('opacity',1)
          .attrTween('transform',()=>t=>{const p=pathNode.getPointAtLength(t*len);return `translate(${p.x},${p.y})`;})
          .transition().duration(140).attr('opacity',0).on('end',run);
      };
      run();
    };
    links.each(function(d,linkIndex){ d3.range(3).forEach(i=>loopParticle(this,d.color,220+i*430+linkIndex*55,1200,linkIndex<2?3:3.6)); });
    loopParticle(feedback.node(),palette.insight,350,2100,5);
  }

  const renderers={factors,evolution,rustackHistory,compatibility,system,convergence,flywheel,lifecycle,teamTopology,futureCompass,value,roadmap,productLoop};
  window.renderD3Chart = el => { const fn=renderers[el.dataset.chart]; if(fn && window.d3) fn(el); };
  window.renderChartsInSlide = slide => slide?.querySelectorAll('[data-chart]').forEach(window.renderD3Chart);
})();
