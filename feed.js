async function loadFeed(topic="alle"){
  const wrap=document.getElementById('feed'); if(!wrap) return;
  try{
    const res=await fetch('./content.json?'+Date.now()); // Cache-Buster
    const items=await res.json();
    const data = topic==="alle" ? items : items.filter(i=>i.topic===topic);
    wrap.innerHTML = data.map(i=>`
      <div class="card">
        <img src="${i.img}" alt="${i.title}" style="width:100%;height:auto;border-radius:10px;margin-bottom:10px">
        <h3>${i.title}</h3>
        <a class="btn" href="${i.url}" target="${i.url.startsWith('http')?'_blank':'_self'}" rel="noopener">Öffnen</a>
      </div>`).join('');
  }catch(e){
    wrap.innerHTML='<div class="card">Feed konnte nicht geladen werden.</div>';
  }
}
document.getElementById('topicbar').addEventListener('click',e=>{
  if(e.target.dataset.topic){ loadFeed(e.target.dataset.topic); }
});
loadFeed(); // Start: Alle
