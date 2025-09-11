function slugify(s){return (s||'').toLowerCase()
 .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
 .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
fetch('content.json').then(r=>r.json()).then(data=>{
  const c=document.getElementById('feedwrap'); if(!c) return; c.innerHTML='';
  data.forEach(item=>{
    const slug=item.slug||slugify(item.title||'');
    const href=(item.url && item.url!=='#wissen') ? item.url : `details.html?slug=${slug}`;
    const card=document.createElement('div'); card.className='card reveal';
    card.dataset.title=item.title||''; card.dataset.excerpt=item.excerpt||''; card.dataset.topic=item.topic||'';
    const img=item.img?`<img src="${item.img}" alt="${item.title||''}" loading="lazy" style="width:100%;height:auto;border-radius:10px;margin-bottom:10px;">`:'';
    card.innerHTML=`${img}<h3>${item.title||''}</h3><p class="sub">${item.excerpt||''}</p><a class="btn" href="${href}">Mehr erfahren</a>`;
    c.appendChild(card);
  });
}).catch(e=>console.error('Feed Fehler:',e));
