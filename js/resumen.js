function updateResumen() {
  const totalItems = etapas.reduce((s,e)=>s+e.items.length,0);
  const doneItems = etapas.reduce((s,e)=>s+e.items.filter(i=>getCheck(e.etapa_id,i.item_id)).length,0);
  document.getElementById('s-zonas').textContent = appData.zonas.length;
  document.getElementById('s-entries').textContent = appData.journal.length;
  document.getElementById('s-tasks').textContent = totalItems ? Math.round((doneItems/totalItems)*100)+'%' : '0%';
  document.getElementById('s-decisions').textContent = appData.decisiones.length;

  const progEl = document.getElementById('phase-progress');
  if (progEl) progEl.innerHTML = etapas.map(e=>{
    const t=e.items.length; const d=e.items.filter(i=>getCheck(e.etapa_id,i.item_id)).length;
    const pct=t?Math.round((d/t)*100):0;
    return `<div class="phase-row"><div class="phase-name">${e.etapa_nombre}</div><div class="phase-pct">${pct}%</div><div style="flex:2;"><div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div></div></div>`;
  }).join('');

  const topEl = document.getElementById('top-zona');
  if (appData.zonas.length) {
    const top=[...appData.zonas].sort((a,b)=>(parseFloat(b.score)||0)-(parseFloat(a.score)||0))[0];
    topEl.innerHTML=`<span style="font-size:15px;font-weight:500;">${top.nombre}</span>${top.provincia?` <span style="color:#888;">· ${top.provincia}</span>`:''} <span style="color:#888;margin-left:8px;">${parseFloat(top.score).toFixed(1)}/5</span>`;
  } else topEl.textContent='Todavía no hay zonas cargadas.';

  const lastEl=document.getElementById('last-entry');
  if (appData.journal.length) {
    const e=appData.journal[0]; const tc=TAG_COLORS[e.etiqueta]||TAG_COLORS.general;
    lastEl.innerHTML=`<span class="tag" style="background:${tc.bg};color:${tc.color};display:inline-block;margin-bottom:6px;">${e.etiqueta}</span><br><span style="font-size:13px;">${e.texto.slice(0,200)}${e.texto.length>200?'…':''}</span>`;
  } else lastEl.textContent='Todavía no hay entradas.';
}
