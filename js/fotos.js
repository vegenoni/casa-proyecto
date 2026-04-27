function openLightbox(url) {
  document.getElementById('lightbox-img').src = url;
  document.getElementById('photo-lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('photo-lightbox').classList.remove('open');
  document.getElementById('lightbox-img').src = '';
}

function renderPhotoGrid(fotos, section, id) {
  const urls = fotos ? String(fotos).split('|').filter(Boolean) : [];
  if (!urls.length) return '';
  const thumbs = urls.map(url => `
    <div class="photo-thumb" onclick="openLightbox('${url}')">
      <img src="${url}" alt="foto" loading="lazy">
      <button class="photo-del" onclick="event.stopPropagation();deletePhoto('${section}','${id}','${url}')">✕</button>
    </div>`).join('');
  return `<div class="photo-grid">${thumbs}</div>`;
}

function photoUploadBtn(section, id) {
  return `<label class="photo-upload-btn">
    <input type="file" accept="image/*" multiple style="display:none" onchange="handlePhotoUpload(event,'${section}','${id}')">
    <span style="font-size:15px;">📷</span> Agregar foto
  </label>`;
}

async function handlePhotoUpload(event, section, id) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  for (const file of files) {
    toast('Subiendo...');
    const base64 = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result.split(',')[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
    const result = await api(null, { action:'uploadPhoto', section, id, filename:file.name, mimeType:file.type, data:base64 });
    if (result && result.url) {
      if (section === 'zonas') {
        const z = appData.zonas.find(z => z.id === id);
        if (z) z.fotos = z.fotos ? z.fotos + '|' + result.url : result.url;
        renderZonas();
      } else if (section === 'journal') {
        const e = appData.journal.find(e => e.id === id);
        if (e) e.fotos = e.fotos ? e.fotos + '|' + result.url : result.url;
        renderEntries();
      } else if (section === 'terrenos') {
        const t = appData.terrenos.find(t => t.id === id);
        if (t) t.fotos = t.fotos ? t.fotos + '|' + result.url : result.url;
        renderTerrenos();
      }
      toast('✓ Foto subida');
    } else {
      toast('Error al subir foto');
    }
  }
  event.target.value = '';
}

async function deletePhoto(section, id, photoUrl) {
  if (section === 'zonas') {
    const z = appData.zonas.find(z => z.id === id);
    if (z) z.fotos = (z.fotos||'').split('|').filter(u => u && u !== photoUrl).join('|');
    renderZonas();
  } else if (section === 'journal') {
    const e = appData.journal.find(e => e.id === id);
    if (e) e.fotos = (e.fotos||'').split('|').filter(u => u && u !== photoUrl).join('|');
    renderEntries();
  } else if (section === 'terrenos') {
    const t = appData.terrenos.find(t => t.id === id);
    if (t) t.fotos = (t.fotos||'').split('|').filter(u => u && u !== photoUrl).join('|');
    renderTerrenos();
  }
  await api(null, { action:'deletePhoto', section, id, photoUrl });
  toast('Foto eliminada');
}
