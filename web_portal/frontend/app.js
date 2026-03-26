// app.js (BT ONE)
// Mantém compatibilidade: função getJSON simples
// + Auto-carrega capacity_patch.js SOMENTE na página capacity.html

const API = ""; // mesmo domínio do FastAPI (http://localhost:8000)

function getJSON(endpoint) {
  return fetch(`/${endpoint}`, { cache: 'no-store' }).then(res => res.json());
}

function __btone__ensureScript(src) {
  try {
    // já carregado?
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  } catch (e) {
    console.warn('BT ONE ensureScript failed', e);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  try {
    const p = (location.pathname || '').toLowerCase();
    // Só injeta o patch do Capacity se estiver na página do Capacity
    if (p.endsWith('/capacity.html') || p.endsWith('capacity.html')) {
      __btone__ensureScript('/static/capacity_patch.js');
    }
  } catch (e) {
    console.warn('BT ONE boot failed', e);
  }
});
