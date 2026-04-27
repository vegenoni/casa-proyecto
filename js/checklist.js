function getCheck(etapa_id, item_id) {
  return checkStates[`${etapa_id}__${item_id}`] || false;
}

async function toggleCheck(etapa_id, item_id) {
  const newVal = !getCheck(etapa_id, item_id);
  checkStates[`${etapa_id}__${item_id}`] = newVal;
  updateResumen();
  const chk = document.getElementById(`chk-${etapa_id}-${item_id}`);
  if (chk) {
    chk.checked = newVal;
    const row = chk.closest('.checklist-item');
    if (row) row.style.opacity = newVal ? '0.6' : '1';
  }
  updateEtapaCount(etapa_id);
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  if (etapa) {
    const total = etapa.items.length;
    const done = etapa.items.filter(i => getCheck(etapa_id, i.item_id)).length;
    const pct = total ? Math.round((done/total)*100) : 0;
    const etapaCard = document.getElementById(`etapa-title-${etapa_id}`)?.closest('.etapa-card');
    if (etapaCard) {
      const bar = etapaCard.querySelector('.progress-bar');
      if (bar) bar.style.width = pct + '%';
    }
  }
  await api(null, { action:'toggleCheck', etapa_id, item_id, completado: newVal ? 'TRUE' : 'FALSE' });
}

function updateEtapaCount(etapa_id) {
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  if (!etapa) return;
  const done = etapa.items.filter(i => getCheck(etapa_id, i.item_id)).length;
  const el = document.getElementById(`count-${etapa_id}`);
  if (el) el.textContent = `${done}/${etapa.items.length}`;
}

async function addEtapa() {
  const nombre = document.getElementById('new-etapa-nombre').value.trim();
  if (!nombre) return;
  const etapa = { etapa_id: uid(), etapa_nombre: nombre, etapa_orden: etapas.length + 1, items: [] };
  etapas.push(etapa);
  document.getElementById('new-etapa-nombre').value = '';
  renderChecklist();
  updateResumen();
  await pushStructureToSheet();
  toast('Etapa agregada');
}

async function deleteEtapa(etapa_id) {
  etapas = etapas.filter(e => e.etapa_id !== etapa_id);
  Object.keys(checkStates).forEach(k => { if (k.startsWith(etapa_id + '__')) delete checkStates[k]; });
  renderChecklist();
  updateResumen();
  await api(null, { action:'deleteChecklistEtapa', etapa_id });
  toast('Etapa eliminada');
}

function startEditEtapa(etapa_id) {
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  const titleEl = document.getElementById(`etapa-title-${etapa_id}`);
  titleEl.innerHTML = `<input class="etapa-title-input" id="etapa-input-${etapa_id}" value="${etapa.etapa_nombre}" onkeydown="if(event.key==='Enter')saveEditEtapa('${etapa_id}')">
    <button class="btn btn-sm" onclick="saveEditEtapa('${etapa_id}')">Guardar</button>
    <button class="btn btn-sm" onclick="renderChecklist()">Cancelar</button>`;
  setTimeout(() => { const inp = document.getElementById(`etapa-input-${etapa_id}`); if(inp) inp.focus(); }, 50);
}

async function saveEditEtapa(etapa_id) {
  const inp = document.getElementById(`etapa-input-${etapa_id}`);
  if (!inp) return;
  const nombre = inp.value.trim();
  if (!nombre) return;
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  etapa.etapa_nombre = nombre;
  renderChecklist();
  await api(null, { action:'updateEtapaNombre', etapa_id, nombre });
  toast('Etapa actualizada');
}

async function addItem(etapa_id) {
  const inp = document.getElementById(`new-item-${etapa_id}`);
  const texto = inp.value.trim();
  if (!texto) return;
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  const item = { item_id: uid(), item_texto: texto, item_orden: etapa.items.length + 1 };
  etapa.items.push(item);
  inp.value = '';
  renderChecklist();
  updateResumen();
  await pushStructureToSheet();
  toast('Ítem agregado');
}

async function deleteItem(etapa_id, item_id) {
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  etapa.items = etapa.items.filter(i => i.item_id !== item_id);
  delete checkStates[`${etapa_id}__${item_id}`];
  renderChecklist();
  updateResumen();
  await api(null, { action:'deleteChecklistItem', etapa_id, item_id });
  toast('Ítem eliminado');
}

function startEditItem(etapa_id, item_id) {
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  const item = etapa.items.find(i => i.item_id === item_id);
  const labelEl = document.getElementById(`item-label-${etapa_id}-${item_id}`);
  const actionsEl = document.getElementById(`item-actions-${etapa_id}-${item_id}`);
  labelEl.outerHTML = `<input class="item-edit-input" id="item-input-${etapa_id}-${item_id}" value="${item.item_texto}" onkeydown="if(event.key==='Enter')saveEditItem('${etapa_id}','${item_id}')">
    <div style="display:flex;gap:6px;flex-shrink:0;">
      <button class="btn btn-sm" onclick="saveEditItem('${etapa_id}','${item_id}')">Guardar</button>
      <button class="btn btn-sm" onclick="renderChecklist()">Cancelar</button>
    </div>`;
  actionsEl.style.display = 'none';
  setTimeout(() => { const inp = document.getElementById(`item-input-${etapa_id}-${item_id}`); if(inp) inp.focus(); }, 50);
}

