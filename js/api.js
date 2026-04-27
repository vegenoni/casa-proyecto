function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

async function api(params, body) {
  try {
    if (body) {
      const res = await fetch(SCRIPT_URL, { method:'POST', body: JSON.stringify(body) });
      return await res.json();
    } else {
      const res = await fetch(SCRIPT_URL + '?' + new URLSearchParams(params));
      return await res.json();
    }
  } catch(e) { toast('Error de conexión'); return null; }
}

async function loadAll() {
  const data = await api({ action:'readAll' });
  if (!data) return;
  appData = { ...appData, ...data };

  if (data.checklist_structure && data.checklist_structure.length > 0) {
    buildEtapasFromSheet(data.checklist_structure);
  } else {
    etapas = JSON.parse(JSON.stringify(DEFAULT_CHECKLISTS));
    await pushStructureToSheet();
  }

  checkStates = {};
  (data.checklist || []).forEach(r => {
    checkStates[`${r.etapa_id}__${r.item_id}`] = r.completado === 'TRUE';
  });

  renderAll();
}

function buildEtapasFromSheet(rows) {
  const etapaMap = {};
  rows.forEach(r => {
    if (!etapaMap[r.etapa_id]) {
      etapaMap[r.etapa_id] = {
        etapa_id: r.etapa_id,
        etapa_nombre: r.etapa_nombre,
        etapa_orden: parseInt(r.etapa_orden) || 0,
        items: []
      };
    }
    if (r.item_id) {
      etapaMap[r.etapa_id].items.push({
        item_id: r.item_id,
        item_texto: r.item_texto,
        item_orden: parseInt(r.item_orden) || 0
      });
    }
  });
  etapas = Object.values(etapaMap).sort((a,b) => a.etapa_orden - b.etapa_orden);
  etapas.forEach(e => e.items.sort((a,b) => a.item_orden - b.item_orden));
}

async function pushStructureToSheet() {
  const rows = [];
  etapas.forEach(e => {
    e.items.forEach(item => {
      rows.push({
        etapa_id: e.etapa_id,
        etapa_nombre: e.etapa_nombre,
        etapa_orden: e.etapa_orden,
        item_id: item.item_id,
        item_texto: item.item_texto,
        item_orden: item.item_orden
      });
    });
    if (!e.items.length) {
      rows.push({ etapa_id:e.etapa_id, etapa_nombre:e.etapa_nombre, etapa_orden:e.etapa_orden, item_id:'', item_texto:'', item_orden:'' });
    }
  });
  await api(null, { action:'saveChecklistStructure', data:rows });
}

function renderAll() {
  renderEntries();
  renderZonas();
  renderVisits();
  renderChecklist();
  renderPresupuesto();
  renderContactos();
  renderTerrenos();
  updateResumen();
  updateVisitZonaSelects();
  updateTerrenoZonaSelect();
}
