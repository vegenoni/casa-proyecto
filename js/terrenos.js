const T_ESTADO = { visto_online:{label:'Visto online',color:'#faeeda',text:'#854f0b'}, visitado:{label:'Visitado',color:'#e6f1fb',text:'#185fa5'}, interesante:{label:'Muy interesante',color:'#e1f5ee',text:'#0f6e56'}, descartado:{label:'Descartado',color:'#fce8e8',text:'#a32d2d'} };

function updateTerrenoZonaSelect() {
  const sel = document.getElementById('t-zona');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Sin zona asociada —</option>' +
    appData.zonas.map(z => `<option value="${z.id}">${z.nombre}${z.provincia?' · '+z.provincia:''}</option>`).join('');
}

async function addTerreno() {
  const nombre = document.getElementById('t-nombre').value.trim();
  if (!nombre) return;
  const zonaEl = document.getElementById('t-zona');
  const zonaId = zonaEl.value;
  const zonaNombre = zonaId ? zonaEl.options[zonaEl.selectedIndex].text.split(' · ')[0] : '';
  const terreno = {
    id: uid(), nombre, zona_id: zonaId, zona_nombre: zonaNombre,
    precio: document.getElementById('t-precio').value || '0',
    moneda: document.getElementById('t-moneda').value,
    superficie: document.getElementById('t-superficie').value || '',
    servicios: document.getElementById('t-servicios').value.trim(),
    pros: document.getElementById('t-pros').value.trim().split('\n').filter(Boolean).join('|'),
    contras: document.getElementById('t-contras').value.trim().split('\n').filter(Boolean).join('|'),
    notas: document.getElementById('t-notas').value.trim(),
    estado: document.getElementById('t-estado').value,
    fotos: ''
  };
  appData.terrenos.unshift(terreno);
  renderTerrenos();
  await api(null, { action:'write', section:'terrenos', data:terreno });
  toast('Terreno guardado');
  ['t-nombre','t-precio','t-superficie','t-servicios','t-pros','t-contras','t-notas'].forEach(id => document.getElementById(id).value='');
}

async function deleteTerreno(id) {
  appData.terrenos = appData.terrenos.filter(t => t.id !== id);
  renderTerrenos();
  await api(null, { action:'delete', section:'terrenos', id });
  toast('Eliminado');
}

function renderTerrenos() {
  const el = document.getElementById('terrenos-list');
  if (!appData.terrenos.length) { el.innerHTML='<div style="font-size:13px;color:#888;padding:1rem 0;">Todavía no hay terrenos cargados.</div>'; return; }
  el.innerHTML = appData.terrenos.map(t => {
    const est = T_ESTADO[t.estado] || T_ESTADO.visto_online;
    const pros = t.pros ? t.pros.split('|').filter(Boolean) : [];
    const cons = t.contras ? t.contras.split('|').filter(Boolean) : [];
    const precioStr = t.precio && t.precio !== '0' ? `${t.moneda} ${parseFloat(t.precio).toLocaleString('es-AR')}` : '';
    const m2Str = t.superficie ? `${parseFloat(t.superficie).toLocaleString('es-AR')} m²` : '';
    const precioM2 = t.precio && t.precio !== '0' && t.superficie ?
      `${t.moneda} ${Math.round(parseFloat(t.precio)/parseFloat(t.superficie)).toLocaleString('es-AR')}/m²` : '';
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:500;margin-bottom:2px;">${t.nombre}</div>
          ${t.zona_nombre?`<div style="font-size:12px;color:#888;">${t.zona_nombre}</div>`:''}
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:12px;">
          ${precioStr?`<div style="font-size:16px;font-weight:500;">${precioStr}</div>`:''}
          ${m2Str||precioM2?`<div style="font-size:11px;color:#aaa;">${[m2Str,precioM2].filter(Boolean).join(' · ')}</div>`:''}
        </div>
      </div>
      ${t.servicios?`<div style="font-size:12px;color:#666;margin-bottom:8px;">⚡ ${t.servicios}</div>`:''}
      ${(pros.length||cons.length)?`<div class="pros-cons" style="margin-bottom:8px;">
        <div>${pros.map(p=>`<div class="pro">${p}</div>`).join('')}</div>
        <div>${cons.map(c=>`<div class="con">${c}</div>`).join('')}</div>
      </div>`:''}
      ${t.notas?`<div style="font-size:12px;color:#888;margin-bottom:8px;">${t.notas}</div>`:''}
      ${renderPhotoGrid(t.fotos, 'terrenos', t.id)}
      <div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap;">
        <span style="font-size:11px;padding:2px 8px;border-radius:99px;background:${est.color};color:${est.text}">${est.label}</span>
        ${photoUploadBtn('terrenos', t.id)}
        <button class="del-btn" style="margin-left:auto;" onclick="deleteTerreno('${t.id}')">eliminar</button>
      </div>
    </div>`;
  }).join('');
}
