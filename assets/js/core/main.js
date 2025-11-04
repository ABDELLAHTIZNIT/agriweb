// main page behaviors (sidebar toggle + keyboard)
(function(){
  function $(sel){ return document.querySelector(sel); }
  function addClass(el, c){ if(!el) return; el.classList.remove('hidden'); el.classList.add('active'); }
  function removeClass(el, c){ if(!el) return; el.classList.remove('active'); el.classList.add('hidden'); }

  document.addEventListener('DOMContentLoaded', ()=>{
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btn = document.querySelector('.menu-btn');

    function openMenu(){ sidebar.classList.remove('hidden'); overlay.classList.remove('hidden'); }
    function closeMenu(){ sidebar.classList.add('hidden'); overlay.classList.add('hidden'); }

    btn?.addEventListener('click', ()=> {
      if(!sidebar) return;
      const isHidden = sidebar.classList.contains('hidden');
      if(isHidden) openMenu(); else closeMenu();
    });
    overlay?.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeMenu(); });
  });
})();
