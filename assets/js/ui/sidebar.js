// ===== Sidebar / Hamburger controller (ui/sidebar.js) =====
(function () {
  function $(id) { return document.getElementById(id); }

  const sidebar = $('sidebar');
  const overlay = $('overlay');

  // نوفر الدوال عالمياً في حالة مستعملة في HTML
  window.openMenu = function () {
    if (!sidebar) return;
    sidebar.classList.add('active');
    sidebar.classList.add('open');
    if (overlay) {
      overlay.classList.add('active');
      overlay.style.pointerEvents = 'auto';
    }
  };

  window.closeMenu = function () {
    if (!sidebar) return;
    sidebar.classList.remove('active');
    sidebar.classList.remove('open');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.pointerEvents = 'none';
    }
  };

  window.toggleMenu = function () {
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('active') || sidebar.classList.contains('open');
    isOpen ? window.closeMenu() : window.openMenu();
  };

  document.addEventListener('DOMContentLoaded', () => {
    // نلقط أي زر محتمل للهامبورغر
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

    if (overlay) overlay.addEventListener('click', window.closeMenu);

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
