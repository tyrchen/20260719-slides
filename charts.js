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
    const c=colors(), svg=svgFor(el,1100,350);
    const data=[
      ['模型','基础能力'],['上下文','项目为何这样做'],['任务拆分','每一步都能交付'],
      ['反馈','失败及时暴露'],['验证','结果可以证明'],['人的判断','方向与责任']
    ].map(([title,sub],i)=>({title,sub,x:12+i*143}));
    const cardWidth=116, cardHeight=154, cardY=72;
    const factors=svg.append('g').selectAll('g').data(data).join('g').attr('transform',d=>`translate(${d.x},${cardY})`);
    factors.append('rect').attr('class','factor-card').attr('width',cardWidth).attr('height',cardHeight).attr('rx',4)
      .attr('fill',c.accent).attr('fill-opacity',.055).attr('stroke',c.accent).attr('stroke-opacity',.55).attr('stroke-width',1.5);
    factors.append('text').attr('x',14).attr('y',24).attr('fill',c.accent).attr('font-size',10).attr('font-weight',700)
      .text((d,i)=>String(i+1).padStart(2,'0'));
    factors.append('text').attr('x',cardWidth/2).attr('y',67).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',18).attr('font-weight',750).text(d=>d.title);
    factors.append('text').attr('x',cardWidth/2).attr('y',96).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',11).text(d=>d.sub);
    factors.append('rect').attr('class','factor-level').attr('x',14).attr('y',126).attr('width',88).attr('height',5).attr('rx',2.5).attr('fill',c.accent).attr('fill-opacity',.78);
    data.slice(0,-1).forEach((d,i)=>svg.append('text').attr('x',d.x+130).attr('y',cardY+84).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',24).attr('font-weight',500).text('×'));
    svg.append('text').attr('x',875).attr('y',cardY+84).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',25).attr('font-weight',650).text('=');
    const output=svg.append('g').attr('transform',`translate(902,${cardY})`);
    output.append('rect').attr('width',174).attr('height',cardHeight).attr('rx',4).attr('fill',c.accent).attr('fill-opacity',.12).attr('stroke',c.accent).attr('stroke-width',2);
    output.append('text').attr('x',87).attr('y',29).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',10).attr('font-weight',700).text('PRODUCT');
    const outputLabel=output.append('text').attr('x',87).attr('y',73).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',21).attr('font-weight',800).text('可靠交付');
    output.append('text').attr('x',87).attr('y',101).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',12).text('整体结果');
    const outputLevel=output.append('rect').attr('x',18).attr('y',126).attr('width',138).attr('height',5).attr('rx',2.5).attr('fill',c.accent);
    svg.append('text').attr('x',550).attr('y',278).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',18).attr('font-weight',700).text('任何一项接近零，整体结果也会被拖低');
    svg.append('text').attr('x',550).attr('y',310).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',13).text('模型能力不会替代上下文，生成速度也不会替代验证与责任');

    let weakIndex=0;
    const demonstrate=()=>{
      if(!el.closest('.slide')?.classList.contains('active')) return;
      const weak=factors.filter((d,i)=>i===weakIndex);
      weak.select('.factor-card').transition().delay(850).duration(280).attr('stroke','#ff79b7').attr('fill-opacity',.015)
        .transition().delay(430).duration(320).attr('stroke',c.accent).attr('fill-opacity',.055);
      weak.select('.factor-level').transition().delay(850).duration(280).attr('width',12).attr('fill','#ff79b7')
        .transition().delay(430).duration(320).attr('width',88).attr('fill',c.accent);
      outputLevel.transition().delay(850).duration(280).attr('width',24).attr('fill','#ff79b7')
        .transition().delay(430).duration(320).attr('width',138).attr('fill',c.accent)
        .on('end',()=>{ weakIndex=(weakIndex+1)%data.length; demonstrate(); });
      outputLabel.transition().delay(850).duration(1).text('整体被拖低').attr('fill','#ff79b7')
        .transition().delay(700).duration(1).text('可靠交付').attr('fill',c.text);
    };
    demonstrate();
  }

  function evolution(el) {
    const c=colors(), svg=svgFor(el,1100,340), m={l:70,r:45,t:34,b:82};
    const data=[
      {label:'代码补全',unit:'一行 / 函数',memory:'编辑器',proof:'编译',level:16},
      {label:'对话式编程',unit:'一次修改',memory:'一次会话',proof:'人工检查',level:30},
      {label:'Agent 执行',unit:'完整任务',memory:'仓库',proof:'测试',level:47},
      {label:'规格驱动',unit:'可交付阶段',memory:'规格 / 计划',proof:'完成标准',level:64},
      {label:'多角色协作',unit:'跨阶段项目',memory:'共享产物',proof:'独立审查',level:81},
      {label:'AI 工程系统',unit:'持续交付',memory:'版本化记忆',proof:'真实反馈',level:96}
    ];
    const x=d3.scalePoint().domain(d3.range(data.length)).range([m.l,1100-m.r]).padding(.4);
    const y=d3.scaleLinear().domain([0,100]).range([340-m.b,m.t]);
    const defs=svg.append('defs');
    const grad=defs.append('linearGradient').attr('id','evolution-area').attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
    grad.append('stop').attr('offset','0%').attr('stop-color',c.accent).attr('stop-opacity',.22);
    grad.append('stop').attr('offset','100%').attr('stop-color',c.accent).attr('stop-opacity',0);
    const area=d3.area().x((d,i)=>x(i)).y0(340-m.b).y1(d=>y(d.level)).curve(d3.curveStepAfter);
    const line=d3.line().x((d,i)=>x(i)).y(d=>y(d.level)).curve(d3.curveStepAfter);
    svg.append('path').datum(data).attr('d',area).attr('fill','url(#evolution-area)').attr('opacity',.72);
    svg.append('path').datum(data).attr('d',line).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',8).attr('stroke-opacity',.1);
    const path=svg.append('path').datum(data).attr('d',line).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',3);
    const len=path.node().getTotalLength(); path.attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(1200).attr('stroke-dashoffset',0);
    const nodes=svg.append('g').selectAll('g').data(data).join('g').attr('transform',(d,i)=>`translate(${x(i)},${y(d.level)})`).attr('opacity',.48);
    nodes.append('circle').attr('r',8).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-width',3);
    nodes.append('line').attr('y1',14).attr('y2',38).attr('stroke',c.accent).attr('stroke-opacity',.42);
    nodes.append('text').attr('y',57).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',15).attr('font-weight',700).text(d=>d.label);
    nodes.append('text').attr('y',77).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',11).text(d=>d.unit);
    nodes.transition().duration(420).delay((d,i)=>i*120).attr('opacity',1);
    svg.append('text').attr('x',m.l).attr('y',22).attr('fill',c.muted).attr('font-size',13).text('可独立交付的工作范围 ↑');
    svg.append('text').attr('x',1100-m.r).attr('y',330).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',13).text('任务单位变大 · 记忆留得更久 · 验证更清楚 →');
  }

  function modelExpansion(el) {
    const c=colors(), svg=svgFor(el,1100,350), blue='#6b8cff', lime='#b9f46c';
    const services=[
      {name:'S3',x:570,y:45},{name:'DynamoDB',x:760,y:45},{name:'SQS',x:950,y:45},
      {name:'Lambda',x:570,y:145},{name:'EventBridge',x:760,y:145},{name:'+ 13 个服务',x:950,y:145}
    ];
    const source=svg.append('g').attr('transform','translate(90,96)');
    source.append('rect').attr('width',175).attr('height',100).attr('rx',4).attr('fill',blue).attr('fill-opacity',.08).attr('stroke',blue).attr('stroke-width',2);
    source.append('text').attr('x',18).attr('y',32).attr('fill',blue).attr('font-size',12).attr('font-weight',700).text('SMITHY MODEL');
    source.append('text').attr('x',18).attr('y',62).attr('fill',c.text).attr('font-size',19).attr('font-weight',700).text('操作 · 类型 · 协议');
    source.append('text').attr('x',18).attr('y',85).attr('fill',c.muted).attr('font-size',13).text('结构化事实来源');

    const generator=svg.append('g').attr('transform','translate(350,96)');
    generator.append('path').attr('d','M0,0 H145 L175,50 L145,100 H0 Z').attr('fill',c.accent).attr('fill-opacity',.1).attr('stroke',c.accent).attr('stroke-width',2);
    generator.append('text').attr('x',80).attr('y',43).attr('text-anchor','middle').attr('fill',c.accent).attr('font-size',18).attr('font-weight',750).text('代码生成器');
    generator.append('text').attr('x',80).attr('y',69).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',13).text('类型 · 绑定 · 路由');

    const paths=[];
    services.forEach(s=>paths.push({d:`M525,146 C555,146 520,${s.y+36} ${s.x},${s.y+36}`,color:blue}));
    paths.unshift({d:'M265,146 H350',color:c.accent});
    const link=svg.append('g').selectAll('path').data(paths).join('path').attr('d',d=>d.d).attr('fill','none').attr('stroke',d=>d.color).attr('stroke-width',2).attr('stroke-opacity',.55);
    const service=svg.append('g').selectAll('g').data(services).join('g').attr('transform',d=>`translate(${d.x},${d.y})`);
    service.append('rect').attr('width',145).attr('height',72).attr('rx',3).attr('fill',blue).attr('fill-opacity',.055).attr('stroke',blue).attr('stroke-opacity',.65);
    service.append('text').attr('x',16).attr('y',31).attr('fill',c.text).attr('font-size',17).attr('font-weight',700).text(d=>d.name);
    service.append('text').attr('x',16).attr('y',54).attr('fill',c.muted).attr('font-size',12).text('Rust 服务与测试');

    svg.append('path').attr('d','M1022,230 C1000,315 480,334 190,228').attr('fill','none').attr('stroke',lime).attr('stroke-width',2.5).attr('stroke-dasharray','7 7').attr('stroke-opacity',.72);
    svg.append('text').attr('x',720).attr('y',316).attr('text-anchor','middle').attr('fill',lime).attr('font-size',14).attr('font-weight',700).text('兼容测试把差距写回规格');
    link.each(function(){const len=this.getTotalLength();d3.select(this).attr('stroke-dasharray',len).attr('stroke-dashoffset',len*.18).transition().duration(900).attr('stroke-dashoffset',0);});
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

  function kineticHistory(el) {
    const c=colors(), svg=svgFor(el,1100,360);
    const palette=['#b9f46c','#59e3ff','#6b8cff','#ffad66','#c792ff'];
    const phases=[
      {id:'01',name:'Reflex 纵向切片',count:9,start:0,end:8,color:palette[0]},
      {id:'02',name:'验证与契约加固',count:48,start:9,end:56,color:palette[1]},
      {id:'03',name:'Cortex 与数据契约',count:7,start:57,end:63,color:palette[2]},
      {id:'04',name:'Thalamus 控制平面',count:15,start:64,end:78,color:palette[3]},
      {id:'05',name:'产品 UI 闭环',count:37,start:79,end:115,color:palette[4]}
    ];
    const x=d3.scaleLinear().domain([0,115]).range([50,1050]);
    const y=d3.scaleLinear().domain([1,5]).range([194,92]);

    svg.append('text').attr('x',22).attr('y',-1).attr('fill',c.muted).attr('font-size',10).attr('letter-spacing',1.4).text('五个阶段 · 提交数');
    const phase=svg.append('g').selectAll('g').data(phases).join('g').attr('transform',(d,i)=>`translate(${22+i*214},7)`);
    phase.append('rect').attr('width',202).attr('height',52).attr('rx',3).attr('fill',d=>d.color).attr('fill-opacity',.055).attr('stroke',d=>d.color).attr('stroke-opacity',.42);
    phase.append('rect').attr('width',4).attr('height',52).attr('fill',d=>d.color).attr('fill-opacity',.9);
    phase.append('text').attr('x',13).attr('y',19).attr('fill',d=>d.color).attr('font-size',10).attr('font-weight',700).text(d=>d.id);
    phase.append('text').attr('x',13).attr('y',40).attr('fill',c.text).attr('font-size',13).attr('font-weight',650).text(d=>d.name);
    phase.append('text').attr('x',187).attr('y',35).attr('text-anchor','end').attr('fill',d=>d.color).attr('font-size',22).attr('font-weight',750).text(d=>d.count);

    svg.append('text').attr('x',50).attr('y',78).attr('fill',c.muted).attr('font-size',11).text('已落地的工程层');
    [1,2,3,4,5].forEach(value=>{
      svg.append('line').attr('x1',50).attr('x2',1050).attr('y1',y(value)).attr('y2',y(value)).attr('stroke',c.line).attr('stroke-dasharray','2 8');
      svg.append('text').attr('x',39).attr('y',y(value)+4).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',9).text(value);
    });
    const coverage=[
      {i:0,n:1,label:'Reflex'},{i:58,n:2,label:'Cortex'},{i:61,n:3,label:'Data'},
      {i:65,n:4,label:'Cloud'},{i:79,n:5,label:'UI'}
    ];
    const line=d3.line().x(d=>x(d.i)).y(d=>y(d.n)).curve(d3.curveStepAfter);
    svg.append('path').datum(coverage).attr('d',line).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',8).attr('stroke-opacity',.08);
    const growth=svg.append('path').datum(coverage).attr('d',line).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',2.5);
    const growthLength=growth.node().getTotalLength();
    growth.attr('stroke-dasharray',growthLength).attr('stroke-dashoffset',growthLength).transition().duration(1300).ease(d3.easeCubicOut).attr('stroke-dashoffset',0);
    const milestones=svg.append('g').selectAll('g').data(coverage).join('g').attr('transform',d=>`translate(${x(d.i)},${y(d.n)})`);
    milestones.append('circle').attr('r',4).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-width',2);
    milestones.append('text').attr('x',7).attr('y',(d,i)=>i%2?-8:16).attr('fill',c.text).attr('font-size',10).attr('font-weight',650).attr('paint-order','stroke').attr('stroke',c.bg).attr('stroke-width',4).text(d=>d.label);

    phases.slice(1).forEach(phaseBoundary=>{
      svg.append('line').attr('x1',x(phaseBoundary.start-.5)).attr('x2',x(phaseBoundary.start-.5)).attr('y1',83).attr('y2',327).attr('stroke',phaseBoundary.color).attr('stroke-opacity',.2).attr('stroke-dasharray','3 7');
    });
    const dots=d3.range(116).map(i=>{
      const phaseIndex=phases.findIndex(p=>i>=p.start && i<=p.end);
      return {i,row:i%4,color:phases[phaseIndex].color};
    });
    svg.append('line').attr('x1',50).attr('x2',1050).attr('y1',326).attr('y2',326).attr('stroke',c.line);
    const commitDots=svg.append('g').selectAll('circle').data(dots).join('circle')
      .attr('cx',d=>x(d.i)).attr('cy',d=>321-d.row*5.3).attr('r',2.65).attr('fill',d=>d.color).attr('opacity',.18);
    commitDots.transition().delay((d,i)=>i*6).duration(220).attr('opacity',.96);
    svg.append('text').attr('x',50).attr('y',230).attr('fill',c.muted).attr('font-size',11).text('每个圆点代表一次提交');

    const ticks=[{i:0,t:'06.19',anchor:'start'},{i:17,t:'06.20',anchor:'middle'},{i:69,t:'06.21',anchor:'middle'},{i:115,t:'116',anchor:'end'}];
    ticks.forEach(t=>{
      svg.append('line').attr('x1',x(t.i)).attr('x2',x(t.i)).attr('y1',326).attr('y2',332).attr('stroke',c.muted);
      svg.append('text').attr('x',x(t.i)).attr('y',348).attr('text-anchor',t.anchor).attr('fill',c.muted).attr('font-size',10).text(t.t);
    });
    const annotations=[
      {i:8,text:'Phase 0—6',y:249,anchor:'end'},
      {i:55,text:'模拟器发布证据',y:266,anchor:'end'},
      {i:58,text:'Cortex 端到端',y:247,anchor:'start'},
      {i:78,text:'Cloud 可发布',y:266,anchor:'end'},
      {i:114,text:'React 控制平面',y:247,anchor:'end'}
    ];
    annotations.forEach(a=>{
      svg.append('line').attr('x1',x(a.i)).attr('x2',x(a.i)).attr('y1',a.y+5).attr('y2',299).attr('stroke',c.line).attr('stroke-dasharray','2 5');
      svg.append('text').attr('x',x(a.i)+(a.anchor==='start'?5:-5)).attr('y',a.y).attr('text-anchor',a.anchor).attr('fill',c.text).attr('font-size',10).attr('font-weight',650).text(a.text);
    });
  }

  function compatibility(el) {
    const c=colors(), svg=svgFor(el,1100,330), pink='#ff79b7', lime='#b9f46c';
    const waves=[
      {id:'01',commit:'d4cef2a',title:'旧接口、表达式与校验',note:'修复 245+ 个失败',x:55},
      {id:'02',commit:'855c12f',title:'数值、嵌套路径与返回语义',note:'修复 181 个失败',x:355},
      {id:'03',commit:'6c10945',title:'剩余兼容语义',note:'选定用例全部通过',x:655}
    ];
    svg.append('line').attr('x1',90).attr('x2',945).attr('y1',145).attr('y2',145).attr('stroke',c.accent).attr('stroke-width',8).attr('stroke-opacity',.1);
    const wave=svg.append('g').selectAll('g').data(waves).join('g').attr('transform',d=>`translate(${d.x},55)`);
    wave.append('rect').attr('width',260).attr('height',180).attr('rx',4).attr('fill',c.accent).attr('fill-opacity',.045).attr('stroke',c.accent).attr('stroke-opacity',.48);
    wave.append('text').attr('x',20).attr('y',30).attr('fill',c.accent).attr('font-size',12).attr('font-weight',700).text(d=>`第 ${d.id} 轮`);
    wave.append('text').attr('x',238).attr('y',30).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',11).text(d=>d.commit);
    wave.each(function(d){multiline(d3.select(this),d.title.split('、'),20,75,23).attr('fill',c.text).attr('font-size',16).attr('font-weight',650);});
    wave.append('text').attr('x',20).attr('y',156).attr('fill',pink).attr('font-size',14).attr('font-weight',700).text(d=>d.note);
    const final=svg.append('g').attr('transform','translate(945,42)');
    final.append('rect').attr('width',130).attr('height',206).attr('rx',4).attr('fill',lime).attr('fill-opacity',.1).attr('stroke',lime).attr('stroke-width',2);
    final.append('text').attr('x',65).attr('y',54).attr('text-anchor','middle').attr('fill',lime).attr('font-size',14).attr('font-weight',700).text('ALTERNATOR');
    final.append('text').attr('x',65).attr('y',112).attr('text-anchor','middle').attr('fill',c.text).attr('font-size',24).attr('font-weight',800).text('457 / 457');
    final.append('text').attr('x',65).attr('y',145).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',13).text('选定用例');
    final.append('text').attr('x',65).attr('y',180).attr('text-anchor','middle').attr('fill',lime).attr('font-size',15).attr('font-weight',700).text('全部通过');
    svg.append('path').attr('d','M80,270 H1010').attr('stroke',c.line).attr('stroke-width',1.5);
    svg.append('text').attr('x',545).attr('y',305).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',14).text('测试不是分数牌，而是一张可以按顺序修复的语义地图');
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
      .attr('stroke-dasharray',function(){return this.getTotalLength()}).attr('stroke-dashoffset',function(){return this.getTotalLength()*.18});
    link.transition().duration(1000).delay((d,i)=>i*100).attr('stroke-dashoffset',0);
    const nodes=svg.append('g').selectAll('g').data(data).join('g').attr('transform',d=>`translate(${d.x},${d.y})`).attr('opacity',.48);
    nodes.append('rect').attr('x',-108).attr('y',-34).attr('width',216).attr('height',68).attr('rx',2).attr('fill',c.bg).attr('stroke',c.line);
    nodes.append('text').attr('x',-86).attr('y',-5).attr('fill',c.text).attr('font-size',17).attr('font-weight',650).text(d=>d.id);
    nodes.append('text').attr('x',-86).attr('y',18).attr('fill',c.muted).attr('font-size',11).text(d=>d.sub);
    nodes.transition().duration(500).delay((d,i)=>i*100).attr('opacity',1);
    const core=svg.append('g').attr('transform',`translate(${cx},${cy})`).attr('opacity',1);
    core.append('circle').attr('r',79).attr('fill',c.accent).attr('fill-opacity',.12).attr('stroke',c.accent).attr('stroke-width',2);
    core.append('circle').attr('r',61).attr('fill',c.bg).attr('stroke',c.accent).attr('stroke-opacity',.4);
    core.append('text').attr('text-anchor','middle').attr('y',-5).attr('fill',c.accent).attr('font-size',22).attr('font-weight',700).text('数据契约');
    core.append('text').attr('text-anchor','middle').attr('y',22).attr('fill',c.muted).attr('font-size',11).text('格式 · 时间 · 版本 · 质量');
  }

  function kineticArchitecture(el) {
    const c=colors(), svg=svgFor(el,1200,410);
    const palette={tendon:'#b9f46c',reflex:'#59e3ff',cortex:'#6b8cff',thalamus:'#ffad66',cerebellum:'#c792ff',ui:'#ff79b7'};
    const defs=svg.append('defs');
    Object.entries(palette).forEach(([name,color])=>{
      defs.append('marker').attr('id',`kinetic-${name}`).attr('viewBox','0 0 10 10').attr('refX',9).attr('refY',5)
        .attr('markerWidth',5.5).attr('markerHeight',5.5).attr('orient','auto')
        .append('path').attr('d','M0 0 L10 5 L0 10 Z').attr('fill',color);
    });
    const glow=defs.append('filter').attr('id','kinetic-glow');
    glow.append('feGaussianBlur').attr('stdDeviation',2.7).attr('result','blur');

    const ui=svg.append('g').attr('transform','translate(472,7)');
    ui.append('rect').attr('width',712).attr('height',76).attr('rx',5).attr('fill',palette.ui).attr('fill-opacity',.045).attr('stroke',palette.ui).attr('stroke-opacity',.58).attr('stroke-dasharray','5 6');
    ui.append('text').attr('x',17).attr('y',20).attr('fill',palette.ui).attr('font-size',10).attr('font-weight',750).attr('letter-spacing',1.2).text('UI 跨产品契约 · 不是第六个运行时');
    const uiItems=[
      {x:17,w:205,title:'移动训练',sub:'Today · Train · Growth · Video'},
      {x:239,w:205,title:'授权投影 API',sub:'live · pending · stale · unavailable'},
      {x:461,w:234,title:'运营控制面',sub:'Ops · Devices · Rollout · Replay'}
    ];
    const uiItem=ui.selectAll('g.ui-item').data(uiItems).join('g').attr('class','ui-item').attr('transform',d=>`translate(${d.x},28)`);
    uiItem.append('rect').attr('width',d=>d.w).attr('height',35).attr('rx',3).attr('fill',palette.ui).attr('fill-opacity',.055).attr('stroke',palette.ui).attr('stroke-opacity',.25);
    uiItem.append('text').attr('x',10).attr('y',15).attr('fill',c.text).attr('font-size',11).attr('font-weight',700).text(d=>d.title);
    uiItem.append('text').attr('x',10).attr('y',29).attr('fill',c.muted).attr('font-size',8.5).text(d=>d.sub);

    const nodes=[
      {id:'tendon',name:'Tendon',role:'传感器',lines:['电源 · RF · 机械','校准 · 制造证据'],x:10},
      {id:'reflex',name:'Reflex',role:'鞋端固件',lines:['采样 → Flash → BLE','修复 · OTA · 诊断'],x:248},
      {id:'cortex',name:'Cortex',role:'接收器',lines:['对时 · Store-before-ACK','会话 · 恢复 · 上传'],x:486},
      {id:'thalamus',name:'Thalamus',role:'云端控制平面',lines:['Auth · 设备 · 会话','Desired State · 审计'],x:724},
      {id:'cerebellum',name:'Cerebellum',role:'数据 / ML',lines:['Raw → Bronze → Silver → Gold','Quality · Label · Model'],x:962}
    ].map(d=>({...d,color:palette[d.id],cx:d.x+95}));
    const nodeY=145, nodeW=190, nodeH=130;

    const dataLinks=nodes.slice(0,-1).map((node,i)=>({
      from:node,to:nodes[i+1],
      label:['硬件','BLE','S3','EVENT'][i],
      color:nodes[i+1].color
    }));
    const links=svg.append('g').selectAll('path').data(dataLinks).join('path')
      .attr('d',d=>`M${d.from.x+nodeW},210 H${d.to.x}`)
      .attr('fill','none').attr('stroke',d=>d.color).attr('stroke-width',2.4).attr('stroke-opacity',.75)
      .attr('marker-end',d=>`url(#kinetic-${d.to.id})`);
    dataLinks.forEach(d=>svg.append('text').attr('x',(d.from.x+nodeW+d.to.x)/2).attr('y',196).attr('text-anchor','middle').attr('fill',d.color).attr('font-size',8.5).attr('font-weight',750).text(d.label));

    const node=svg.append('g').selectAll('g.runtime-node').data(nodes).join('g').attr('class','runtime-node').attr('transform',d=>`translate(${d.x},${nodeY})`);
    node.append('rect').attr('width',nodeW).attr('height',nodeH).attr('rx',4).attr('fill',d=>d.color).attr('fill-opacity',.055).attr('stroke',d=>d.color).attr('stroke-opacity',.62);
    node.append('rect').attr('width',5).attr('height',nodeH).attr('fill',d=>d.color);
    node.append('text').attr('x',18).attr('y',27).attr('fill',d=>d.color).attr('font-size',11).attr('font-weight',750).attr('letter-spacing',.8).text(d=>d.name.toUpperCase());
    node.append('text').attr('x',18).attr('y',57).attr('fill',c.text).attr('font-size',19).attr('font-weight',760).text(d=>d.role);
    node.each(function(d){
      const g=d3.select(this);
      d.lines.forEach((lineText,i)=>g.append('text').attr('x',18).attr('y',88+i*23).attr('fill',i?c.muted:'#dce2ea').attr('font-size',10.5).text(lineText));
    });

    const control1=svg.append('path').attr('d','M819,145 C819,105 581,105 581,145').attr('fill','none').attr('stroke',palette.thalamus).attr('stroke-width',2.2).attr('stroke-opacity',.68).attr('stroke-dasharray','6 6').attr('marker-end','url(#kinetic-cortex)');
    const control2=svg.append('path').attr('d','M581,145 C581,112 343,112 343,145').attr('fill','none').attr('stroke',palette.cortex).attr('stroke-width',2.2).attr('stroke-opacity',.68).attr('stroke-dasharray','6 6').attr('marker-end','url(#kinetic-reflex)');
    svg.append('text').attr('x',700).attr('y',101).attr('text-anchor','middle').attr('fill',palette.thalamus).attr('font-size',9.5).attr('font-weight',650).text('配置 · Schema · Firmware');
    svg.append('text').attr('x',462).attr('y',109).attr('text-anchor','middle').attr('fill',palette.cortex).attr('font-size',9.5).attr('font-weight',650).text('ACK / NACK · 对时 · DFU');

    const evidencePath=svg.append('path').attr('d','M1057,275 C1057,321 819,321 819,275').attr('fill','none').attr('stroke',palette.cerebellum).attr('stroke-width',2.4).attr('stroke-opacity',.72).attr('stroke-dasharray','7 7').attr('marker-end','url(#kinetic-thalamus)');
    svg.append('text').attr('x',938).attr('y',316).attr('text-anchor','middle').attr('fill',palette.cerebellum).attr('font-size',10).attr('font-weight',700).text('Gold 投影 · 质量 · 模型证据');

    [nodes[2],nodes[3],nodes[4]].forEach((runtime,i)=>{
      const uiTargetX=[591,829,1067][i];
      svg.append('path').attr('d',`M${uiTargetX},83 V${nodeY-8}`).attr('fill','none').attr('stroke',palette.ui).attr('stroke-opacity',.28).attr('stroke-dasharray','3 6');
    });

    const verify=[
      {title:'物理证据',sub:'仪器 · EVT / DVT / PVT'},
      {title:'固件证据',sub:'Host · Renode · HITL'},
      {title:'接收证据',sub:'崩溃恢复 · 双鞋 · 实机'},
      {title:'权威证据',sub:'AuthZ · 幂等 · 审计'},
      {title:'数据证据',sub:'Replay · Quality · ML gate'}
    ];
    const verifyGroup=svg.append('g').selectAll('g').data(verify).join('g').attr('transform',(d,i)=>`translate(${nodes[i].x},350)`);
    verifyGroup.append('rect').attr('width',nodeW).attr('height',58).attr('rx',3).attr('fill',(d,i)=>nodes[i].color).attr('fill-opacity',.035).attr('stroke',(d,i)=>nodes[i].color).attr('stroke-opacity',.32);
    verifyGroup.append('text').attr('x',14).attr('y',23).attr('fill',(d,i)=>nodes[i].color).attr('font-size',11).attr('font-weight',750).text(d=>d.title);
    verifyGroup.append('text').attr('x',14).attr('y',43).attr('fill',c.muted).attr('font-size',9.5).text(d=>d.sub);
    svg.append('text').attr('x',10).attr('y',339).attr('fill',c.muted).attr('font-size',9.5).attr('letter-spacing',1.1).text('每一层都有自己的现实校验');

    const loopAlong=(pathNode,color,delay,duration,radius=3.5)=>{
      const len=pathNode.getTotalLength(), particle=svg.append('circle').attr('r',radius).attr('fill',color).attr('opacity',0).attr('filter','url(#kinetic-glow)');
      const run=()=>{
        const slide=el.closest('.slide');
        if(!particle.node()?.isConnected || !slide?.classList.contains('active')) { particle.interrupt().attr('opacity',0); return; }
        particle.attr('opacity',0).transition().delay(delay).duration(duration).ease(d3.easeLinear).attr('opacity',1)
          .attrTween('transform',()=>t=>{const p=pathNode.getPointAtLength(t*len);return `translate(${p.x},${p.y})`;})
          .transition().duration(100).attr('opacity',0).on('end',run);
      };
      run();
    };
    links.each(function(d,i){loopAlong(this,d.color,220+i*160,1050,3.2);});
    loopAlong(control1.node(),palette.thalamus,520,1500,3.5);
    loopAlong(control2.node(),palette.cortex,760,1500,3.5);
    loopAlong(evidencePath.node(),palette.cerebellum,900,1750,4);
  }

  function powerTrace(el) {
    const c=colors(), svg=svgFor(el,1100,350), m={l:72,r:48,t:35,b:62}, lime='#b9f46c', orange='#ffad66';
    const data=[
      [0,3,'休眠'],[8,3],[10,17,'传感器启动'],[14,8],[24,9,'采样'],[38,9],[42,32,'Flash 写入'],[45,8],
      [58,10,'打包'],[64,10],[67,54,'BLE 发射'],[70,12],[73,47,'重传'],[76,8],[88,6],[100,3]
    ].map(([t,v,label])=>({t,v,label}));
    const x=d3.scaleLinear().domain([0,100]).range([m.l,1100-m.r]), y=d3.scaleLinear().domain([0,60]).range([350-m.b,m.t]);
    [0,20,40,60].forEach(v=>{svg.append('line').attr('x1',m.l).attr('x2',1100-m.r).attr('y1',y(v)).attr('y2',y(v)).attr('stroke',c.line).attr('stroke-dasharray','3 8');svg.append('text').attr('x',m.l-14).attr('y',y(v)+5).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',12).text(v);});
    const area=d3.area().x(d=>x(d.t)).y0(y(0)).y1(d=>y(d.v)).curve(d3.curveStepAfter);
    const line=d3.line().x(d=>x(d.t)).y(d=>y(d.v)).curve(d3.curveStepAfter);
    const defs=svg.append('defs'), grad=defs.append('linearGradient').attr('id','power-area').attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
    grad.append('stop').attr('offset','0').attr('stop-color',orange).attr('stop-opacity',.48);grad.append('stop').attr('offset','1').attr('stop-color',lime).attr('stop-opacity',.06);
    svg.append('path').datum(data).attr('d',area).attr('fill','url(#power-area)');
    svg.append('path').datum(data).attr('d',line).attr('fill','none').attr('stroke',orange).attr('stroke-width',2.5);
    const avg=11;
    svg.append('line').attr('x1',m.l).attr('x2',1100-m.r).attr('y1',y(avg)).attr('y2',y(avg)).attr('stroke',c.text).attr('stroke-width',1.5).attr('stroke-dasharray','8 7').attr('stroke-opacity',.7);
    svg.append('text').attr('x',1100-m.r).attr('y',y(avg)-9).attr('text-anchor','end').attr('fill',c.text).attr('font-size',13).text('平均线会隐藏峰值');
    data.filter(d=>d.label).forEach((d,i)=>{
      svg.append('circle').attr('cx',x(d.t)).attr('cy',y(d.v)).attr('r',4).attr('fill',i<3?lime:orange);
      svg.append('text').attr('x',x(d.t)+6).attr('y',Math.max(25,y(d.v)-12)).attr('fill',c.text).attr('font-size',13).attr('font-weight',650).text(d.label);
    });
    svg.append('text').attr('x',18).attr('y',26).attr('fill',c.muted).attr('font-size',13).text('电流 mA');
    svg.append('text').attr('x',1100-m.r).attr('y',335).attr('text-anchor','end').attr('fill',c.muted).attr('font-size',13).text('时间 →');
    svg.append('text').attr('x',550).attr('y',323).attr('text-anchor','middle').attr('fill',lime).attr('font-size',17).attr('font-weight',700).text('真正决定续航的，是整条曲线下的面积');
  }

  function knowledgeGraph(el) {
    const c=colors(), svg=svgFor(el,1100,350), orange='#ffad66';
    const nodes=[
      {id:'数据',x:75,y:175},{id:'表示',x:205,y:110},{id:'模型',x:340,y:175},{id:'损失',x:475,y:92},{id:'优化',x:610,y:175},
      {id:'泛化',x:745,y:92},{id:'评估',x:875,y:175},{id:'部署',x:1005,y:110},{id:'反馈',x:1005,y:270}
    ];
    const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
    const edges=[['数据','表示'],['表示','模型'],['模型','损失'],['损失','优化'],['优化','泛化'],['泛化','评估'],['评估','部署'],['部署','反馈'],['反馈','数据'],['数据','损失'],['表示','泛化'],['评估','模型']];
    const edgeData=edges.map(([a,b],i)=>({a:byId[a],b:byId[b],returning:i>=8}));
    svg.append('g').selectAll('path').data(edgeData).join('path').attr('d',d=>{
      if(d.returning) return `M${d.a.x},${d.a.y} Q${(d.a.x+d.b.x)/2},${d.a.y>d.b.y?330:22} ${d.b.x},${d.b.y}`;
      return `M${d.a.x},${d.a.y} C${d.a.x+55},${d.a.y} ${d.b.x-55},${d.b.y} ${d.b.x},${d.b.y}`;
    }).attr('fill','none').attr('stroke',d=>d.returning?c.accent:orange).attr('stroke-width',d=>d.returning?1.8:2.2).attr('stroke-opacity',d=>d.returning?.42:.62).attr('stroke-dasharray',d=>d.returning?'6 7':null);
    const g=svg.append('g').selectAll('g').data(nodes).join('g').attr('transform',d=>`translate(${d.x},${d.y})`);
    g.append('circle').attr('r',35).attr('fill',orange).attr('fill-opacity',.08).attr('stroke',orange).attr('stroke-width',2);
    g.append('circle').attr('r',27).attr('fill',c.bg).attr('stroke',orange).attr('stroke-opacity',.3);
    g.append('text').attr('text-anchor','middle').attr('y',6).attr('fill',c.text).attr('font-size',16).attr('font-weight',700).text(d=>d.id);
    svg.append('text').attr('x',75).attr('y',32).attr('fill',orange).attr('font-size',13).attr('font-weight',700).text('前置依赖 →');
    svg.append('text').attr('x',1025).attr('y',334).attr('text-anchor','end').attr('fill',c.accent).attr('font-size',13).attr('font-weight',700).text('评估、部署和反馈会逼着前文重写 ↺');
  }

  function memoryLoop(el) {
    const c=colors(), svg=svgFor(el,1100,360), cx=550, cy=180, palette={software:'#6b8cff',hardware:'#b9f46c',knowledge:'#ffad66',memory:'#ff79b7'};
    const nodes=[
      {title:'意图与边界',sub:'问题 · 非目标',x:550,y:38,color:c.text},
      {title:'Agent 执行',sub:'研究 · 实现',x:930,y:180,color:c.accent},
      {title:'外部证据',sub:'测试 · 测量 · 审稿',x:550,y:322,color:palette.hardware},
      {title:'项目记忆',sub:'规格 · 测试 · 规则',x:170,y:180,color:palette.memory}
    ];
    const loop=d3.line().curve(d3.curveCardinalClosed.tension(.55));
    const points=nodes.map(n=>[n.x,n.y]);
    svg.append('path').attr('d',loop(points)).attr('fill','none').attr('stroke',palette.memory).attr('stroke-width',10).attr('stroke-opacity',.08);
    const path=svg.append('path').attr('d',loop(points)).attr('fill','none').attr('stroke',palette.memory).attr('stroke-width',2.5).attr('stroke-dasharray','8 8').node();
    const g=svg.append('g').selectAll('g').data(nodes).join('g').attr('transform',d=>`translate(${d.x},${d.y})`);
    g.append('rect').attr('x',-110).attr('y',-35).attr('width',220).attr('height',70).attr('rx',4).attr('fill',d=>d.color).attr('fill-opacity',.07).attr('stroke',d=>d.color).attr('stroke-width',2);
    g.append('text').attr('text-anchor','middle').attr('y',-4).attr('fill',c.text).attr('font-size',18).attr('font-weight',700).text(d=>d.title);
    g.append('text').attr('text-anchor','middle').attr('y',21).attr('fill',d=>d.color).attr('font-size',13).text(d=>d.sub);
    const center=svg.append('g').attr('transform',`translate(${cx},${cy})`);
    center.append('circle').attr('r',73).attr('fill',palette.memory).attr('fill-opacity',.08).attr('stroke',palette.memory).attr('stroke-opacity',.45);
    center.append('text').attr('text-anchor','middle').attr('y',-8).attr('fill',palette.memory).attr('font-size',21).attr('font-weight',760).text('修正必须写回');
    center.append('text').attr('text-anchor','middle').attr('y',22).attr('fill',c.text).attr('font-size',14).text('否则只是这次对了');
    const len=path.getTotalLength(), particle=svg.append('circle').attr('r',5).attr('fill',palette.memory);
    particle.transition().duration(1900).ease(d3.easeLinear).attrTween('transform',()=>t=>{const p=path.getPointAtLength(t*len);return `translate(${p.x},${p.y})`;});
  }

  function imaginationLoop(el) {
    const c=colors(), svg=svgFor(el,1100,350), violet='#c792ff', cyan='#59e3ff', lime='#b9f46c';
    const start={x:90,y:175}, possibilities=[{x:350,y:70,t:'可能 A'},{x:350,y:175,t:'可能 B'},{x:350,y:280,t:'可能 C'}], hypothesis={x:620,y:175}, experiment={x:850,y:175}, reality={x:1030,y:175};
    possibilities.forEach(p=>svg.append('path').attr('d',`M${start.x+70},${start.y} C240,${start.y} 250,${p.y} ${p.x-66},${p.y}`).attr('fill','none').attr('stroke',violet).attr('stroke-width',2.2).attr('stroke-opacity',.62));
    possibilities.forEach(p=>svg.append('path').attr('d',`M${p.x+66},${p.y} C500,${p.y} 505,${hypothesis.y} ${hypothesis.x-76},${hypothesis.y}`).attr('fill','none').attr('stroke',cyan).attr('stroke-width',2).attr('stroke-opacity',.55));
    svg.append('path').attr('d',`M${hypothesis.x+76},175 H${experiment.x-70}`).attr('stroke',lime).attr('stroke-width',2.5);
    svg.append('path').attr('d',`M${experiment.x+70},175 H${reality.x-62}`).attr('stroke',lime).attr('stroke-width',2.5);
    svg.append('path').attr('d','M1030,237 C1000,330 250,332 90,237').attr('fill','none').attr('stroke',violet).attr('stroke-width',2.5).attr('stroke-dasharray','7 7');
    const box=(d,w,color,title,sub)=>{const g=svg.append('g').attr('transform',`translate(${d.x},${d.y})`);g.append('rect').attr('x',-w/2).attr('y',-42).attr('width',w).attr('height',84).attr('rx',4).attr('fill',color).attr('fill-opacity',.07).attr('stroke',color).attr('stroke-width',2);g.append('text').attr('text-anchor','middle').attr('y',-5).attr('fill',c.text).attr('font-size',17).attr('font-weight',720).text(title);g.append('text').attr('text-anchor','middle').attr('y',22).attr('fill',color).attr('font-size',13).text(sub);};
    box(start,140,violet,'真实问题','还有什么可能？');
    possibilities.forEach(p=>box(p,132,violet,p.t,'先不急着选'));
    box(hypothesis,152,cyan,'可检验假设','怎样才算错？');
    box(experiment,140,lime,'动手实验','小成本接触现实');
    box(reality,124,lime,'现实修正','改变方向');
    svg.append('text').attr('x',570).attr('y',337).attr('text-anchor','middle').attr('fill',violet).attr('font-size',14).attr('font-weight',700).text('反馈不是打击想象力，而是让想象力变成工程');
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
      svg.append('path').attr('d',line(values)).attr('fill','none').attr('stroke',color).attr('stroke-width',9).attr('stroke-opacity',.08);
      const path=svg.append('path').attr('d',line(values)).attr('fill','none').attr('stroke',color).attr('stroke-width',3);
      const len=path.node().getTotalLength(); path.attr('stroke-dasharray',len).attr('stroke-dashoffset',len).transition().duration(1100).attr('stroke-dashoffset',0);
      svg.append('g').selectAll('circle').data(values).join('circle').attr('cx',(d,i)=>x(stages[i])).attr('cy',d=>y(d)).attr('r',3.5).attr('fill',color).transition().delay((d,i)=>180+i*80).attr('r',6);
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

  function delegationMap(el) {
    const c=colors(), svg=svgFor(el,1100,380), m={l:105,r:35,t:42,b:58}, pink='#ff79b7';
    const x=d3.scaleLinear().domain([0,100]).range([m.l,1100-m.r]);
    const y=d3.scaleLinear().domain([0,100]).range([380-m.b,m.t]);
    const splitX=x(52), splitY=y(52);
    const zones=[
      {x:m.l,y:m.t,w:splitX-m.l,h:splitY-m.t,title:'人来定方向',anchor:'start'},
      {x:splitX,y:m.t,w:1100-m.r-splitX,h:splitY-m.t,title:'自动执行 · 人工批准',anchor:'end'},
      {x:m.l,y:splitY,w:splitX-m.l,h:380-m.b-splitY,title:'小范围试验',anchor:'start'},
      {x:splitX,y:splitY,w:1100-m.r-splitX,h:380-m.b-splitY,title:'Agent 可独立执行',anchor:'end'}
    ];
    const zone=svg.append('g').selectAll('g').data(zones).join('g');
    zone.append('rect').attr('x',d=>d.x).attr('y',d=>d.y).attr('width',d=>d.w).attr('height',d=>d.h)
      .attr('fill',(d,i)=>i===3?c.accent:i===0?pink:c.accent).attr('fill-opacity',(d,i)=>i===3?.07:i===0?.045:.022).attr('stroke',c.line);
    zone.append('text').attr('x',d=>d.anchor==='end'?d.x+d.w-15:d.x+15).attr('y',(d,i)=>i<2?d.y+24:d.y+d.h-14)
      .attr('text-anchor',d=>d.anchor).attr('fill',(d,i)=>i===0?pink:c.accent).attr('font-size',14).attr('font-weight',750).text(d=>d.title);

    const tasks=[
      {name:'架构取舍',x:27,y:86,mode:'lead'}, {name:'领域建模',x:31,y:65,mode:'lead'},
      {name:'验证设计',x:64,y:71,mode:'review'}, {name:'事故处理',x:84,y:82,mode:'review'},
      {name:'复杂调试',x:48,y:48,mode:'assist'}, {name:'机械迁移',x:77,y:43,mode:'assist'},
      {name:'文档同步',x:69,y:17,mode:'auto'}, {name:'模板代码',x:90,y:20,mode:'auto'}
    ];
    const taskColors={lead:pink,review:c.accent,assist:'#9a85d8',auto:'#c792ff'};
    const tasksG=svg.append('g').selectAll('g').data(tasks).join('g').attr('transform',d=>`translate(${x(d.x)},${y(d.y)})`).attr('opacity',.72);
    tasksG.append('rect').attr('x',-52).attr('y',-17).attr('width',104).attr('height',34).attr('rx',17)
      .attr('fill',d=>taskColors[d.mode]).attr('fill-opacity',.12).attr('stroke',d=>taskColors[d.mode]).attr('stroke-width',1.4);
    tasksG.append('text').attr('text-anchor','middle').attr('dominant-baseline','central').attr('fill',c.text).attr('font-size',14).attr('font-weight',650).text(d=>d.name);
    tasksG.transition().duration(520).delay((d,i)=>i*55).attr('opacity',1);

    const frontierData=[{x:34,y:0},{x:45,y:32},{x:60,y:62},{x:82,y:100}];
    const frontierLine=d3.line().x(d=>x(d.x)).y(d=>y(d.y)).curve(d3.curveCatmullRom.alpha(.7));
    const frontier=svg.append('path').datum(frontierData).attr('d',frontierLine).attr('fill','none').attr('stroke',c.accent).attr('stroke-width',2.2).attr('stroke-dasharray','7 7').attr('stroke-opacity',.58);
    const frontierLength=frontier.node().getTotalLength();
    frontier.attr('stroke-dasharray',`${frontierLength} ${frontierLength}`).attr('stroke-dashoffset',frontierLength)
      .transition().duration(950).attr('stroke-dashoffset',0).transition().attr('stroke-dasharray','7 7');
    svg.append('text').attr('x',x(57)).attr('y',y(58)-12).attr('fill',c.accent).attr('font-size',12).attr('font-weight',700).attr('paint-order','stroke').attr('stroke',c.bg).attr('stroke-width',5).text('授权边界');
    svg.append('text').attr('x',(m.l+1100-m.r)/2).attr('y',371).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',15).text('机器能否独立验证 →');
    svg.append('text').attr('transform','rotate(-90)').attr('x',-(m.t+380-m.b)/2).attr('y',24).attr('text-anchor','middle').attr('fill',c.muted).attr('font-size',15).text('失败影响 →');
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

  const renderers={factors,evolution,modelExpansion,rustackHistory,kineticHistory,compatibility,system,kineticArchitecture,powerTrace,knowledgeGraph,memoryLoop,imaginationLoop,convergence,flywheel,lifecycle,teamTopology,futureCompass,delegationMap,productLoop};
  window.renderD3Chart = el => { const fn=renderers[el.dataset.chart]; if(fn && window.d3) fn(el); };
  window.renderChartsInSlide = slide => slide?.querySelectorAll('[data-chart]').forEach(window.renderD3Chart);
})();
