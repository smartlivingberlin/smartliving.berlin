(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // externe Links in neuem Tab
  $$('a[href^="http"]').forEach(a=>{
    try{const u=new URL(a.href); if(u.hostname!==location.hostname){a.target='_blank';a.rel='noopener'}}catch(_){}
  });

  // smooth scroll für interne Anker
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]'); if(!a) return;
    const id=a.getAttribute('href').slice(1), el=document.getElementById(id); if(!el) return;
    e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); history.pushState(null,'','#'+id);
  });

  // Chat helper
  window.openChat = ()=> window.$crisp && window.$crisp.push(['do','chat:open']);

  // Reveal animation
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting){en.target.classList.add('reveal-in'); io.unobserve(en.target)} }),{rootMargin:'0px 0px -10% 0px'})
    : null;

  // Slugify (de)
  function slugify(s){
    return String(s||'').trim().toLowerCase()
      .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }

  // INDEX: Karten + Suche
  const feed = document.getElementById('feedwrap');
  if(feed){
    fetch('content.json').then(r=>r.json()).then(data=>{
      const q = document.getElementById('q');
      const render = list=>{
        feed.innerHTML='';
        list.forEach(item=>{
          const slug = slugify(item.slug || item.title);
          const card = document.createElement('div'); card.className='card reveal';
          card.innerHTML = `
            <img src="${item.img}" alt="${item.title}" loading="lazy">
            <h3>${item.title}</h3>
            <p class="excerpt">${item.excerpt||''}</p>
            <div class="actions"><a class="btn" href="details/?slug=${slug}">Mehr erfahren</a></div>`;
          feed.appendChild(card);
          if(io) io.observe(card);
        });
      };
      render(data);
      if(q){
        q.addEventListener('input', ()=>{
          const term=q.value.trim().toLowerCase();
          const list = !term ? data : data.filter(it => [it.title,it.excerpt,it.topic].join(' ').toLowerCase().includes(term));
          render(list);
        });
      }
    }).catch(err=>console.error('Feed Fehler:',err));
  }

  // DETAILS: Inhalt aus JSON
  const main = document.getElementById('main');
  const onDetails = /\/details\/?$|\/details\/index\.html$/.test(location.pathname);
  if(main && onDetails){
    const params = new URLSearchParams(location.search); const slug = params.get('slug');
    fetch('../content.json').then(r=>r.json()).then(items=>{
      const it = items.find(x => (x.slug||slugify(x.title))===slug);
      if(!it){ main.innerHTML='<p>Eintrag nicht gefunden.</p>'; return;}
      document.title = it.title + ' – SmartLivingBerlin';
      main.innerHTML = `
        <div class="meta"><span class="badge">${it.topic||''}</span></div>
        <h1>${it.title}</h1>
        <img src="${it.img}" alt="${it.title}" loading="lazy">
        <p class="excerpt">${it.excerpt||''}</p>
        <div class="actions">
          <a class="btn" href="../index.html#wissen">← Zurück</a>
          <a class="btn primary" href="#" id="ask">Frage stellen</a>
        </div>`;
      const ask=$('#ask'); if(ask) ask.addEventListener('click',e=>{e.preventDefault();openChat()});
    }).catch(_=> main.innerHTML='<p>Fehler beim Laden der Daten.</p>');
  }
})();
