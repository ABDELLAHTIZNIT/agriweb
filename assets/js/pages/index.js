// ===== LOGIN PAGE SCRIPT =====
(function(){
  function el(id){ return document.getElementById(id); }

  // Seed user (if empty)
  try {
    const ops = JSON.parse(localStorage.getItem('ab_operators') || '[]');
    if(ops.length === 0){
      const admin = { username:'admin', password:'20202020', profile:'Admin' };
      localStorage.setItem('ab_operators', JSON.stringify([admin]));
      console.log('Utilisateur seedé : admin / 20202020');
    }
  } catch(e){ console.error(e); }

  // Toggle password visibility
  window.togglePass = function(){
    const i = el('p');
    if(!i) return;
    i.type = (i.type === 'password') ? 'text' : 'password';
  };

  // Fonction principale de login
  function loginFlow(){
    const users = JSON.parse(localStorage.getItem('ab_operators') || '[]');
    const u = (el('u').value || '').trim().toLowerCase();
    const p = (el('p').value || '').trim();

    if(!u || !p){
      alert('⚠️ أدخل اسم المستخدم وكلمة المرور');
      return;
    }

    const found = users.find(x =>
      x.username.toLowerCase() === u && x.password === p
    );

    if(found){
      console.log('Connexion réussie pour', found.username);
      window.location.href = 'main.html';
    } else {
      alert('❌ معلومات الدخول غير صحيحة');
    }
  }

  // Buttons + events
  document.addEventListener('DOMContentLoaded', ()=>{
    const loginBtn = el('loginBtn');
    const setupBtn = el('setupBtn');
    const forgot = el('forgotLink');

    // Login normal
    loginBtn?.addEventListener('click', e=>{
      e.preventDefault();
      loginFlow();
    });

    // Mode setup (sans mot de passe)
    setupBtn?.addEventListener('click', e=>{
      e.preventDefault();
      localStorage.setItem('ab_setup','1');
      window.location.href = 'main.html';
    });

    // Mot de passe oublié
    forgot?.addEventListener('click', e=>{
      e.preventDefault();
      alert('🔑 هذه الخاصية سيتم تفعيلها لاحقاً');
    });
  });
})();
// index page logic placeholder
