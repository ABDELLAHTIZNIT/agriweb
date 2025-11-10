// Suivi irrigation - stockage & structure
const LS_FARMS = 'ab_farms';
const LS_STRUCT = 'ab_struct';        // {secteurs:[], parcelles:[], points:[]}
const LS_SUIVI  = 'ab_suivi_irrig';   // []

function si_loadFarms(){
  try { return JSON.parse(localStorage.getItem(LS_FARMS)) || []; }
  catch { return []; }
}

function si_loadStruct(){
  try {
    const d = JSON.parse(localStorage.getItem(LS_STRUCT)) || {};
    return {
      secteurs:  d.secteurs  || [],
      parcelles: d.parcelles || [],
      points:    d.points    || []
    };
  } catch {
    return {secteurs:[], parcelles:[], points:[]};
  }
}

function si_saveStruct(s){
  localStorage.setItem(LS_STRUCT, JSON.stringify(s));
}

function si_loadRows(){
  try { return JSON.parse(localStorage.getItem(LS_SUIVI)) || []; }
  catch { return []; }
}

function si_saveRows(rows){
  localStorage.setItem(LS_SUIVI, JSON.stringify(rows));
}

/* ====== ربط مع عناصر الصفحة ====== */
const sfFerme    = document.getElementById('suivi-ferme');
const sfSecteur  = document.getElementById('suivi-secteur');
const sfBloc     = document.getElementById('suivi-bloc');
const sfParcelle = document.getElementById('suivi-parcelle');
const sfPoint    = document.getElementById('suivi-point');

const sfFormWrap  = document.getElementById('suivi-form-wrap');
const sfFormTitle = document.getElementById('suivi-form-title');
const sfRowsBody  = document.getElementById('suivi-rows');

const btnAdd      = document.getElementById('suivi-add-btn');
const btnCancel   = document.getElementById('suivi-cancel');
const btnSave     = document.getElementById('suivi-save');
const btnShare    = document.getElementById('suivi-share-btn');
const btnXls      = document.getElementById('suivi-export-xls-btn');
const btnPdf      = document.getElementById('suivi-export-pdf-btn');

