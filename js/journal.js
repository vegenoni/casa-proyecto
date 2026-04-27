async function addEntry() {
  const text = document.getElementById('j-text').value.trim();
  if (!text) return;
  const entry = {
    id: uid(),
    fecha: new Date().toISOString(),
    etiqueta: document.getElementById('j-tag').value,
    autor: document.getElementById('j-autor').value,
    texto: text
  };
  appData.journal.unshift(entry);
  renderEntries(); updateResumen();
  await api(null, { action:'write', section:'journal', data:entry });
  toast('Entrada guardada');
  document.getElementById('j-text').value='';
}

async function deleteEntry(id) {
  appData.journal = appData.journal.filter(e=>e.id!==id);
  renderEntries(); updateResumen();
  await api(null, { action:'delete', section:'journal', id });
  toast('Eliminada');
}

function renderEntries() {
  const el = document.getElementById('entries-list');
  if (!appData.journal.length) { el.innerHTML='<div style="font-size:13px;color:#888;padding:1rem 0;">Todavía no hay entradas.</div>'; return; }
  el.innerHTML = appData.journal.map(e => {
    const tc = TAG_COLORS[e.etiqueta]||TAG_COLORS.general;
    const fecha = new Date(e.fecha);
    const fechaStr = fecha.toLocaleDateString('es-AR',{weekday:'short', day:'2-digit',month:'long',year:'numeric'});
    const horaStr = fecha.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    const autorColor = e.autor === 'Ve' ? '#5a8e20' : e.autor === 'Juanma' ? '#185fa5' : '#7a5c2e';
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
          <span class="tag" style="background:${tc.bg};color:${tc.color}">${e.etiqueta}</span>
          ${e.autor ? `<span style="font-size:11px;padding:2px 8px;border-radius:99px;background:${autorColor}18;color:${autorColor};">${e.autor}</span>` : ''}
        </div>
        <button class="del-btn" onclick="deleteEntry('${e.id}')">eliminar</button>
      </div>
      <div style="font-size:11px;color:#aaa;margin-bottom:6px;">${fechaStr} · ${horaStr}</div>
      <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${e.texto}</div>
      ${renderPhotoGrid(e.fotos, 'journal', e.id)}
      <div style="margin-top:8px;">${photoUploadBtn('journal', e.id)}</div>
    </div>`;
  }).join('');
}
