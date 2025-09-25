window.SLB = window.SLB || {};

SLB.fetchJSON = async (u)=>{ try{ const r=await fetch(u,{cache:'no-store'}); if(!r.ok) throw 0; return await r.json(); }catch{ return null; } };

SLB.index = { news:[], listings:[], law:[], faq:[] };

SLB.loadIndex = async ()=>{
  const [news, listings, law] = await Promise.all([
    SLB.fetchJSON('data/news.json'), SLB.fetchJSON('data/listings.json'), SLB.fetchJSON('data/law.json')
  ]);
  SLB.index.news = Array.isArray(news)?news:[];
  SLB.index.listings = Array.isArray(listings)?listings:[];
  SLB.index.law = Array.isArray(law)?law:[];
  // FAQ aus Seite einsammeln (falls vorhanden)
  const FAQ = window.FAQ || [];
  SLB.index.faq = Array.isArray(FAQ)?FAQ.map(x=>({title:x.q, text:x.a})):[];
};

SLB.search = (q)=>{
  q=(q||'').trim().toLowerCase();
  if(!q) return [];
  const res = [];

  // NEWS
  SLB.index.news.forEach(n=>{
    const hay=((n.title||'')+' '+(n.summary||'')).toLowerCase();
    if(hay.includes(q)) res.push({type:'News', title:n.title, url:n.link||'#', date:n.date||''});
  });

  // LISTINGS / ANGEBOTE
  SLB.index.listings.forEach(l=>{
    const hay=((l.title||'')+' '+(l.location||'')+' '+(l.category||'')).toLowerCase();
    if(hay.includes(q)) res.push({type:'Angebot', title:l.title, url:l.page||'#', meta:l.location||l.category||''});
  });

  // LAW
  SLB.index.law.forEach(x=>{
    const hay=((x.paragraph||'')+' '+(x.explanation||'')).toLowerCase();
    if(hay.includes(q)) res.push({type:'§ Recht', title:x.paragraph, text:x.explanation});
  });

  // FAQ
  SLB.index.faq.forEach(f=>{
    const hay=((f.title||'')+' '+(f.text||'')).toLowerCase();
    if(hay.includes(q)) res.push({type:'FAQ', title:f.title, text:f.text});
  });

  return res.slice(0,30);
};

window.searchSite = async function(){
  const input = document.querySelector('#newsQuery, #searchAll');
  if(!input) return;
  if(!SLB.index.news.length && !SLB.index.listings.length) { await SLB.loadIndex(); }
  const q = input.value;
  const hits = SLB.search(q);
  const out = document.getElementById('searchResult') || (()=>{
    const box=document.createElement('div'); box.id='searchResult';
    (document.querySelector('#news')||document.body).appendChild(box); return box;
  })();

  out.innerHTML = hits.length ? 
    '<ul class="list-unstyled">'+hits.map(h=>{
      if(h.url) return `<li><span class="badge bg-light text-dark">${h.type}</span> <a href="${h.url}" target="_blank" rel="noopener">${h.title}</a> <span class="text-muted small">${h.meta||''}</span></li>`;
      return `<li><span class="badge bg-light text-dark">${h.type}</span> <strong>${h.title||''}</strong> – ${h.text||''}</li>`;
    }).join('')+'</ul>'
    : '<div class="small text-muted">Keine Treffer.</div>';
};
document.addEventListener('keydown',e=>{
  if(e.ctrlKey && e.key.toLowerCase()==='k'){ e.preventDefault(); const el=document.querySelector('#newsQuery, #searchAll'); if(el){ el.focus(); el.select(); } }
});
