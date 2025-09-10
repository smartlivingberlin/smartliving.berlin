fetch('./content.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('feedwrap');
    container.innerHTML = '';
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}" style="width:100%;border-radius:8px;margin-bottom:10px;">
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <a href="${item.url}" class="btn">Mehr erfahren</a>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => console.error('Feed Fehler:', err));
