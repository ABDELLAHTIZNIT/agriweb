// ==== index.js ====
// منطق صفحة تسجيل الدخول في تطبيق AB AGRIWEB

import AppConfig from "./core/config.js";
import StorageManager from "./core/storage.js";
import Security from "./core/security.js";
import Utils from "./core/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log(`🔐 Page de connexion - ${AppConfig.appName}`);

  const form = Utils.$("loginForm");
  const userInput = Utils.$("u");
  const passInput = Utils.$("p");
  const loginBtn = Utils.$("loginBtn");

  if (!form || !loginBtn) {
    console.warn("Formulaire de login non trouvé");
    return;
  }

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const username = userInput.value.trim();
    const password = passInput.value.trim();

    if (!username || !password) {
      Utils.notify("Veuillez remplir les deux champs.", "error");
      return;
    }

    const users = StorageManager.load("ab_operators", []);
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (found) {
      Utils.notify(`Bienvenue ${found.username} 👋`, "info");
      setTimeout(() => {
        window.location.href = "main.html";
      }, 800);
    } else {
      Utils.notify("Nom d’utilisateur ou mot de passe incorrect ❌", "error");
    }
  });

  // زر تفعيل setup mode
  const setupBtn = Utils.$("setupBtn");
  if (setupBtn) {
    setupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("ab_setup", "1");
      Utils.notify("Mode setup activé ⚙️", "info");
      window.location.href = "main.html";
    });
  }

  // رسالة ترحيب صغيرة
  Utils.notify(`${AppConfig.appName} prêt à l’utilisation`, "info");
});
