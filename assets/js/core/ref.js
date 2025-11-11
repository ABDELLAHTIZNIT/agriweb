// Référentiel: Société > Ferme > Secteur > Parcelle > Point

const LS_SOC = 'ab_societes';
const LS_FER = 'ab_fermes';
const LS_SEC = 'ab_secteurs';
const LS_PAR = 'ab_parcelles';
const LS_PT  = 'ab_points';

function jload(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}}
function jsave(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}

function g(id){return document.getElementById(id);}
function escapeHtml(s){return (s||'').replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}

function rfLoadSocietes(){return jload(LS_SOC)}
function rfLoadFarms(){return jload(LS_FER)}
function rfLoadSecteurs(){return jload(LS_SEC)}
function rfLoadParcelles(){return jload(LS_PAR)}
function rfLoadPoints(){return jload(LS_PT)}

function rfInit(){
  rfRenderAll();
}

/******** ADD ********/

function rfAddSociete(){
  const name=(g('rf-societe-name')||{}).value?.trim();
  if(!name) return;
  const list=rfLoadSocietes();
  if(list.some(x=>x.name===name)){alert('Société موجودة.');return;}
  list.push({name});
  jsave(LS_SOC,list);
  g('rf-societe-name').value='';
  rfRenderAll();
}

function rfAddFerme(){
  const soc=(g('rf-ferme-societe')||{}).value;
  const name=(g('rf-ferme-name')||{}).value?.trim();
  if(!soc||!name)return;
  const list=rfLoadFarms();
  list.push({name,societe:soc});
  jsave(LS_FER,list);
  g('rf-ferme-name').value='';
  rfRenderAll();
}

function rfAddSecteur(){
  const ferme=(g('rf-sect-ferme')||{}).value;
  const name=(g('rf-sect-name')||{}).value?.trim();
  if(!ferme||!name)return;
  const list=rfLoadSecteurs();
  list.push({name,ferme});
  jsave(LS_SEC,list);
  g('rf-sect-name').value='';
  rfRenderAll();
}

function rfAddParcelle(){
  const ferme=(g('rf-parc-ferme')||{}).value;
  const secteur=(g('rf-parc-secteur')||{}).value;
  const name=(g('rf-parc-name')||{}).value?.trim();
  if(!ferme||!secteur||!name)return;
  const list=rfLoadParcelles();
  list.push({name,ferme,secteur});
  jsave(LS_PAR,list);
  g('rf-parc-name').value='';
  rfRenderAll();
}

function rfAddPoint(){
  const ferme=(g('rf-pt-ferme')||{}).value;
  const secteur=(g('rf-pt-secteur')||{}).value;
  const parcelle=(g('rf-pt-parcelle')||{}).value;
  const name=(g('rf-pt-name')||{}).value?.trim();
  if(!ferme||!secteur||!parcelle||!name)return;
  const list=rfLoadPoints();
  list.push({name,ferme,secteur,parcelle});
  jsave(LS_PT,list);
  g('rf-pt-name').value='';
  rfRenderAll();
}

/******** DELETE (click item) ********/

function rfDelSociete(name){
  if(!confirm('حذف société وجميع العناصر التابعة لها؟'))return;
  jsave(LS_SOC, rfLoadSocietes().filter(x=>x.name!==name));
  rfCascadeClean();
}
function rfDelFerme(name){
  if(!confirm('حذف ferme وجميع العناصر التابعة لها؟'))return;
  jsave(LS_FER, rfLoadFarms().filter(x=>x.name!==name));
  rfCascadeClean();
}
function rfDelSecteur(name){
  if(!confirm('حذف secteur وجميع العناصر التابعة لها؟'))return;
  jsave(LS_SEC, rfLoadSecteurs().filter(x=>x.name!==name));
  rfCascadeClean();
}
function rfDelParcelle(name){
  if(!confirm('حذف parcelle وجميع الـ points التابعة لها؟'))return;
  jsave(LS_PAR, rfLoadParcelles().filter(x=>x.name!==name));
  jsave(LS_PT, rfLoadPoints().filter(x=>x.parcelle!==name));
  rfRenderAll();
}
function rfDelPoint(name){
  if(!confirm('حذف هذا الـ point؟'))return;
  jsave(LS_PT, rfLoadPoints().filter(x=>x.name!==name));
  rfRenderAll();
}

