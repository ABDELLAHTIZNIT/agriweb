// Sidebar + تنقل رئيسي
(function () {
  const $ = (id) => document.getElementById(id);
  const sidebar = $('sidebar');
  const overlay = $('overlay');
  const menuBtn = $('menuBtn');
  const closeBtn = $('closeSidebar');

  function open() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }
  function close() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  if (menuBtn) menuBtn.onclick = open;
  if (closeBtn) closeBtn.onclick = close;
  if (overlay) overlay.onclick = close;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Helper: set active link
  function setActive(el) {
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  // روابط القائمة الجانبية → إظهار الصفحات
  const pages = ['home','settings','profiles','operators','farms','refs','appcfg'];
  function show(pageName){
    pages.forEach(n=>{
      const el = document.getElementById('page-'+n);
      if (el) el.classList.add('hidden');
    });
    const tgt=document.getElementById('page-'+pageName);
    if (tgt) tgt.classList.remove('hidden');
    close();
  }

  const navHome = $('nav-home');
  const navSettings = $('nav-settings');
  const navIrrig = $('nav-irrig');
  const navTrait = $('nav-trait');
  const navLogout = $('logout');

  if (navHome) navHome.onclick = (e)=>{ e.preventDefault(); setActive(navHome); show('home'); };
  if (navSettings) navSettings.onclick = (e)=>{ e.preventDefault(); setActive(navSettings); show('settings'); };
  if (navIrrig) navIrrig.onclick = (e)=>{ e.preventDefault(); setActive(navIrrig); alert('🧪 Irrigation page: قيد الإنجاز'); };
  if (navTrait) navTrait.onclick = (e)=>{ e.preventDefault(); setActive(navTrait); alert('🧪 Traitement page: قيد الإنجاز'); };
  if (navLogout) navLogout.onclick = (e)=>{ e.preventDefault(); location = 'index.html'; };

  // فتح تايلز Paramètres
  const go = (tileId, page)=> {
    const el = document.getElementById(tileId);
    if (!el) return;
    el.onclick = ()=>{ setActive(navSettings); show(page); };
  };
  go('open-operators','operators');
  go('open-profiles','profiles');
  go('open-refs','refs');
  go('open-rights','settings'); // صفحة حقوق الوصول لاحقا
  go('open-pass','settings');   // تغيير كلمة السر لاحقا
  go('open-appcfg','appcfg');

  // بانر Setup
  const banner = document.getElementById('setupBanner');
  const setupOn = localStorage.getItem('ab_setup')==='1';
  if (banner && setupOn) banner.classList.remove('hidden');

  const btnDisableSetup = document.getElementById('btnDisableSetup');
  const btnGoSettings = document.getElementById('btnGoSettings');
  if (btnDisableSetup) btnDisableSetup.onclick = ()=>{
    localStorage.removeItem('ab_setup');
    alert('تم تعطيل Setup Mode');
    location.reload();
  };
  if (btnGoSettings) btnGoSettings.onclick = ()=>{
    setActive(navSettings); show('appcfg');
  };
})();
