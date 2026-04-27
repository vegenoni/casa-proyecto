const RUBROS = { terreno:'Terreno', arquitecto:'Arquitecto', construccion:'Construcción', instalaciones:'Instalaciones', materiales:'Materiales', legales:'Trámites y legales', otros:'Otros' };
const RUBRO_COLORS = { terreno:'#e1f5ee', arquitecto:'#eeedfe', construccion:'#faeeda', instalaciones:'#e6f1fb', materiales:'#eaf3de', legales:'#faece7', otros:'#f1efe8' };
const RUBRO_TEXT = { terreno:'#0f6e56', arquitecto:'#3c3489', construccion:'#854f0b', instalaciones:'#185fa5', materiales:'#3b6d11', legales:'#993c1d', otros:'#5f5e5a' };
const P_ESTADO = { pendiente:{label:'Pendiente',color:'#faeeda',text:'#854f0b'}, recibida:{label:'Recibida',color:'#e6f1fb',text:'#185fa5'}, aceptada:{label:'Aceptada',color:'#e1f5ee',text:'#0f6e56'}, descartada:{label:'Descartada',color:'#fce8e8',text:'#a32d2d'} };

async function addPresupuesto() {
  const descripcion = document.getElementById('p-descripcion').value.trim();
  if (!descripcion) return;
  const item = {
    id: uid(), rubro: document.getElementById('p-rubro').value,
    descripcion, proveedor: document.getElementById('p-proveedor').value.trim(),
    monto: document.getElementById('p-monto').value || '0',
    moneda: document.getElementById('p-moneda').value,
    estado: document.getElementById('p-estado').value,
    fecha: document.getElementById('p-fecha').value,
    notas: document.getElementById('p-notas').value.trim()
  };
  appData.presupuesto.unshift(item);
  renderPresupuesto();
  await api(null, { action:'write', section:'presupuesto', data:item });
  toast('Cotización guardada');
  ['p-descripcion','p-proveedor','p-monto','p-notas','p-fecha'].forEach(id => document.getElementById(id).value='');
}

async function deletePresupuesto(id) {
  appData.presupuesto = appData.presupuesto.filter(p => p.id !== id);
  renderPresupuesto();
  await api(null, { action:'delete', section:'presupuesto', id });
  toast('Eliminado');
}

function renderPresupuesto() {
  const resEl = document.getElementById('presupuesto-resumen');
  const byRubro = {};
  let totalUSD = 0, totalARS = 0;
  appData.presupuesto.filter(p => p.estado !== 'descartada').forEach(p => {
    const monto = parseFloat(p.monto) || 0;
    if (!byRubro[p.rubro]) byRubro[p.rubro] = { USD:0, ARS:0 };
    byRubro[p.rubro][p.moneda] += monto;
    if (p.moneda === 'USD') totalUSD += monto; else totalARS += monto;
  });

  resEl.innerHTML = `<div class="card" style="margin-bottom:1rem;">
    <div class="section-title" style="margin-bottom:12px;">Resumen</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-bottom:12px;">
      ${Object.entries(byRubro).map(([rubro, montos]) => `
        <div style="background:${RUBRO_COLORS[rubro]||'#f5f5f5'};border-radius:8px;padding:8px 12px;">
          <div style="font-size:11px;color:${RUBRO_TEXT[rubro]||'#555'};margin-bottom:2px;">${RUBROS[rubro]||rubro}</div>
          ${montos.USD ? `<div style="font-size:13px;font-weight:500;">USD ${montos.USD.toLocaleString('es-AR')}</div>` : ''}
          ${montos.ARS ? `<div style="font-size:13px;font-weight:500;">ARS ${montos.ARS.toLocaleString('es-AR')}</div>` : ''}
        </div>`).join('')}
    </div>
    <div style="border-top:1px solid #e8e8e8;padding-top:10px;display:flex;gap:16px;flex-wrap:wrap;">
      ${totalUSD ? `<div><span style="font-size:12px;color:#888;">Total USD</span><div style="font-size:18px;font-weight:500;">USD ${totalUSD.toLocaleString('es-AR')}</div></div>` : ''}
      ${totalARS ? `<div><span style="font-size:12px;color:#888;">Total ARS</span><div style="font-size:18px;font-weight:500;">ARS ${totalARS.toLocaleString('es-AR')}</div></div>` : ''}
      ${!totalUSD && !totalARS ? '<div style="font-size:13px;color:#888;">Sin cotizaciones activas</div>' : ''}
    </div>
  </div>`;

  const el = document.getElementById('presupuesto-list');
  if (!appData.presupuesto.length) { el.innerHTML='<div style="font-size:13px;color:#888;padding:1rem 0;">Todavía no hay cotizaciones.</div>'; return; }

  const grupos = {};
  appData.presupuesto.forEach(p => {
    if (!grupos[p.rubro]) grupos[p.rubro] = [];
    grupos[p.rubro].push(p);
  });

  el.innerHTML = Object.entries(grupos).map(([rubro, items]) => `
    <div style="margin-bottom:1rem;">
      <div style="font-size:12px;font-weight:500;color:${RUBRO_TEXT[rubro]||'#555'};margin-bottom:8px;padding:4px 10px;background:${RUBRO_COLORS[rubro]||'#f5f5f5'};border-radius:6px;display:inline-block;">${RUBROS[rubro]||rubro}</div>
      ${items.map(p => {
        const est = P_ESTADO[p.estado] || P_ESTADO.pendiente;
        return `<div class="card" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <div>
              <div style="font-size:14px;font-weight:500;">${p.descripcion}</div>
              ${p.proveedor ? `<div style="font-size:12px;color:#888;">${p.proveedor}</div>` : ''}
            </div>
            <div style="text-align:right;flex-shrink:0;margin-left:12px;">
              ${p.monto && p.monto !== '0' ? `<div style="font-size:15px;font-weight:500;">${p.moneda} ${parseFloat(p.monto).toLocaleString('es-AR')}</div>` : ''}
              ${p.fecha ? `<div style="font-size:11px;color:#aaa;">${p.fecha}</div>` : ''}
            </div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
            <span style="font-size:11px;padding:2px 8px;border-radius:99px;background:${est.color};color:${est.text}">${est.label}</span>
            ${p.notas ? `<span style="font-size:11px;color:#888;">${p.notas}</span>` : ''}
            <button class="del-btn" style="margin-left:auto;" onclick="deletePresupuesto('${p.id}')">eliminar</button>
          </div>
        </div>`;
      }).join('')}
    </div>`).join('');
}
