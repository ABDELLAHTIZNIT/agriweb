// helper simple localStorage wrapper
const AbStorage = {
  get(key, fallback = null){
    try { return JSON.parse(localStorage.getItem(key)); } catch { return fallback; }
  },
  set(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  setRaw(key, value){ localStorage.setItem(key, String(value)); },
  getRaw(key){ return localStorage.getItem(key); },
  remove(key){ localStorage.removeItem(key); }
};
