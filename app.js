let map = L.map('map').setView([51.505, -0.09], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);

const resultsEl = document.getElementById('results');
const qEl = document.getElementById('q');

async function search() {
  const q = encodeURIComponent(qEl.value || '');
  const res = await fetch(`/api/poi?q=${q}`);
  const json = await res.json();
  resultsEl.innerHTML = '';
  json.results.forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.name;
    item.onclick = () => selectPOI(p);
    resultsEl.appendChild(item);
  });
}

async function selectPOI(p) {
  map.setView([p.lat, p.lon], 15);
  L.marker([p.lat, p.lon]).addTo(map);

  // Now tab
  const now = await fetch(`/api/busyness?lat=${p.lat}&lon=${p.lon}`).then(r=>r.json());
  document.querySelector('#now .big').textContent = now.score;

  // Flows
  const flows = await fetch(`/api/flows?lat=${p.lat}&lon=${p.lon}`).then(r=>r.json());
  const flowsEl = document.querySelector('#flows');
  flowsEl.innerHTML = '<h3>Top Origins</h3>' + flows.results.map(r => `<div>${r.origin}: ${r.visitors}</div>`).join('');

  // Forecast sparkline
  const fc = await fetch(`/api/forecast?lat=${p.lat}&lon=${p.lon}`).then(r=>r.json());
  drawSpark(fc.series.map(x => x.score));
}

function drawSpark(values) {
  const c = document.getElementById('spark');
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  if (!values.length) return;
  const max = Math.max(...values), min = Math.min(...values);
  const w = c.width, h = c.height, n = values.length;
  ctx.beginPath();
  values.forEach((v,i) => {
    const x = (i/(n-1))*w;
    const y = h - ((v-min)/(max-min+0.0001))*h;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0b73ff';
  ctx.stroke();
}

document.getElementById('searchBtn').onclick = search;
qEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter') search(); });

// Tabs
const tabs = { now:'now', flows:'flows', forecast:'forecast' };
function activate(tab) {
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(tabs[tab]).classList.add('active');
}
document.getElementById('tab-now').onclick = ()=>activate('now');
document.getElementById('tab-flows').onclick = ()=>activate('flows');
document.getElementById('tab-forecast').onclick = ()=>activate('forecast');

// initial search
search();