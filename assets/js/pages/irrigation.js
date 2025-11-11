// Irrigation tracking (Suivi irrigation)

const LS_IRR = 'ab_irrig_measures';

function g(id){return document.getElementById(id);}
function v(id){const el=g(id);return el?el.value.trim():'';}
function escapeHtml(s){return (s||'').replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}

function svLoadAll(){
  try{return JSON.parse(localStorage.getItem(LS_IRR)||'[]')}catch{return[]}
}
function svSaveAll(a){
  localStorage.setItem(LS_IRR,JSON.stringify(a||[]));
}

/* Fill selects */

function svFillFarm(){
  const fermeSel=g('sv-ferme');
  if(!fermeSel) return;

  const farms=rfLoadFarms();
  fermeSel.innerHTML='<option value="">-- Select Farm --</option>' +
    farms.map(f=>`<option value="${escapeHtml(f.name)}">${escapeHtml(f.name)}</option>`).join('');

  svOnFermeChange();
}

function svOnFermeChange(){
  const ferme=v('sv-ferme');
  const secSel=g('sv-secteur');
  const secs=rfLoadSecteurs();

  const filtered=secs.filter(s=>s.ferme===ferme || !s.ferme); // support old data
  secSel.innerHTML='<option value="">-- Select Sector --</option>' +
    filtered.map(s=>`<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('');

  svOnSecteurChange();
}

function svOnSecteurChange(){
  const ferme=v('sv-ferme');
  const secteur=v('sv-secteur');
  const parSel=g('sv-parcelle');
  const parcs=rfLoadParcelles();

  const filtered=parcs.filter(p=>
    (!secteur && (!p.ferme || p.ferme===ferme)) ||
    (secteur && (p.secteur===secteur) && (!p.ferme || p.ferme===ferme))
  );
  parSel.innerHTML='<option value="">-- Select Parcel --</option>' +
    filtered.map(p=>`<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');

  svOnParcelleChange();
}

function svOnParcelleChange(){
  const ferme=v('sv-ferme');
  const secteur=v('sv-secteur');
  const parcelle=v('sv-parcelle');
  const ptSel=g('sv-point');
  const pts=rfLoadPoints();

  const filtered=pts.filter(pt=>{
    if(parcelle){
      return pt.parcelle===parcelle &&
             (!pt.secteur || pt.secteur===secteur || !secteur) &&
             (!pt.ferme || pt.ferme===ferme || !ferme);
    }
    if(secteur){
      return (!pt.parcelle) && pt.secteur===secteur &&
             (!pt.ferme || pt.ferme===ferme || !ferme);
    }
    return (!pt.parcelle && !pt.secteur) &&
           (!pt.ferme || pt.ferme===ferme || !ferme);
  });

  ptSel.innerHTML='<option value="">-- Select Point --</option>' +
    filtered.map(p=>`<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');
}

/* Context */

function svGetContext(){
  const ferme=v('sv-ferme');
  const secteur=v('sv-secteur');
  const parcelle=v('sv-parcelle');
  const point=v('sv-point');
  if(!ferme || !secteur || !parcelle || !point) return null;
  return {ferme,secteur,parcelle,point};
}

/* Add measurement */

function svOpenAdd(){
  if(!svGetContext()){alert('Select Farm / Sector / Parcel / Point first.');return;}
  g('sv-add-modal').classList.add('show');
}
function svCloseAdd(){
  g('sv-add-modal').classList.remove('show');
}
function svSaveAdd(){
  const ctx=svGetContext();
  if(!ctx){alert('Select Farm / Sector / Parcel / Point first.');return;}

  const m={
    id:Date.now(),
    ferme:ctx.ferme,
    secteur:ctx.secteur,
    parcelle:ctx.parcelle,
    point:ctx.point,
    tours:v('sv-tours'),
    duree:v('sv-duree'),
    repos:v('sv-repos'),
    vApport:v('sv-vapport'),
    ecApport:v('sv-ecapport'),
    phApport:v('sv-phapport'),
    vDrain:v('sv-vdrain'),
    ecDrain:v('sv-ecdrain'),
    phDrain:v('sv-phdrain'),
    pctDrain:v('sv-pctdrain')
  };

  if(!m.tours && !m.duree){
    alert('Fill at least Tours/Hours or Duration.');
    return;
  }

  const all=svLoadAll();
  all.push(m);
  svSaveAll(all);

  ['sv-tours','sv-duree','sv-repos','sv-vapport','sv-ecapport','sv-phapport',
   'sv-vdrain','sv-ecdrain','sv-phdrain','sv-pctdrain']
   .forEach(id=>{if(g(id))g(id).value='';});

  svCloseAdd();
  alert('Measurement saved.');
}

/* Table modal */

function svOpenTable(){
  const ctx=svGetContext();
  if(!ctx){alert('Select Farm / Sector / Parcel / Point first.');return;}
  g('sv-table-title').textContent =
    `${ctx.ferme} / ${ctx.secteur} / ${ctx.parcelle} / ${ctx.point}`;
  svRenderTable(ctx);
  g('sv-table-modal').classList.add('show');
}
function svCloseTable(){
  g('sv-table-modal').classList.remove('show');
}

function svRenderTable(ctx){
  const tbody=document.querySelector('#sv-table tbody');
  const all=svLoadAll().filter(m =>
    m.ferme===ctx.ferme &&
    m.secteur===ctx.secteur &&
    m.parcelle===ctx.parcelle &&
    m.point===ctx.point
  );
  if(!all.length){
    tbody.innerHTML=`<tr><td colspan="12" class="muted">No measurements yet for this point.</td></tr>`;
    return;
  }
  tbody.innerHTML=all.map((m,i)=>`
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

/* Edit / Delete row (on click) */

function svRowMenu(id){
  const all=svLoadAll();
  const m=all.find(x=>x.id===id);
  if(!m)return;
  const choice=prompt(
    'Row options:\n1 = Edit\n2 = Delete\nAny other = Cancel','1'
  );
  if(choice==='2'){
    if(confirm('Delete this row?')){
      const idx=all.findIndex(x=>x.id===id);
      if(idx>-1) all.splice(idx,1);
      svSaveAll(all);
      const ctx=svGetContext(); if(ctx) svRenderTable(ctx);
    }
  }else if(choice==='1'){
    // preload form
    g('sv-tours').value=m.tours||'';
    g('sv-duree').value=m.duree||'';
    g('sv-repos').value=m.repos||'';
    g('sv-vapport').value=m.vApport||'';
    g('sv-ecapport').value=m.ecApport||'';
    g('sv-phapport').value=m.phApport||'';
    g('sv-vdrain').value=m.vDrain||'';
    g('sv-ecdrain').value=m.ecDrain||'';
    g('sv-phdrain').value=m.phDrain||'';
    g('sv-pctdrain').value=m.pctDrain||'';

    const originalSave=svSaveAdd;
    window.svSaveAdd=function(){
      const ctx=svGetContext();
      if(!ctx){alert('Select Farm / Sector / Parcel / Point first.');return;}
      m.tours=v('sv-tours');
      m.duree=v('sv-duree');
      m.repos=v('sv-repos');
      m.vApport=v('sv-vapport');
      m.ecApport=v('sv-ecapport');
      m.phApport=v('sv-phapport');
      m.vDrain=v('sv-vdrain');
      m.ecDrain=v('sv-ecdrain');
      m.phDrain=v('sv-phdrain');
      m.pctDrain=v('sv-pctdrain');
      svSaveAll(all);
      svCloseAdd();
      alert('Row updated.');
      const ctx2=svGetContext(); if(ctx2) svRenderTable(ctx2);
      window.svSaveAdd=originalSave;
      ['sv-tours','sv-duree','sv-repos','sv-vapport','sv-ecapport','sv-phapport',
       'sv-vdrain','sv-ecdrain','sv-phdrain','sv-pctdrain']
       .forEach(id=>{if(g(id))g(id).value='';});
    };
    svOpenAdd();
  }
}

/* Share & Export */

function svGetRowsForCurrent(){
  const ctx=svGetContext();
  if(!ctx) return null;
  const rows=svLoadAll().filter(m =>
    m.ferme===ctx.ferme &&
    m.secteur===ctx.secteur &&
    m.parcelle===ctx.parcelle &&
    m.point===ctx.point
  );
  return {ctx,rows};
}

function svShare(){
  const data=svGetRowsForCurrent();
  if(!data){alert('Select Farm / Sector / Parcel / Point first.');return;}
  const {ctx,rows}=data;
  if(!rows.length){alert('No data to share.');return;}
  let txt=`Irrigation ${ctx.ferme}/${ctx.secteur}/${ctx.parcelle}/${ctx.point}\n`;
  rows.forEach((m,i)=>{
    txt+=`${i+1}) Tours:${m.tours} Dur:${m.duree} Vapp:${m.vApport} EC:${m.ecApport} pH:${m.phApport}\n`;
  });
  if(navigator.clipboard) navigator.clipboard.writeText(txt);
  alert('Summary copied. Paste in WhatsApp / Email.');
}

function svExportExcel(){
  const data=svGetRowsForCurrent();
  if(!data){alert('Select Farm / Sector / Parcel / Point first.');return;}
  const {ctx,rows}=data;
  if(!rows.length){alert('No data to export.');return;}

  let csv='Point,Tours/Hours,Duration(min),Rest,V apport,EC apport,pH apport,V drainage,EC drainage,pH drainage,% drainage\n';
  rows.forEach(m=>{
    const vals=[m.point,m.tours,m.duree,m.repos,m.vApport,m.ecApport,m.phApport,
      m.vDrain,m.ecDrain,m.phDrain,m.pctDrain]
      .map(x=>`"${(x||'').replace(/"/g,'""')}"`).join(',');
    csv+=vals+'\n';
  });
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`irrigation_${ctx.ferme}_${ctx.point}.csv`;
  document.body.appendChild(a);a.click();a.remove();
}

function svExportPDF(){
  // ensure table visible then use print
  if(!g('sv-table-modal').classList.contains('show')){
    const ctx=svGetContext();
    if(!ctx){alert('Select Farm / Sector / Parcel / Point first.');return;}
    svOpenTable();
  }
  alert('Use browser print dialog and choose "Save as PDF".');
  setTimeout(()=>window.print(),300);
}
