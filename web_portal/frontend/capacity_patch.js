// capacity_patch.js
// Patch mínimo (NÃO mexe nos cálculos/JSON):
// - Ao abrir, aplica a última versão do BT_ONE_HISTORY (ou capacity_state) depois que o JSON montar as linhas
// - Suporta variações de estrutura (data aninhado) para evitar abrir "cru"

(function(){
  const HISTORY_KEY = 'BT_ONE_HISTORY';
  const APPLY_FLAG = '__btone_capacity_applied__';

  function readStore(){
    try{ return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); }
    catch(e){ return {}; }
  }

  function normalizeEntry(entry){
    if(!entry) return null;
    // casos possíveis:
    // 1) { data: state }
    // 2) { data: { data: state } } (duplo aninhamento)
    // 3) state direto (sem wrapper)
    let payload = entry.data !== undefined ? entry.data : entry;
    if(payload && payload.data && (payload.diasUteis !== undefined || payload.atividades || payload.perdas)){
      // payload já é state
      return payload;
    }
    if(payload && payload.data && (payload.data.diasUteis !== undefined || payload.data.atividades || payload.data.perdas)){
      return payload.data;
    }
    return payload || null;
  }

  function latestCapacity(){
    const s = readStore();
    const arr = s['Capacity'] || [];
    return arr.length ? arr[arr.length-1] : null;
  }

  function restoreCandidate(){
    const last = latestCapacity();
    const state = normalizeEntry(last);
    if(state){
      try{ localStorage.setItem('capacity_state', JSON.stringify(state)); }catch(e){}
      return state;
    }
    try{
      const raw = localStorage.getItem('capacity_state');
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }

  function applyState(s){
    if(!s) return;
    try{
      // base
      const ref = document.getElementById('refPeriod');
      if(ref && s.ref_period) ref.value = s.ref_period;

      const dias = document.getElementById('diasUteis');
      if(dias && s.diasUteis !== undefined) dias.value = s.diasUteis;

      const horas = document.getElementById('horasDia');
      if(horas && s.horasDia !== undefined) horas.value = s.horasDia;

      const fteAtual = document.getElementById('fteAtual');
      if(fteAtual && s.fteAtual !== undefined) fteAtual.value = s.fteAtual;

      // perdas
      if(s.perdas){
        document.querySelectorAll('.perda').forEach(p=>{
          const k = p.dataset.key;
          if(k && (k in s.perdas)) p.value = s.perdas[k];
        });
      }

      // atividades (Item 5)
      if(Array.isArray(s.atividades)){
        const map = new Map(s.atividades.map(a=>[(String(a.atividade || '').trim()), a]));
        document.querySelectorAll('#atividadesTable tbody tr').forEach(tr=>{
          const name = (tr.querySelector('td input')?.value || '').trim();
          const found = map.get(name);
          if(found){
            const tempo = tr.querySelector('.tempo');
            const vol = tr.querySelector('.vol');
            if(tempo) tempo.value = found.tempo ?? '';
            if(vol) vol.value = found.vol ?? '';
          }
        });
      }

      // outras (Item 6)
      if(Array.isArray(s.outras)){
        const mapO = new Map(s.outras.map(o=>[(String(o.nome || '').trim()), o]));
        document.querySelectorAll('#outrasTable tbody tr').forEach(tr=>{
          const nome = (tr.children[0]?.innerText || '').trim();
          const found = mapO.get(nome);
          if(found){
            const t = tr.querySelector('.outra-tempo');
            const v = tr.querySelector('.outra-vol');
            const r = tr.querySelector('.outra-rec');
            if(t) t.value = found.tempo ?? '';
            if(v) v.value = found.vol ?? '';
            if(r) r.value = found.rec ?? '';
          }
        });
      }

      // margens
      if(s.margens){
        const mt = document.getElementById('margemTrein');
        const ma = document.getElementById('margemAfast');
        const mf = document.getElementById('margemFerias');
        if(mt && s.margens.trein !== undefined) mt.value = s.margens.trein;
        if(ma && s.margens.afast !== undefined) ma.value = s.margens.afast;
        if(mf && s.margens.ferias !== undefined) mf.value = s.margens.ferias;
      }

      // recalcular (sem alterar lógica original)
      if(typeof window.recalcularBase === 'function') window.recalcularBase();
      if(typeof window.recalcularOutrasAtividades === 'function') window.recalcularOutrasAtividades();
      if(typeof window.recalcularConsolidado === 'function') window.recalcularConsolidado();

      window[APPLY_FLAG] = true;

    }catch(e){
      console.warn('applyState', e);
    }
  }

  // Aguarda o JSON montar as linhas do Item 5 usando MutationObserver (sem timeout fixo)
  function waitAndApply(){
    if(window[APPLY_FLAG]) return;

    const st = restoreCandidate();
    if(!st) return; // nada para aplicar

    const tbody = document.querySelector('#atividadesTable tbody');
    if(!tbody){
      // se ainda não existe, tenta novamente após DOM pronto
      requestAnimationFrame(waitAndApply);
      return;
    }

    const tryApply = ()=>{
      // se já tem linhas, aplica
      const rows = document.querySelectorAll('#atividadesTable tbody tr').length;
      if(rows > 0){
        applyState(st);
        return true;
      }
      return false;
    };

    if(tryApply()) return;

    const obs = new MutationObserver(()=>{
      if(tryApply()) obs.disconnect();
    });
    obs.observe(tbody, { childList: true });

    // fallback (8s): aplica mesmo assim
    setTimeout(()=>{
      try{ obs.disconnect(); }catch(e){}
      if(!window[APPLY_FLAG]) applyState(st);
    }, 8000);
  }

  window.addEventListener('DOMContentLoaded', waitAndApply);
})();
