(function(){
  // Smooth-Scroll für interne #Anker
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]'); if(!a) return;
    const id=a.getAttribute('href'), el=document.querySelector(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); history.pushState(null,'',id); }
  });

  // Externe Links in neuem Tab
  for(const a of document.querySelectorAll('a[href^="http"]:not([href*="smartlivingberlin.github.io"])')){
    a.target='_blank'; a.rel='noopener';
  }

  // Reveal-Animation
  const io=new IntersectionObserver(es=>es.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
  }),{threshold:.15});
  document.querySelectorAll('.card,.section,.hero').forEach(el=>{el.classList.add('reveal'); io.observe(el);});

  // Suche/Filter über Karten
  const Q=document.getElementById('q'), wrap=document.getElementById('feedwrap');
  function filt(){ const q=(Q?.value||'').toLowerCase();
    wrap?.querySelectorAll('.card').forEach(c=>{
      const hay=(c.dataset.title+' '+c.dataset.excerpt+' '+c.dataset.topic).toLowerCase();
      c.style.display = hay.includes(q) ? '' : 'none';
    });
  }
  Q?.addEventListener('input',filt);

  // Chat-Helfer (falls Crisp da ist)
  window.openChat=()=>window.$crisp&&window.$crisp.push(['do','chat:open']);
  document.querySelectorAll('.btn-chat').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();window.openChat();}));
})();
