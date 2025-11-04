// tiny helpers for password hashing / checking (light)
function hashLite(s){
  let h = 0;
  for(let i=0;i<s.length;i++){ h = ((h<<5)-h) + s.charCodeAt(i); h |= 0; }
  return String(h);
}
