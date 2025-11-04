// login page logic
(function(){
  // seed admin if empty (for first-time testing)
  try {
    const ops = AbStorage.get('ab_operators') || [];
    if(!ops || ops.length === 0){
      AbStorage.set('ab_operators', [AppConfig.seedAdmin]);
      console.log('Seeded admin user (username: admin / password: 20202020)');
    }
  } catch(e){}

  // DOM helpers
  function el(id){ return document.getElementById(id); }
  window.togglePass = function(){
    const i = el('p'); if(!i) return; i.type = i.type === 'password' ? 'text' : 'password';
  };

  function openRecovery(){ el('recoveryModal').classList.remove('hidden'); }
  window.openRecovery = openRecovery;
  window.closeRecovery = function(){ el('recoveryModal').classList.add('hidden'); };

  function loadOps(){ return AbStorage.get('ab_operators') || []; }

  // login flow
  window.loginFlow = function(){
    const ops = loadOps();
    const u = (el('u').value || '').trim();
    const p = (el('p').value || '').trim();

    const setupOn = AbStorage.getRaw('ab_setup') === '1';
    if(ops.length === 0 && !setupOn){
      alert('لا يمكن الدخول لأن لا يوجد مستخدم. افتح Paramètres أو استعمل Setup (no login).');
      return;
    }
    if(!u || !p){ alert('أدخل اسم المستخدم وكلمة المرور.'); return; }

    const found = ops.find(x => (String(x.username||'').trim().toLowerCase() === u.toLowerCase() && String(x.password||'') === p));
    if(!found){ alert('اسم المستخدم أو كلمة المرور غير صحيحة.'); return; }

    // success => go to main
    window.location.href = 'main.html';
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    const loginBtn = el('loginBtn'), setupBtn = el('setupBtn'), forgot = el('forgotLink');
    loginBtn?.addEventListener('click', (e)=>{ e.preventDefault(); loginFlow(); });
    setupBtn?.addEventListener('click', (e)=>{ e.preventDefault(); AbStorage.setRaw('ab_setup','1'); window.location.href = 'main.html'; });
    forgot?.addEventListener('click', (e)=>{ e.preventDefault(); openRecovery(); });
  });

})();