async function saveEditItem(etapa_id, item_id) {
  const inp = document.getElementById(`item-input-${etapa_id}-${item_id}`);
  if (!inp) return;
  const texto = inp.value.trim();
  if (!texto) return;
  const etapa = etapas.find(e => e.etapa_id === etapa_id);
  const item = etapa.items.find(i => i.item_id === item_id);
  item.item_texto = texto;
  renderChecklist();
  await api(null, { action:'updateChecklistItem', etapa_id, item_id, texto });
  toast('Ítem actualizado');
}

let chkFilter = 'todas';
let collapsedEtapas = {};

function setChkFilter(filter, btn) {
  chkFilter = filter;
  document.querySelectorAll('.chk-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderChecklist();
}

function collapseAll() {
  etapas.forEach(e => collapsedEtapas[e.etapa_id] = true);
  renderChecklist();
}

function expandAll() {
  collapsedEtapas = {};
  renderChecklist();
}

function toggleEtapaCollapse(etapa_id) {
  collapsedEtapas[etapa_id] = !collapsedEtapas[etapa_id];
  renderChecklist();
}

function updateGlobalProgress() {
  const total = etapas.reduce((s, e) => s + e.items.length, 0);
  const done = etapas.reduce((s, e) => s + e.items.filter(i => getCheck(e.etapa_id, i.item_id)).length, 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const bar = document.getElementById('chk-global-bar');
  const label = document.getElementById('chk-global-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `${done} / ${total} tareas · ${pct}%`;
}

function renderChecklist() {
  const el = document.getElementById('checklist-container');
  if (!etapas.length) {
    el.innerHTML = '<div style="font-size:13px;color:#888;padding:1rem 0;">Todavía no hay etapas. Agregá la primera abajo.</div>';
    updateGlobalProgress();
    return;
  }

  el.innerHTML = etapas.map(etapa => {
    const totalItems = etapa.items.length;
    const doneItems = etapa.items.filter(i => getCheck(etapa.etapa_id, i.item_id)).length;
    const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
    const collapsed = collapsedEtapas[etapa.etapa_id];
    const allDone = doneItems === totalItems && totalItems > 0;

    const filteredItems = etapa.items.filter(item => {
      const checked = getCheck(etapa.etapa_id, item.item_id);
      if (chkFilter === 'pendientes') return !checked;
      if (chkFilter === 'completadas') return checked;
      return true;
    });

    if (chkFilter !== 'todas' && filteredItems.length === 0) return '';

    const itemsHtml = filteredItems.map(item => {
      const checked = getCheck(etapa.etapa_id, item.item_id);
      return `<div class="checklist-item" style="${checked?'opacity:0.6':''}">
        <input type="checkbox" id="chk-${etapa.etapa_id}-${item.item_id}" ${checked?'checked':''} onchange="toggleCheck('${etapa.etapa_id}','${item.item_id}')">
        <label id="item-label-${etapa.etapa_id}-${item.item_id}" for="chk-${etapa.etapa_id}-${item.item_id}">${item.item_texto}</label>
        <div class="item-actions" id="item-actions-${etapa.etapa_id}-${item.item_id}">
          <button class="edit-btn" onclick="startEditItem('${etapa.etapa_id}','${item.item_id}')">editar</button>
          <button class="del-btn" onclick="deleteItem('${etapa.etapa_id}','${item.item_id}')">eliminar</button>
        </div>
      </div>`;
    }).join('');

    return `<div class="etapa-card" style="${allDone?'opacity:0.75':''}">
      <div class="etapa-header" style="cursor:pointer;" onclick="toggleEtapaCollapse('${etapa.etapa_id}')">
        <div class="etapa-title-wrap" id="etapa-title-${etapa.etapa_id}">
          <span style="font-size:13px;transition:transform 0.2s;display:inline-block;margin-right:4px;">${collapsed?'▶':'▼'}</span>
          <span class="etapa-title" style="${allDone?'text-decoration:line-through;color:#aaa':''}">${etapa.etapa_nombre}</span>
          ${allDone?'<span style="font-size:11px;color:#1d9e75;margin-left:6px;">✓ Completa</span>':''}
          <button class="edit-btn" onclick="event.stopPropagation();startEditEtapa('${etapa.etapa_id}')">editar</button>
        </div>
        <div class="etapa-actions" onclick="event.stopPropagation()">
          <span class="etapa-count" id="count-${etapa.etapa_id}">${doneItems}/${totalItems}</span>
          <button class="del-btn" onclick="deleteEtapa('${etapa.etapa_id}')">eliminar</button>
        </div>
      </div>
      <div style="margin-top:6px;margin-bottom:${collapsed?'0':'8px'};">
        <div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
      </div>
      ${collapsed ? '' : `
        ${itemsHtml}
        <div class="add-item-row">
          <input type="text" id="new-item-${etapa.etapa_id}" placeholder="Nuevo ítem..." onkeydown="if(event.key==='Enter')addItem('${etapa.etapa_id}')">
          <button class="btn btn-primary btn-sm" onclick="addItem('${etapa.etapa_id}')">Agregar</button>
        </div>
      `}
    </div>`;
  }).join('');

  updateResumen();
}
