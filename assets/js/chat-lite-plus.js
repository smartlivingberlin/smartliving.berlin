window.SLB = window.SLB || {};
const fmtDate = iso=>{ try{return new Date(iso).toLocaleDateString('de-DE')}catch{return ''} };

async function ask(){
  const box = document.getElementById('answers'); if(!box) return;
  const q = (document.getElementById('q')?.value||'').trim();
  if(!q){ box.innerHTML = '<div class="small text-muted">Bitte Frage eingeben.</div>'; return; }

  // Lade Index falls nötig (Suche wiederverwenden)
  if(!SLB.index.news?.length){ await (window.SLB?.loadIndex?.()||Promise.resolve()); }
  const hits = SLB.search(q.toLowerCase());

  // Rechner-Hinweise
  const tips = [];
  if(/miete|kauf|kaufen|rent|buy|kreditsumme|zins|annuitaet|annuität/i.test(q)) tips.push('🔢 Öffne die Rechner unter „Finanzen“: *Hypotheken-Rechner* oder *Mieten vs. Kaufen*.');
  if(/wärmepumpe|energie|strom|gas|pv|balkon/i.test(q)) tips.push('⚡ Schau in „Smart Living“: Spartipps & Gerätevergleich.');
  if(/§|bgb|weg|mietrecht|betriebskosten/i.test(q)) tips.push('⚖️ Rechtsgrundlagen findest du in „Recht & Wissen“ – mit Kurz-Erklärungen.');

  // Antwort rendern
  const blocks = [];

  // 1) Top-Treffer (max 5)
  if(hits.length){
    blocks.push('<h6 class="mb-2">Passende Treffer</h6><ul class="list-unstyled">'+
      hits.slice(0,5).map(h=>{
        if(h.url){ return `<li>• <span class="badge bg-light text-dark">${h.type}</span> <a href="${h.url}" target="_blank" rel="noopener">${h.title}</a> ${h.date?('<span class="text-muted small">· '+fmtDate(h.date)+'</span>'):''}</li>`; }
        return `<li>• <span class="badge bg-light text-dark">${h.type}</span> <strong>${h.title}</strong> — ${h.text||''}</li>`;
      }).join('')+'</ul>');
  }

  // 2) Kurze Sofort-Antwort (aus LAW/FAQ)
  const firstLaw = hits.find(h=>h.type==='§ Recht');
  const firstFAQ = hits.find(h=>h.type==='FAQ');
  if(firstLaw||firstFAQ){
    const law = firstLaw ? `<div class="mb-1"><strong>${firstLaw.title}:</strong> ${firstLaw.text||''}</div>`:'';
    const faq = firstFAQ ? `<div class="mb-1"><strong>${firstFAQ.title}:</strong> ${firstFAQ.text||''}</div>`:'';
    blocks.unshift(`<div class="alert alert-light border"><div><strong>Sofort-Antwort</strong></div>${law}${faq}</div>`);
  }

  // 3) Tipps
  if(tips.length){
    blocks.push('<div class="small text-muted">'+tips.map(t=>'• '+t).join('<br>')+'</div>');
  }

  box.innerHTML = blocks.join('') || '<div class="small text-muted">Keine passenden Einträge. Probiere andere Begriffe.</div>';
}

// Schnell-Buttons unter dem Chat (falls nicht da)
document.addEventListener('DOMContentLoaded', ()=>{
  const wrap = document.getElementById('answers');
  if(!wrap) return;
  const quick = document.createElement('div');
  quick.className = 'd-flex flex-wrap gap-2 mb-2';
  [
    '§ 535 BGB','Betriebskosten','Mieten vs. Kaufen','Hypotheken Rechner',
    'Wärmepumpe Förderung','Balkonkraftwerk','Mietspiegel Berlin','Homestaging Tipps'
  ].forEach(l=>{
    const b=document.createElement('button'); b.className='btn btn-sm btn-outline-secondary'; b.textContent=l;
    b.onclick=()=>{ const q=document.getElementById('q'); if(q){ q.value=l; ask(); } };
    quick.appendChild(b);
  });
  wrap.parentElement?.insertBefore(quick, wrap);
});
