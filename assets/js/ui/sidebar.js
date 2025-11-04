/* ========== Sidebar toggle + nav wiring ========== */
(function(){
  const $ = sel => document.querySelector(sel);
  const sidebar = $('.sidebar');
  const overlay = $('.overlay');
  const btnHamb = $('.hamb');

  function openSide(){
    if(!sidebar) return;
    sidebar.classList.add('open');
    if(overlay){ overlay.classList.add('show'); }
  }
  function closeSide(){
    if(!sidebar) return;
    sidebar.classList.remove('open');
    if(overlay){ overlay.classList.remove('show'); }
  }
  function toggleSide(){
    if(!sidebar) return;
    sidebar.classList.contains('open') ? closeSide() : openSide();
  }

  // Bind
  if(btnHamb){ btnHamb.addEventListener('click', toggleSide); }
  if(overlay){ overlay.addEventListener('click', closeSide); }
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeSide(); });

  // Close when clicking any nav link
  document.querySelectorAll('.sidebar a').forEach(a=>{
    a.addEventListener('click', e=>{
      // allow your router to handle later; we just close UI
      closeSide();
    });
  });

  // Expose for other scripts if needed
  window.ABUI = Object.assign(window.ABUI||{}, { openSide, closeSide, toggleSide });
})();
