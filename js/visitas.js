const CAT_LABELS = { exploracion:'Exploración del pueblo', terreno:'Terreno específico', profesional:'Reunión con profesional', otra:'Otra' };
const CAT_COLORS = { exploracion:{bg:'#eeedfe',color:'#3c3489'}, terreno:{bg:'#e1f5ee',color:'#0f6e56'}, profesional:{bg:'#faeeda',color:'#854f0b'}, otra:{bg:'#f1efe8',color:'#5f5e5a'} };

let vistaVisitas = 'lista';

function setVistaVisitas(vista) {
  vistaVisitas = vista;
  document.getElementById('vista-lista-btn').style.background = vista==='lista' ? '#1a1108' : '';
  document.getElementById('vista-lista-btn').style.color = vista==='lista' ? '#fff' : '';
  document.getElementById('vista-lista-btn').style.borderColor = vista==='lista' ? '#1a1108' : '';
  document.getElementById('vista-cal-btn').style.background = vista==='calendario' ? '#1a1108' : '';
  document.getElementById('vista-cal-btn').style.color = vista==='calendario' ? '#fff' : '';
  document.getElementById('vista-cal-btn').style.borderColor = vista==='calendario' ? '#1a1108' : '';
  document.getElementById('visits-list').style.display = vista==='lista' ? '' : 'none';
  document.getElementById('visits-calendar').style.display = vista==='calendario' ? '' : 'none';
  renderVisits();
}

function irAVisitaDeZona(zonaId, zonaNombre) {
  const btn = document.querySelector('.tab[onclick*="visitas"]');
  if (btn) showTab('visitas', btn);
  setTimeout(() => {
    const sel = document.getElementById('v-zona');
    if (sel) sel.value = zonaId;
    const input = document.getElementById('v-nombre');
    if (input) { input.focus(); }
  }, 100);
  toast(`Registrando visita para ${zonaNombre}`);
}

function updateVisitZonaSelects() {
  const opts = '<option value="">— Sin zona asociada —</option>' +
    appData.zonas.map(z => `<option value="${z.id}">${z.nombre}${z.provincia?' · '+z.provincia:''}</option>`).join('');
  const sel = document.getElementById('v-zona');
  if (sel) sel.innerHTML = opts;

  const filtro = document.getElementById('v-filtro-zona');
  if (filtro) filtro.innerHTML = '<option value="">Todas las zonas</option>' +
    appData.zonas.map(z => `<option value="${z.id}">${z.nombre}</option>`).join('');
}

async function addVisit() {
  const nombre = document.getElementById('v-nombre').value.trim();
  if (!nombre) return;
  const zonaEl = document.getElementById('v-zona');
  const zonaId = zonaEl.value;
  const zonaNombre = zonaId ? zonaEl.options[zonaEl.selectedIndex].text.split(' · ')[0] : '';
  const visit = {
    id: uid(),
    zona_id: zonaId,
    zona_nombre: zonaNombre,
    categoria: document.getElementById('v-categoria').value,
    nombre,
    fecha: document.getElementById('v-fecha').value,
    estado: document.getElementById('v-estado').value,
    notas: document.getElementById('v-notas').value.trim()
  };
  appData.visitas.unshift(visit);
  renderVisits();
  renderZonas();
  await api(null, { action:'write', section:'visitas', data:visit });
  toast('Visita guardada');
  ['v-nombre','v-fecha','v-notas'].forEach(id => document.getElementById(id).value='');
}

async function deleteVisit(id) {
  appData.visitas = appData.visitas.filter(v=>v.id!==id);
  renderVisits(); renderZonas();
  await api(null, { action:'delete', section:'visitas', id });
  toast('Eliminada');
}

function getFilteredVisits() {
  const zonaFiltro = document.getElementById('v-filtro-zona')?.value || '';
  const catFiltro = document.getElementById('v-filtro-cat')?.value || '';
  return appData.visitas.filter(v =>
    (!zonaFiltro || v.zona_id === zonaFiltro) &&
    (!catFiltro || v.categoria === catFiltro)
  );
}