function rfCascadeClean(){
  const socs=rfLoadSocietes().map(x=>x.name);
  let farms=rfLoadFarms().filter(f=>socs.includes(f.societe));
  jsave(LS_FER,farms);

  const farmNames=farms.map(f=>f.name);
  let secs=rfLoadSecteurs().filter(s=>farmNames.includes(s.ferme));
  jsave(LS_SEC,secs);

  const secNames=secs.map(s=>s.name);
  let parcs=rfLoadParcelles().filter(p=>farmNames.includes(p.ferme)&&secNames.includes(p.secteur));
  jsave(LS_PAR,parcs);

  const parcNames=parcs.map(p=>p.name);
  let pts=rfLoadPoints().filter(pt=>parcNames.includes(pt.parcelle));
  jsave(LS_PT,pts);

  rfRenderAll();
}

/******** RENDER ********/

function rfRenderAll(){
  if(!g('rf-societe-list')) return;

  const socs=rfLoadSocietes();
  const farms=rfLoadFarms();
  const secs=rfLoadSecteurs();
  const parcs=rfLoadParcelles();
  const pts=rfLoadPoints();

  g('rf-societe-list').innerHTML =
    socs.map(s=>`<li onclick="rfDelSociete('${escapeHtml(s.name)}')">${escapeHtml(s.name)}</li>`).join('');

  const socOpts='<option value="">Société</option>' +
    socs.map(s=>`<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('');
  ['rf-ferme-societe'].forEach(id=>{if(g(id))g(id).innerHTML=socOpts;});

  g('rf-ferme-list').innerHTML =
    farms.map(f=>`<li onclick="rfDelFerme('${escapeHtml(f.name)}')">${escapeHtml(f.name)} <span class="tag">${escapeHtml(f.societe||'')}</span></li>`).join('');

  const ferOpts='<option value="">Ferme</option>' +
    farms.map(f=>`<option value="${escapeHtml(f.name)}">${escapeHtml(f.name)}</option>`).join('');
  ['rf-sect-ferme','rf-parc-ferme','rf-pt-ferme'].forEach(id=>{if(g(id))g(id).innerHTML=ferOpts;});

  g('rf-sect-list').innerHTML =
    secs.map(s=>`<li onclick="rfDelSecteur('${escapeHtml(s.name)}')">${escapeHtml(s.name)} <span class="tag">${escapeHtml(s.ferme||'')}</span></li>`).join('');

  const secOpts='<option value="">Secteur</option>' +
    secs.map(s=>`<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('');
  if(g('rf-parc-secteur')) g('rf-parc-secteur').innerHTML=secOpts;
  if(g('rf-pt-secteur')) g('rf-pt-secteur').innerHTML=secOpts;

  g('rf-parc-list').innerHTML =
    parcs.map(p=>`<li onclick="rfDelParcelle('${escapeHtml(p.name)}')">${escapeHtml(p.name)} <span class="tag">${escapeHtml(p.ferme)}/${escapeHtml(p.secteur)}</span></li>`).join('');

  const parcOpts='<option value="">Parcelle</option>' +
    parcs.map(p=>`<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');
  if(g('rf-pt-parcelle')) g('rf-pt-parcelle').innerHTML=parcOpts;

  g('rf-pt-list').innerHTML =
    pts.map(pt=>`<li onclick="rfDelPoint('${escapeHtml(pt.name)}')">${escapeHtml(pt.name)} <span class="tag">${escapeHtml(pt.ferme)}/${escapeHtml(pt.secteur)}/${escapeHtml(pt.parcelle)}</span></li>`).join('');
}
