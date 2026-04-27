const C_RUBROS = { arquitecto:'Arquitecto', inmobiliaria:'Inmobiliaria', escribano:'Escribano', constructor:'Constructor', instalador:'Instalador', otro:'Otro' };
const C_ESTADO = { por_contactar:{label:'Por contactar',color:'#faeeda',text:'#854f0b'}, contactado:{label:'Contactado',color:'#e6f1fb',text:'#185fa5'}, en_conversacion:{label:'En conversación',color:'#e1f5ee',text:'#0f6e56'}, descartado:{label:'Descartado',color:'#fce8e8',text:'#a32d2d'} };

async function addContacto() {
  const nombre = document.getElementById('c-nombre').value.trim();
  if (!nombre) return;
  const contacto = {
    id: uid(), nombre, rubro: document.getElementById('c-rubro').value,
    zona: document.getElementById('c-zona').value.trim(),
    telefono: document.getElementById('c-telefono').value.trim(),
    email: document.getElementById('c-email').value.trim(),
    estado: document.getElementById('c-estado').value,
    notas: document.getElementById('c-notas').value.trim()
  };
  appData.contactos.unshift(contacto);
  renderContactos();
  await api(null, { action:'write', section:'contactos', data:contacto });
  toast('Contacto guardado');
  ['c-nombre','c-zona','c-telefono','c-email','c-notas'].forEach(id => document.getElementById(id).value='');
}

async function deleteContacto(id) {
  appData.contactos = appData.contactos.filter(c => c.id !== id);
  renderContactos();
  await api(null, { action:'delete', section:'contactos', id });
  toast('Eliminado');
}

async function updateContactoEstado(id, estado) {
  const c = appData.contactos.find(c => c.id === id);
  if (!c) return;
  c.estado = estado;
  renderContactos();
  await api(null, { action:'updateField', section:'contactos', id, field:'estado', value:estado });
}

function renderContactos() {
  const el = document.getElementById('contactos-list');
  if (!appData.contactos.length) { el.innerHTML='<div style="font-size:13px;color:#888;padding:1rem 0;">Todavía no hay contactos.</div>'; return; }
  const sorted = [...appData.contactos].sort((a,b) => {
    const order = ['en_conversacion','contactado','por_contactar','descartado'];
    return order.indexOf(a.estado) - order.indexOf(b.estado);
  });
  el.innerHTML = sorted.map(c => {
    const est = C_ESTADO[c.estado] || C_ESTADO.por_contactar;
    return `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div>
          <div style="font-size:14px;font-weight:500;">${c.nombre}</div>
          <div style="font-size:12px;color:#888;">${C_RUBROS[c.rubro]||c.rubro}${c.zona?' · '+c.zona:''}</div>
        </div>
        <button class="del-btn" onclick="deleteContacto('${c.id}')">eliminar</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;align-items:center;">
        ${c.telefono?`<a href="tel:${c.telefono}" style="font-size:12px;color:#185fa5;text-decoration:none;">📞 ${c.telefono}</a>`:''}
        ${c.email?`<a href="mailto:${c.email}" style="font-size:12px;color:#185fa5;text-decoration:none;">✉️ ${c.email}</a>`:''}
      </div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
        <select onchange="updateContactoEstado('${c.id}',this.value)" style="font-size:11px;padding:2px 6px;border-radius:99px;background:${est.color};color:${est.text};border:1px solid ${est.color};width:auto;">
          ${Object.entries(C_ESTADO).map(([k,v])=>`<option value="${k}" ${c.estado===k?'selected':''}>${v.label}</option>`).join('')}
        </select>
        ${c.notas?`<span style="font-size:11px;color:#888;">${c.notas}</span>`:''}
      </div>
    </div>`;
  }).join('');
}
