function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('hamburger-btn');
  menu.classList.toggle('open');
  btn.textContent = menu.classList.contains('open') ? '✕' : '☰';
}

function closeMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('hamburger-btn');
  if (menu) menu.classList.remove('open');
  if (btn) btn.textContent = '☰';
}

function showTab(id, btn) {
  document.querySelectorAll('.tab').forEach(t => {
    const oc = t.getAttribute('onclick') || '';
    if (oc.includes(`'${id}'`)) t.classList.add('active');
    else t.classList.remove('active');
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('tab-' + id);
  if (panel) panel.classList.add('active');
}
