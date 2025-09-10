fetch('./content.json')
  .then(r => r.json())
  .then(items => {
    const c = document.getElementById('feedwrap'); c.innerHTML='';
    items.forEach(it => {
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `
        <img src="${it.img}" alt="${it.title}" style="width:100%;border-radius:8px;margin-bottom:10px;">
        <div class="meta">${it.topic || ''} • ${it.date || ''} ${it.source ? '• '+it.source : ''}</div>
        <h3>${it.title}</h3>
        <p>${it.excerpt||''}</p>
        <a href="${it.url}" class="btn" target="_blank" rel="noopener">Mehr erfahren</a>`;
      c.appendChild(el);
    });
  })
  .catch(err => console.error('Feed Fehler:', err));