function renderVisits() {
  if (vistaVisitas === 'calendario') { renderCalendario(); return; }
  const el = document.getElementById('visits-list');
  if (!el) return;
  const filtered = getFilteredVisits();
  const labels = {interesante:'Muy interesante',descartado:'Descartado',pendiente:'Pendiente',potencial:'Potencial'};
  if (!filtered.length) { el.innerHTML='<div style="font-size:13px;color:#888;padding:1rem 0;">Todavía no hay visitas registradas.</div>'; return; }
  el.innerHTML = filtered.map(v => {
    const cat = CAT_COLORS[v.categoria] || CAT_COLORS.otra;
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;align-items:flex-start;">
        <div>
          <div style="font-size:14px;font-weight:500;margin-bottom:4px;">${v.nombre}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            <span style="font-size:11px;padding:2px 8px;border-radius:99px;background:${cat.bg};color:${cat.color}">${CAT_LABELS[v.categoria]||v.categoria}</span>
            ${v.zona_nombre?`<span style="font-size:11px;color:#888;">· ${v.zona_nombre}</span>`:''}
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
          ${v.fecha?`<span style="font-size:12px;color:#aaa;">${v.fecha}</span>`:''}
          <button class="del-btn" onclick="deleteVisit('${v.id}')">eliminar</button>
        </div>
      </div>
      ${v.notas?`<div style="font-size:13px;color:#666;margin-bottom:8px;line-height:1.5;">${v.notas}</div>`:''}
      <span class="status-badge s-${v.estado}">${labels[v.estado]||v.estado}</span>
    </div>`;
  }).join('');
}

function renderCalendario() {
  const el = document.getElementById('visits-calendar');
  if (!el) return;
  const filtered = getFilteredVisits().filter(v => v.fecha);
  if (!filtered.length) { el.innerHTML='<div style="font-size:13px;color:#888;padding:1rem 0;">No hay visitas con fecha para mostrar en el calendario.</div>'; return; }

  const byMonth = {};
  filtered.forEach(v => {
    const d = new Date(v.fecha + 'T12:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(v);
  });

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  el.innerHTML = Object.keys(byMonth).sort().map(key => {
    const [year, month] = key.split('-').map(Number);
    const visitasDelMes = byMonth[key];
    const primerDia = new Date(year, month-1, 1).getDay();
    const diasEnMes = new Date(year, month, 0).getDate();

    const visitasPorDia = {};
    visitasDelMes.forEach(v => {
      const dia = new Date(v.fecha + 'T12:00:00').getDate();
      if (!visitasPorDia[dia]) visitasPorDia[dia] = [];
      visitasPorDia[dia].push(v);
    });

    const celdas = [];
    for (let i = 0; i < primerDia; i++) celdas.push('<div></div>');
    for (let d = 1; d <= diasEnMes; d++) {
      const visitas = visitasPorDia[d] || [];
      const hasVisit = visitas.length > 0;
      const cat = hasVisit ? (CAT_COLORS[visitas[0].categoria] || CAT_COLORS.otra) : null;
      const tooltip = visitas.map(v => v.nombre).join(', ');
      celdas.push(`<div style="padding:4px;min-height:40px;border-radius:6px;background:${hasVisit?cat.bg:'transparent'};cursor:${hasVisit?'pointer':'default'};position:relative;"
        ${hasVisit?`title="${tooltip}"`:''}
        onclick="${hasVisit?`showVisitasDelDia('${key}',${d})`:''}">
        <div style="font-size:11px;font-weight:${hasVisit?'600':'400'};color:${hasVisit?cat.color:'#aaa'};">${d}</div>
        ${visitas.map(v=>`<div style="font-size:9px;color:${cat.color};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${v.nombre}</div>`).join('')}
      </div>`);
    }

    return `<div class="card" style="margin-bottom:1rem;">
      <div style="font-size:14px;font-weight:500;margin-bottom:12px;">${meses[month-1]} ${year}</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:6px;">
        ${dias.map(d=>`<div style="font-size:10px;color:#aaa;text-align:center;padding:2px;">${d}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
        ${celdas.join('')}
      </div>
    </div>`;
  }).join('');
}

function showVisitasDelDia(key, dia) {
  const [year, month] = key.split('-').map(Number);
  const fecha = `${year}-${String(month).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  const visitas = appData.visitas.filter(v => v.fecha === fecha);
  if (!visitas.length) return;
  toast(visitas.map(v => v.nombre).join(' · '));
}
