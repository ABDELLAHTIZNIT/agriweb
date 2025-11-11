// Suivi Irrigation

const LS_IRR = 'ab_irrig_measures';

function svLoadAll(){
  try{return JSON.parse(localStorage.getItem(LS_IRR)||'[]')}catch{return[]}
}
function svSaveAll(a){
  localStorage.setItem(LS_IRR,JSON.stringify(a||[]));
}

/* تعبئة select من référentiel */

function svFillFarm(){
  const fermeSel = document.getElementById('sv-ferme');
  if(!fermeSel) return;
  const farms = rfLoadFarms();
  fermeSel.innerHTML = '<option value="">-- اختر Ferme --</option>' +
    farms.map(f=>`<option value="${escapeHtml(f.name)}">${escapeHtml(f.name)}</option>`).join('');
  svOnFermeChange();
}

function svOnFermeChange(){
  const ferme = document.getElementById('sv-ferme').value;
  const secSel = document.getElementById('sv-secteur');
  const secs = rfLoadSecteurs().filter(s=>s.ferme===ferme);
  secSel.innerHTML = '<option value="">-- اختر Secteur --</option>' +
    secs.map(s=>`<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('');
  svOnSecteurChange();
}

function svOnSecteurChange(){
  const ferme = document.getElementById('sv-ferme').value;
  const secteur = document.getElementById('sv-secteur').value;
  const parSel = document.getElementById('sv-parcelle');
  const all = rfLoadParcelles().filter(p=>p.ferme===ferme && p.secteur===secteur);
  parSel.innerHTML = '<option value="">-- اختر Parcelle --</option>' +
    all.map(p=>`<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');
  svOnParcelleChange();
}

function svOnParcelleChange(){
  const ferme = document.getElementById('sv-ferme').value;
  const secteur = document.getElementById('sv-secteur').value;
  const parcelle = document.getElementById('sv-parcelle').value;
  const ptSel = document.getElementById('sv-point');
  const pts = rfLoadPoints().filter(pt=>pt.ferme===ferme && pt.secteur===secteur && pt.parcelle===parcelle);
  ptSel.innerHTML = '<option value="">-- اختر Point --</option>' +
    pts.map(p=>`<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');
}

/* Context */

function svGetContext(){
  const ferme = (document.getElementById('sv-ferme')||{}).value || '';
  const secteur = (document.getElementById('sv-secteur')||{}).value || '';
  const parcelle = (document.getElementById('sv-parcelle')||{}).value || '';
  const point = (document.getElementById('sv-point')||{}).value || '';
  if(!ferme || !secteur || !parcelle || !point) return null;
  return {ferme,secteur,parcelle,point};
}

/* Ajouter mesure */

function svOpenAdd(){
  if(!svGetContext()){ alert('اختر Ferme / Secteur / Parcelle / Point أولا'); return; }
  document.getElementById('sv-add-modal').classList.add('show');
}
function svCloseAdd(){
  document.getElementById('sv-add-modal').classList.remove('show');
}

function svSaveAdd(){
  const ctx = svGetContext();
  if(!ctx){ alert('اختر Ferme / Secteur / Parcelle / Point أولا'); return; }

  const m = {
    id: Date.now(),
    ferme: ctx.ferme,
    secteur: ctx.secteur,
    parcelle: ctx.parcelle,
    point: ctx.point,
    tours: (g('sv-tours').value||'').trim(),
    duree: (g('sv-duree').value||'').trim(),
    repos: (g('sv-repos').value||'').trim(),
    vApport: (g('sv-vapport').value||'').trim(),
    ecApport: (g('sv-ecapport').value||'').trim(),
    phApport: (g('sv-phapport').value||'').trim(),
    vDrain: (g('sv-vdrain').value||'').trim(),
    ecDrain: (g('sv-ecdrain').value||'').trim(),
    phDrain: (g('sv-phdrain').value||'').trim(),
    pctDrain: (g('sv-pctdrain').value||'').trim()
  };

  if(!m.tours && !m.duree){
    alert('على الأقل عَمِّر Tours/Heures أو Durée.');
    return;
  }

  const all = svLoadAll();
  all.push(m);
  svSaveAll(all);

  ['sv-tours','sv-duree','sv-repos','sv-vapport','sv-ecapport','sv-phapport',
   'sv-vdrain','sv-ecdrain','sv-phdrain','sv-pctdrain'].forEach(id=>{if(g(id))g(id).value='';});

  svCloseAdd();
  alert('تم حفظ القياس ✅');
}

/* Tableau */

function svOpenTable(){
  const ctx = svGetContext();
  if(!ctx){ alert('اختر Ferme / Secteur / Parcelle / Point أولا'); return; }
  document.getElementById('sv-table-title').textContent =
    `${ctx.ferme} / ${ctx.secteur} / ${ctx.parcelle} / ${ctx.point}`;
  svRenderTable(ctx);
  document.getElementById('sv-table-modal').classList.add('show');
}
function svCloseTable(){
  document.getElementById('sv-table-modal').classList.remove('show');
}

function svRenderTable(ctx){
  const tbody = document.querySelector('#sv-table tbody');
  const all = svLoadAll().filter(m =>
    m.ferme===ctx.ferme &&
    m.secteur===ctx.secteur &&
    m.parcelle===ctx.parcelle &&
    m.point===ctx.point
  );
  if(all.length===0){
    tbody.innerHTML = `<tr><td colspan="12" class="muted">لا توجد قياسات بعد لهذا الـ Point.</td></tr>`;
    return;
  }
  tbody.innerHTML = all.map((m,i)=>`
    <tr onclick="svRowMenu(${m.id})">
      <td>${i+1}</td>
      <td>${escapeHtml(m.point)}</td>
      <td>${escapeHtml(m.tours||'')}</td>
      <td>${escapeHtml(m.duree||'')}</td>
      <td>${escapeHtml(m.repos||'')}</td>
      <td>${escapeHtml(m.vApport||'')}</td>
      <td>${escapeHtml(m.ecApport||'')}</td>
      <td>${escapeHtml(m.phApport||'')}</td>
      <td>${escapeHtml(m.vDrain||'')}</td>
      <td>${escapeHtml(m.ecDrain||'')}</td>
      <td>${escapeHtml(m.phDrain||'')}</td>
      <td>${escapeHtml(m.pctDrain||'')}</td>
    </tr>
  `).join('');
}

/* Edit/Delete via row click */

function svRowMenu(id){
  const all = svLoadAll();
  const m = all.find(x=>x.id===id);
  if(!m) return;
  const choice = prompt('1: تعديل هذا السطر\n2: حذف هذا السطر\nاختيار؟','1');
  if(choice==='2'){
    if(confirm('تأكيد الحذف؟')){
      const idx = all.findIndex(x=>x.id===id);
      if(idx>-1){all.splice(idx,1);svSaveAll(all);}
      const ctx = svGetContext(); if(ctx) svRenderTable(ctx);
    }
  }else if(choice==='1'){
    g('sv-tours').value = m.tours||'';
    g('sv-duree').value = m.duree||'';
    g('sv-repos').value = m.repos||'';
    g('sv-vapport').value = m.vApport||'';
    g('sv-ecapport').value = m.ecApport||'';
    g('sv-phapport').value = m.phApport||'';
    g('sv-vdrain').value = m.vDrain||'';
    g('sv-ecdrain').value = m.ecDrain||'';
    g('sv-phdrain').value = m.phDrain||'';
    g('sv-pctdrain').value = m.pctDrain||'';

    const oldSave = svSaveAdd;
    window.svSaveAdd = function(){
      const ctx = svGetContext();
      if(!ctx){alert('اختر Ferme / Secteur / Parcelle / Point أولا');return;}
      m.tours=v('sv-tours'); m.duree=v('sv-duree'); m.repos=v('sv-repos');
      m.vApport=v('sv-vapport'); m.ecApport=v('sv-ecapport'); m.phApport=v('sv-phapport');
      m.vDrain=v('sv-vdrain'); m.ecDrain=v('sv-ecdrain'); m.phDrain=v('sv-phdrain');
      m.pctDrain=v('sv-pctdrain');
      svSaveAll(all);
      svCloseAdd();
      alert('تم تعديل السطر ✅');
      const ctx2 = svGetContext(); if(ctx2) svRenderTable(ctx2);
      window.svSaveAdd = oldSave;
      ['sv-tours','sv-duree','sv-repos','sv-vapport','sv-ecapport','sv-phapport',
       'sv-vdrain','sv-ecdrain','sv-phdrain','sv-pctdrain'].forEach(id=>{if(g(id))g(id).value='';});
    };

    svOpenAdd();
  }
}

/* Share / Export */

function svShare(){
  const ctx = svGetContext(); if(!ctx){alert('اختر Ferme / Secteur / Parcelle / Point أولا');return;}
  const rows = svLoadAll().filter(m =>
    m.ferme===ctx.ferme && m.secteur===ctx.secteur && m.parcelle===ctx.parcelle && m.point===ctx.point
  );
  if(!rows.length){alert('لا توجد بيانات للمشاركة.');return;}
  let txt = `Irrigation ${ctx.ferme}/${ctx.secteur}/${ctx.parcelle}/${ctx.point}\n`;
  rows.forEach((m,i)=>{
    txt += `${i+1}) Tours:${m.tours} Durée:${m.duree} Vapp:${m.vApport} EC:${m.ecApport} pH:${m.phApport}\n`;
  });
  if(navigator.clipboard) navigator.clipboard.writeText(txt);
  alert('تم نسخ الملخص، الصقه في WhatsApp أو Gmail.');
}

function svExportExcel(){
  const ctx = svGetContext(); if(!ctx){alert('اختر Ferme / Secteur / Parcelle / Point أولا');return;}
  const rows = svLoadAll().filter(m =>
    m.ferme===ctx.ferme && m.secteur===ctx.secteur && m.parcelle===ctx.parcelle && m.point===ctx.point
  );
  if(!rows.length){alert('لا توجد بيانات للتصدير.');return;}
  let csv = 'Point,Tours/Heures,Durée(min),Temps repos,V apport,EC apport,pH apport,V drainage,EC drainage,pH drainage,% drainage\n';
  rows.forEach(m=>{
    const vals=[m.point,m.tours,m.duree,m.repos,m.vApport,m.ecApport,m.phApport,m.vDrain,m.ecDrain,m.phDrain,m.pctDrain]
      .map(x=>`"${(x||'').replace(/"/g,'""')}"`).join(',');
    csv += vals + '\n';
  });
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `irrigation_${Date.now()}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
}

function svExportPDF(){
  if(!document.getElementById('sv-table-modal').classList.contains('show')){
    const ctx = svGetContext(); if(!ctx){alert('اختر Ferme / Secteur / Parcelle / Point أولا');return;}
    svOpenTable();
  }
  alert('من نافذة الطباعة اختر "Save as PDF".');
  setTimeout(()=>window.print(),400);
}
