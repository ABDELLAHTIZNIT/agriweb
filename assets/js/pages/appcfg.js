/* Réglages de l’application: حفظ/تحميل الـBranding والليبلز/الأمان */
const LS_APP='ab_appcfg', LS_IMG='ab_appimg', LS_SEC='ab_security';

(function(){
  const $ = (id)=>document.getElementById(id);
  const byId = $;

  // صيغ ملف → DataURL
  async function fileToDataURL(input){
    return new Promise((resolve)=> {
      if (!input || !input.files || !input.files[0]) return resolve(null);
      const f = input.files[0];
      const reader = new FileReader();
      reader.onload = e => resolve(String(e.target.result||''));
      reader.readAsDataURL(f);
    });
  }

  function loadJSON(key, fallback){ try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
  function saveJSON(key, obj){ localStorage.setItem(key, JSON.stringify(obj)); }

  // تطبيق الـBranding على الواجهة (الهيدر + السايدبار)
  function applyBranding(){
    const imgs = loadJSON(LS_IMG, {});
    // Badge أعلى اليمين
    const badgeImg = byId('appBadgeImg');
    if (badgeImg){
      if (imgs.badge) { badgeImg.src = imgs.badge; badgeImg.classList.remove('hidden'); }
      else { badgeImg.classList.add('hidden'); }
    }
    // صورة داخل السايدبار
    const sWrap = byId('sidebarBrand');
    const sImg  = byId('sidebarBrandImg');
    if (sWrap && sImg){
      if (imgs.sidebar) { sImg.src = imgs.sidebar; sWrap.classList.remove('hidden'); }
      else { sWrap.classList.add('hidden'); }
    }
  }

  // تهيئة الحقول بقيم مخزنة
  function hydrateForm(){
    const app = loadJSON(LS_APP, {});
    const imgs = loadJSON(LS_IMG, {});
    const sec = loadJSON(LS_SEC, {});
    // Libellés nav
    setVal('cfg-nav-home', app.nav_home);
    setVal('cfg-nav-irrig', app.nav_irrig);
    setVal('cfg-nav-trait', app.nav_trait);
    setVal('cfg-nav-settings', app.nav_settings);
    setVal('cfg-nav-logout', app.nav_logout);
    // Tiles
    setVal('cfg-tile-operators', app.tile_operators);
    setVal('cfg-tile-profiles', app.tile_profiles);
    setVal('cfg-tile-refs', app.tile_refs);
    setVal('cfg-tile-rights', app.tile_rights);
    setVal('cfg-tile-pass', app.tile_pass);
    // Security
    setVal('sec-email', sec.email);
    setVal('sec-phone', sec.phone);
    setVal('sec-question', sec.question);
    // صور (نبيّن فقط كـURL إن كانت محفوظة Base64)
    setVal('cfg-logo-url', imgs.logo || '');
    setVal('cfg-badge-url', imgs.badge || '');
    setVal('cfg-side-url', imgs.sidebar || '');
    setVal('cfg-login-url', imgs.login || '');
    setVal('cfg-loginbg-url', imgs.loginBg || '');
  }
  function setVal(id,v){ const el=byId(id); if(el && v!=null) el.value=v; }

  // حفظ الإعدادات
  async function saveAll(){
    const app = loadJSON(LS_APP, {});
    const imgs = loadJSON(LS_IMG, {});
    const sec = loadJSON(LS_SEC, {});

    // Libellés nav
    app.nav_home = val('cfg-nav-home','Accueil');
    app.nav_irrig = val('cfg-nav-irrig','Irrigation');
    app.nav_trait = val('cfg-nav-trait','Traitement');
    app.nav_settings = val('cfg-nav-settings','Paramètres');
    app.nav_logout = val('cfg-nav-logout','Logout');

    // Tiles
    app.tile_operators = val('cfg-tile-operators','OPÉRATEUR');
    app.tile_profiles  = val('cfg-tile-profiles','PROFILE');
    app.tile_refs      = val('cfg-tile-refs','RÉFÉRENTIELS');
    app.tile_rights    = val('cfg-tile-rights','DROITS ACCÈS');
    app.tile_pass      = val('cfg-tile-pass','MOT DE PASSE');

    // Security
    sec.email    = val('sec-email','');
    sec.phone    = val('sec-phone','');
    sec.question = val('sec-question','');
    // جواب سري → Hash بسيط
    const ans = val('sec-answer','').trim().toLowerCase();
    if (ans) sec.answerHash = hashLite(ans);
    // كود استرجاع
    const genField = document.getElementById('sec-code');
    if (genField && genField.dataset.newcode) sec.recoveryCode = genField.dataset.newcode;

    // Images: نفضّل الملف على URL، وإن ماكانش ملف نحتفظ بالـURL
    imgs.logo    = (await fileToDataURL(byId('cfg-logo-file')))    || val('cfg-logo-url','');
    imgs.badge   = (await fileToDataURL(byId('cfg-badge-file')))   || val('cfg-badge-url','');
    imgs.sidebar = (await fileToDataURL(byId('cfg-side-file')))    || val('cfg-side-url','');
    imgs.login   = (await fileToDataURL(byId('cfg-login-file')))   || val('cfg-login-url','');
    imgs.loginBg = (await fileToDataURL(byId('cfg-loginbg-file'))) || val('cfg-loginbg-url','');

    saveJSON(LS_APP, app);
    saveJSON(LS_IMG, imgs);
    saveJSON(LS_SEC, sec);

    applyBranding();
    alert('تم الحفظ ✅');
  }
  function val(id, fallback){ const el=byId(id); return el? (el.value||fallback) : fallback; }

  // زر Reset
  function resetAll(){
    localStorage.removeItem(LS_APP);
    localStorage.removeItem(LS_IMG);
    hydrateForm();
    applyBranding();
    alert('رجّعت الإعدادات الإفتراضية.');
  }

  // توليد كود استرجاع
  function genCode(){
    const code = String(Math.floor(100000 + Math.random()*900000));
    const input = byId('sec-code');
    if (input){
      input.removeAttribute('disabled');
      input.value = code;
      input.setAttribute('disabled','disabled');
      input.dataset.newcode = code;
    }
  }

  // Hash بسيط
  function hashLite(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0}return String(h)}

  // Accordion بسيط
  function wireAccordion(){
    document.querySelectorAll('.acc-hd').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const acc = btn.parentElement;
        acc.classList.toggle('open');
      });
    });
  }

  // ربط الأزرار
  function wireButtons(){
    const saveBtn = byId('appcfgSaveBtn');
    const resetBtn = byId('appcfgResetBtn');
    const genBtn = byId('secGen');
    if (saveBtn) saveBtn.onclick = saveAll;
    if (resetBtn) resetBtn.onclick = resetAll;
    if (genBtn) genBtn.onclick = genCode;
  }

  // تحميل أولي
  document.addEventListener('DOMContentLoaded', ()=>{
    hydrateForm();
    applyBranding();
    wireAccordion();
    wireButtons();
  });
})();
