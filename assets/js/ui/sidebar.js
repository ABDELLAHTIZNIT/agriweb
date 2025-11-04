// ===== Sidebar / Hamburger controller =====
(function () {
  function $(id) { return document.getElementById(id); }

  const sidebar = $('sidebar');
  const overlay = $('overlay');

  // اجعل الدوال متاحة عالمياً في حال استُخدمت في HTML (onclick="toggleMenu()")
  window.openMenu = function openMenu() {
    if (!sidebar) return;
    sidebar.classList.add('active');   // يدعم تصميمك الحالي
    sidebar.classList.add('open');     // ولو كنت كاتستعمل "open"
    if (overlay) {
      overlay.classList.add('active');
      overlay.style.pointerEvents = 'auto';
    }
  };

  window.closeMenu = function closeMenu() {
    if (!sidebar) return;
    sidebar.classList.remove('active');
    sidebar.classList.remove('open');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.pointerEvents = 'none';
    }
  };

  window.toggleMenu = function toggleMenu() {
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('active') || sidebar.classList.contains('open');
    isOpen ? window.closeMenu() : window.openMenu();
  };

  // ربط الزر والأحداث
  document.addEventListener('DOMContentLoaded', () => {
    // جرّب نلقط أي زر ممكن: id أو class
    const hambBtn =
      $('hambBtn') ||
      document.querySelector('.menu-btn') ||
      document.querySelector('.hamb') ||
      document.querySelector('[data-action="menu"]');

    if (hambBtn) {
      hambBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', window.closeMenu);
    }

    // إغلاق بـ ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeMenu();
    });

    // إغلاق عند الضغط على أي رابط داخل السايدبار
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (a) window.closeMenu();
      });
    }
  });
})();