if(sfFerme && sfSecteur && sfBloc && sfParcelle && sfPoint){

  let struct = si_loadStruct();
  let rows   = si_loadRows();
  let editId = null;

  function opt(list, placeholder){
    const base = placeholder ? `<option value="">${placeholder}</option>` : '';
    return base + list.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
  }

  function escapeHtml(str){
    return String(str||'').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'
    }[m]||m));
  }

  function fillFerme(){
    const farms = si_loadFarms().map(f=>f.name);
    sfFerme.innerHTML = opt(farms,'Ferme');
    sfSecteur.innerHTML  = opt([],'Secteur');
    sfBloc.innerHTML     = opt([],'Bloc');
    sfParcelle.innerHTML = opt([],'Parcelle');
    sfPoint.innerHTML    = opt([],'Point');
  }

  function fillSecteur(){
    const ferme = sfFerme.value;
    const secteurs = struct.secteurs
      .filter(s=>s.ferme===ferme)
      .map(s=>s.name);
    sfSecteur.innerHTML  = opt(secteurs,'Secteur');
    sfBloc.innerHTML     = opt([],'Bloc');
    sfParcelle.innerHTML = opt([],'Parcelle');
    sfPoint.innerHTML    = opt([],'Point');
  }

  function fillBloc(){
    const ferme   = sfFerme.value;
    const secteur = sfSecteur.value;
    const blocs = struct.parcelles
      .filter(p=>p.ferme===ferme && p.secteur===secteur)
      .map(p=>p.bloc)
      .filter((v,i,a)=>v && a.indexOf(v)===i);
    sfBloc.innerHTML     = opt(blocs,'Bloc');
    sfParcelle.innerHTML = opt([],'Parcelle');
    sfPoint.innerHTML    = opt([],'Point');
  }

  function fillParcelle(){
    const ferme   = sfFerme.value;
    const secteur = sfSecteur.value;
    const bloc    = sfBloc.value;
    const parcelles = struct.parcelles
      .filter(p=>p.ferme===ferme && p.secteur===secteur && (!bloc || p.bloc===bloc))
      .map(p=>p.name);
    sfParcelle.innerHTML = opt(parcelles,'Parcelle');
    sfPoint.innerHTML    = opt([],'Point');
  }

  function fillPoint(){
    const ferme    = sfFerme.value;
    const secteur  = sfSecteur.value;
    const bloc     = sfBloc.value;
    const parcelle = sfParcelle.value;
    const points = struct.points
      .filter(pt =>
        pt.ferme===ferme &&
        pt.secteur===secteur &&
        (!bloc || pt.bloc===bloc) &&
        (!parcelle || pt.parcelle===parcelle)
      )
      .map(pt=>pt.name);
    sfPoint.innerHTML = opt(points,'Point');
  }

  sfFerme.addEventListener('change', fillSecteur);
  sfSecteur.addEventListener('change', fillBloc);
  sfBloc.addEventListener('change', fillParcelle);
  sfParcelle.addEventListener('change', fillPoint);

  /* ====== فورم إضافة / تعديل ====== */

  function openForm(isEdit, row){
    sfFormTitle.textContent = isEdit ? 'Modifier la mesure' : 'Nouvelle mesure';
    sfFormWrap.classList.remove('hidden');

    const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.value = val||''; };

    if(row){
      set('sf-tours',    row.tours);
      set('sf-duree',    row.duree);
      set('sf-repos',    row.repos);
      set('sf-vapport',  row.vApport);
      set('sf-ecapport', row.ecApport);
      set('sf-phapport', row.phApport);
      set('sf-vdrain',   row.vDrain);
      set('sf-ecdrain',  row.ecDrain);
      set('sf-phdrain',  row.phDrain);
      set('sf-pctdrain', row.pctDrain);
      set('sf-cons',     row.cons);
    } else {
      ['sf-tours','sf-duree','sf-repos','sf-vapport','sf-ecapport','sf-phapport',
       'sf-vdrain','sf-ecdrain','sf-phdrain','sf-pctdrain','sf-cons']
       .forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    }
  }

  function closeForm(){
    sfFormWrap.classList.add('hidden');
    editId = null;
  }

  function collectForm(){
    const get = id => (document.getElementById(id)?.value || '').trim();
    const ferme    = sfFerme.value;
    const secteur  = sfSecteur.value;
    const bloc     = sfBloc.value;
    const parcelle = sfParcelle.value;
    const point    = sfPoint.value;

    if(!ferme || !secteur || !parcelle || !point){
      showToast('المرجو اختيار Ferme / Secteur / Parcelle / Point قبل الحفظ.');
      return null;
    }

    return {
      id: editId || Date.now(),
      ferme, secteur, bloc, parcelle, point,
      tours:     get('sf-tours'),
      duree:     get('sf-duree'),
      repos:     get('sf-repos'),
      vApport:   get('sf-vapport'),
      ecApport:  get('sf-ecapport'),
      phApport:  get('sf-phapport'),
      vDrain:    get('sf-vdrain'),
      ecDrain:   get('sf-ecdrain'),
      phDrain:   get('sf-phdrain'),
      pctDrain:  get('sf-pctdrain'),
      cons:      get('sf-cons')
    };
  }

  function renderRows(){
    if(!sfRowsBody) return;
    if(!rows.length){
      sfRowsBody.innerHTML = `<tr><td colspan="17" style="padding:8px;color:#9ca3af">لا توجد قياسات بعد.</td></tr>`;
      return;
    }
    sfRowsBody.innerHTML = rows.map(r=>`
      <tr data-id="${r.id}">
        <td>${escapeHtml(r.ferme)}</td>
        <td>${escapeHtml(r.secteur)}</td>
        <td>${escapeHtml(r.bloc||'')}</td>
        <td>${escapeHtml(r.parcelle)}</td>
        <td>${escapeHtml(r.point)}</td>
        <td>${escapeHtml(r.tours)}</td>
        <td>${escapeHtml(r.duree)}</td>
        <td>${escapeHtml(r.repos)}</td>
        <td>${escapeHtml(r.vApport)}</td>
        <td>${escapeHtml(r.ecApport)}</td>
        <td>${escapeHtml(r.phApport)}</td>
        <td>${escapeHtml(r.vDrain)}</td>
        <td>${escapeHtml(r.ecDrain)}</td>
        <td>${escapeHtml(r.phDrain)}</td>
        <td>${escapeHtml(r.pctDrain)}</td>
        <td>${escapeHtml(r.cons)}</td>
        <td>
          <button class="btn icon" data-act="edit">✏️</button>
          <button class="btn danger icon" data-act="del">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  // توست بسيط داخل الصفحة
  function showToast(msg){
    let box = document.getElementById('toast-box');
    if(!box){
      box = document.createElement('div');
      box.id='toast-box';
      box.style.position='fixed';
      box.style.left='50%';
      box.style.bottom='18px';
      box.style.transform='translateX(-50%)';
      box.style.background='#111827ee';
      box.style.color='#e5e7eb';
      box.style.padding='8px 14px';
      box.style.borderRadius='10px';
      box.style.fontSize='12px';
      box.style.boxShadow='0 6px 18px rgba(0,0,0,.5)';
      box.style.zIndex='9999';
      document.body.appendChild(box);
    }
    box.textContent = msg;
    box.style.opacity='1';
    setTimeout(()=>{ box.style.opacity='0'; }, 2200);
  }

  // أحداث
  if(btnAdd) btnAdd.onclick = ()=>{ editId=null; openForm(false,null); };
  if(btnCancel) btnCancel.onclick = ()=>closeForm();
  if(btnSave) btnSave.onclick = ()=>{
    const data = collectForm();
    if(!data) return;
    if(editId){
      rows = rows.map(r=>r.id===editId?data:r);
    } else {
      rows.push(data);
    }
    si_saveRows(rows);
    renderRows();
    closeForm();
    showToast('تم الحفظ ✅');
  };

  if(sfRowsBody){
    sfRowsBody.onclick = (e)=>{
      const btn = e.target.closest('button[data-act]');
      if(!btn) return;
      const tr = btn.closest('tr[data-id]');
      if(!tr) return;
      const id = Number(tr.getAttribute('data-id'));
      const row = rows.find(r=>r.id===id);
      if(!row) return;

      if(btn.dataset.act==='edit'){
        editId = id;
        // حدد الاختيارات حسب السطر
        sfFerme.value    = row.ferme;
        fillSecteur();
        sfSecteur.value  = row.secteur;
        fillBloc();
        sfBloc.value     = row.bloc || '';
        fillParcelle();
        sfParcelle.value = row.parcelle;
        fillPoint();
        sfPoint.value    = row.point;
        openForm(true,row);
      }
      if(btn.dataset.act==='del'){
        if(confirm('حذف هذا السطر؟')){
          rows = rows.filter(r=>r.id!==id);
          si_saveRows(rows);
          renderRows();
        }
      }
    };
  }

  if(btnShare) btnShare.onclick = ()=>{
    if(!rows.length){ showToast('لا توجد بيانات للمشاركة.'); return; }
    const txt = rows.map(r=>
      `${r.ferme} - ${r.secteur} - ${r.parcelle} - ${r.point} | T:${r.tours} | D:${r.duree} | Vap:${r.vApport} | EC:${r.ecApport}`
    ).join('\n');
    if(navigator.share){
      navigator.share({text:txt}).catch(()=>{});
    } else {
      navigator.clipboard && navigator.clipboard.writeText(txt).then(()=>{
        showToast('تم نسخ البيانات، يمكنك لصقها في WhatsApp أو Gmail.');
      }).catch(()=>{
        alert(txt);
      });
    }
  };

  if(btnXls) btnXls.onclick = ()=>{
    if(!rows.length){ showToast('لا توجد بيانات.'); return; }
    const header = ['Ferme','Secteur','Bloc','Parcelle','Point','Tours/Heures','Durée(min)','Temps repos','V apport','EC apport','pH apport','V drainage','EC drainage','pH drainage','% drainage','Cons./bras'];
    const csv = [header.join(';')].concat(
      rows.map(r=>[
        r.ferme,r.secteur,r.bloc||'',r.parcelle,r.point,r.tours,r.duree,r.repos,
        r.vApport,r.ecApport,r.phApport,r.vDrain,r.ecDrain,r.phDrain,r.pctDrain,r.cons
      ].map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(';'))
    ).join('\r\n');

    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suivi_irrigation.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if(btnPdf) btnPdf.onclick = ()=>{
    if(!rows.length){ showToast('لا توجد بيانات.'); return; }
    // طريقة بسيطة: فتح نافذة للطباعة (PDF)
    const w = window.open('','_blank');
    if(!w){ showToast('المتصفح منع النافذة المنبثقة.'); return; }
    const tableHtml = `
      <html><head><meta charset="utf-8"><title>Suivi irrigation</title>
      <style>
        body{font-family:system-ui,Arial,sans-serif;font-size:10px;padding:10px;}
        table{border-collapse:collapse;width:100%}
        th,td{border:1px solid #000;padding:2px 4px}
        th{background:#eee}
      </style></head><body>
      <h3>Suivi irrigation</h3>
      ${document.querySelector('.suivi-table').outerHTML}
      </body></html>`;
    w.document.write(tableHtml);
    w.document.close();
    w.focus();
    w.print();
  };

  // INIT
  fillFerme();
  renderRows();
}

/* ====== ملاحظات على Référentiel (إدارة الهيكل) ======
   - البنية الهرمية تُخزن في LS_STRUCT:
     secteurs:  [{name, ferme}]
     parcelles: [{name, ferme, secteur, bloc}]
     points:    [{name, ferme, secteur, parcelle, bloc, name}]
   - يمكنك لاحقاً ربط أزرار في صفحة Référentiels لاستعمال
     دوال تضيف لهذه المصفوفات ثم si_saveStruct(struct).
   - بهذا الشكل، Suivi irrigation يقرأ نفس المعطيات.
*/
