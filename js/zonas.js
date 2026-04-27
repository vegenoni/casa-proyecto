function buildRatingBtns() {
  const el = document.getElementById('rating-form');
  if (!el) return;
  el.innerHTML = CRITERIOS.map(c => `
    <div class="rating-row">
      <span class="rating-label">${c.label}</span>
      <div class="rating-btns">${[1,2,3,4,5].map(n=>`<button class="rating-btn${ratings[c.id]===n?' active':''}" onclick="setRating('${c.id}',${n})">${n}</button>`).join('')}</div>
    </div>`).join('');
}

function setRating(id, val) { ratings[id] = val; buildRatingBtns(); }

function renderStars(val) { return [1,2,3,4,5].map(n=>`<span style="color:${n<=val?'#ef9f27':'#ddd'};font-size:13px;">★</span>`).join(''); }

async function addZona() {
  const nombre = document.getElementById('z-nombre').value.trim();
  if (!nombre) return;
  const score = Math.round(CRITERIOS.reduce((s,c)=>s+(ratings[c.id]||0),0) / CRITERIOS.length * 10) / 10;
  const zona = {
    id:uid(), nombre, provincia:document.getElementById('z-prov').value.trim(),
    clima:ratings.clima, distancia:ratings.distancia, servicios:ratings.servicios,
    costo:ratings.costo, terrenos:ratings.terrenos, comunidad:ratings.comunidad, taller:ratings.taller,
    pros:document.getElementById('z-pros').value.trim().split('\n').filter(Boolean).join('|'),
    contras:document.getElementById('z-cons').value.trim().split('\n').filter(Boolean).join('|'),
    notas:document.getElementById('z-notas').value.trim(),
    elegida: document.getElementById('z-elegida').checked ? 'TRUE' : 'FALSE',
    score
  };
  appData.zonas.push(zona);
  renderZonas(); updateResumen();
  await api(null, { action:'write', section:'zonas', data:zona });
  toast('Zona guardada');
  ['z-nombre','z-prov','z-pros','z-cons','z-notas'].forEach(id => document.getElementById(id).value='');
  document.getElementById('z-elegida').checked=false;
  CRITERIOS.forEach(c=>ratings[c.id]=0);
  buildRatingBtns();
}

async function deleteZona(id) {
  appData.zonas = appData.zonas.filter(z=>z.id!==id);
  renderZonas(); updateResumen();
  await api(null, { action:'delete', section:'zonas', id });
  toast('Zona eliminada');
}

async function toggleElegida(id) {
  const z = appData.zonas.find(z=>z.id===id);
  if (!z) return;
  z.elegida = z.elegida==='TRUE' ? 'FALSE' : 'TRUE';
  renderZonas();
  await api(null, { action:'toggleElegida', id, elegida: z.elegida });
  toast('Actualizado');
}

function renderZonas() {
  const el = document.getElementById('zonas-list');
  if (!appData.zonas.length) { el.innerHTML='<div style="font-size:13px;color:#888;padding:1rem 0;">Todavía no hay zonas. Agregá la primera candidata arriba.</div>'; return; }
  const sorted = [...appData.zonas].sort((a,b)=>(parseFloat(b.score)||0)-(parseFloat(a.score)||0));
  el.innerHTML = sorted.map(z => {
    const elegida = z.elegida==='TRUE';
    const pros = z.pros ? z.pros.split('|').filter(Boolean) : [];
    const cons = z.contras ? z.contras.split('|').filter(Boolean) : [];
    const score = parseFloat(z.score)||0;

    const visitasZona = appData.visitas.filter(v => v.zona_id === z.id);
    const visitasHtml = visitasZona.length ? `
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f0f0f0;">
        <div style="font-size:11px;color:#888;margin-bottom:6px;">Visitas (${visitasZona.length})</div>
        ${visitasZona.slice(0,3).map(v => {
          const cat = CAT_COLORS[v.categoria] || CAT_COLORS.otra;
          return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span style="font-size:10px;padding:1px 6px;border-radius:99px;background:${cat.bg};color:${cat.color};flex-shrink:0;">${CAT_LABELS[v.categoria]||v.categoria}</span>
            <span style="font-size:12px;color:#444;">${v.nombre}</span>
            ${v.fecha?`<span style="font-size:10px;color:#aaa;margin-left:auto;">${v.fecha}</span>`:''}
          </div>`;
        }).join('')}
        ${visitasZona.length > 3 ? `<div style="font-size:11px;color:#aaa;">+ ${visitasZona.length-3} más</div>` : ''}
      </div>` : '';

    return `<div class="zona-card${elegida?' elegida':''}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div>
          <div style="font-size:15px;font-weight:500;">${z.nombre} ${elegida?'<span class="tag s-elegida">Elegida</span>':''}</div>
          <div style="font-size:12px;color:#888;">${z.provincia||''}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:20px;font-weight:500;">${score.toFixed(1)}<span style="font-size:13px;color:#888">/5</span></div>
          <div style="font-size:11px;color:#888;">puntaje</div>
        </div>
      </div>
      <div class="criterios-grid">${CRITERIOS.map(c=>`<div class="criterio-item"><span class="criterio-label">${c.label}</span><span>${renderStars(parseInt(z[c.id])||0)}</span></div>`).join('')}</div>
      ${(pros.length||cons.length)?`<div class="pros-cons"><div>${pros.map(p=>`<div class="pro">${p}</div>`).join('')}</div><div>${cons.map(c=>`<div class="con">${c}</div>`).join('')}</div></div>`:''}
      ${z.notas?`<div style="font-size:12px;color:#888;margin-top:8px;padding-top:8px;border-top:1px solid #f0f0f0;">${z.notas}</div>`:''}
      ${visitasHtml}
      ${renderPhotoGrid(z.fotos, 'zonas', z.id)}
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button class="btn btn-sm" onclick="toggleElegida('${z.id}')">${elegida?'Desmarcar':'Marcar como elegida'}</button>
        <button class="btn btn-sm" onclick="irAVisitaDeZona('${z.id}','${z.nombre}')">+ Visita</button>
        ${photoUploadBtn('zonas', z.id)}
        <button class="del-btn" onclick="deleteZona('${z.id}')">eliminar</button>
      </div>
    </div>`;
  }).join('');
  updateVisitZonaSelects();
}
