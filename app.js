const deckSlides = window.SLIDE_CONTENT;

const stage = document.getElementById('stage');
const sectionName = document.getElementById('sectionName');
const currentPage = document.getElementById('currentPage');
const totalPages = document.getElementById('totalPages');
const progress = document.getElementById('progress');
const overview = document.getElementById('overview');
const overviewGrid = document.getElementById('overviewGrid');
const help = document.getElementById('help');
let index = Math.max(0, Math.min(deckSlides.length - 1, (parseInt(location.hash.slice(1)) || 1) - 1));
let touchStartX = 0;

const sectionColors = {
  '开场':'#59e3ff', '话题一 · Rustack':'#6b8cff', '转场':'#b9f46c',
  '话题二 · 可穿戴':'#b9f46c', '话题三 · AI 写书':'#ffad66',
  '统一方法论':'#ff79b7', '结束':'#59e3ff'
};

function renderSlides() {
  totalPages.textContent = deckSlides.length;
  deckSlides.forEach((s,i) => {
    const el = document.createElement('section');
    el.className = `slide ${s.type === 'cover' ? 'slide-cover' : ''} ${s.visual ? 'has-visual' : ''}`;
    el.dataset.index = i;
    el.innerHTML = `<div class="slide-inner"><div class="content"><span class="eyebrow">${s.kicker || s.section}</span><h2>${s.title}</h2>${s.content}</div>${s.visual ? `<div class="slide-visual" aria-hidden="true">${s.visual}</div>` : ''}</div>`;
    stage.appendChild(el);
    const card = document.createElement('button');
    card.className = 'overview-card';
    card.innerHTML = `<small>${s.section}</small><b>${s.title.replace(/<br>/g,' ').replace(/<[^>]+>/g,'')}</b><i>${String(i+1).padStart(2,'0')}</i>`;
    card.addEventListener('click',()=>{ go(i); toggleOverview(false); });
    overviewGrid.appendChild(card);
  });
  renderDots();
}

function renderDots() {
  const dotWrap = document.getElementById('topicDots');
  const sections = [['开场',0], ['Rustack',6], ['可穿戴',23], ['AI 写书',40], ['方法论',53]];
  sections.forEach(([name,target])=>{
    const b=document.createElement('button');
    b.className='topic-dot'; b.title=name;
    b.addEventListener('click',()=>go(target));
    dotWrap.appendChild(b);
  });
}

function go(next, updateHash=true) {
  next = Math.max(0, Math.min(deckSlides.length-1,next));
  const els = [...stage.children];
  els.forEach((el,i)=>{ el.classList.toggle('active',i===next); el.classList.toggle('exit-left',i<next); });
  index=next;
  const s=deckSlides[index];
  document.documentElement.style.setProperty('--accent',sectionColors[s.section] || '#59e3ff');
  sectionName.textContent=s.section;
  currentPage.textContent=String(index+1).padStart(2,'0');
  progress.style.width=`${((index+1)/deckSlides.length)*100}%`;
  [...document.querySelectorAll('.overview-card')].forEach((x,i)=>x.classList.toggle('current',i===index));
  const ranges=[0,6,23,40,53,deckSlides.length];
  const activeDot=ranges.findIndex((x,i)=>index>=x&&index<ranges[i+1]);
  [...document.querySelectorAll('.topic-dot')].forEach((x,i)=>x.classList.toggle('active',i===activeDot));
  if(updateHash) history.replaceState(null,'',`#${index+1}`);
  document.title=`${String(index+1).padStart(2,'0')} · ${s.title.replace(/<[^>]+>/g,' ')} — 把 AI 变成工程团队`;
}

function toggleOverview(show=!overview.classList.contains('open')) {
  overview.classList.toggle('open',show);
  overview.setAttribute('aria-hidden',!show);
  if(show) overview.querySelector('.current')?.scrollIntoView({block:'center'});
}
function toggleHelp(show=!help.classList.contains('open')) {
  help.classList.toggle('open',show);
  help.setAttribute('aria-hidden',!show);
}
function fullscreen(){
  if(!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

document.addEventListener('keydown', e => {
  if(e.key==='Escape'){ toggleOverview(false); toggleHelp(false); return; }
  if(overview.classList.contains('open') || help.classList.contains('open')) return;
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){ e.preventDefault(); go(index+1); }
  else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){ e.preventDefault(); go(index-1); }
  else if(e.key==='Home') go(0);
  else if(e.key==='End') go(deckSlides.length-1);
  else if(e.key.toLowerCase()==='f') fullscreen();
  else if(e.key.toLowerCase()==='o') toggleOverview();
  else if(e.key==='?') toggleHelp();
});
document.getElementById('fullscreenButton').addEventListener('click',fullscreen);
document.getElementById('overviewButton').addEventListener('click',()=>toggleOverview());
document.getElementById('closeOverview').addEventListener('click',()=>toggleOverview(false));
document.getElementById('closeHelp').addEventListener('click',()=>toggleHelp(false));
stage.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX;},{passive:true});
stage.addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-touchStartX;if(Math.abs(d)>55)go(index+(d<0?1:-1));},{passive:true});
window.addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1))||1)-1,false));

renderSlides();
go(index,false);

// 开发检查：使用 index.html?audit=1，结果写入 <html data-overflow="…">。
if (new URLSearchParams(location.search).has('audit')) {
  const issues = [...stage.children]
    .filter(el => el.scrollHeight > el.clientHeight + 2)
    .map(el => Number(el.dataset.index) + 1);
  document.documentElement.dataset.overflow = issues.length ? issues.join(',') : 'none';
}
