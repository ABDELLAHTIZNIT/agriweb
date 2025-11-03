// ==== main.js ====
// ربط كل الموديولات (config, storage, security, utils)
// وإدارة التشغيل العام للتطبيق

import AppConfig from "./core/config.js";
import StorageManager from "./core/storage.js";
import Security from "./core/security.js";
import Utils from "./core/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log(`🚀 ${AppConfig.appName} - version ${AppConfig.version}`);

  // إعداد الواجهة العلوية
  const topbarTitle = Utils.$("topbarTitle");
  if (topbarTitle) {
    topbarTitle.textContent = AppConfig.appName;
  }

  // تجربة تحميل إعدادات
  const savedTheme = StorageManager.load("theme", null);
  if (savedTheme) {
    document.body.style.background = savedTheme.background;
    console.log("🎨 Thème chargé depuis LocalStorage");
  }

  // مثال لتوليد كود أمان
  const code = Security.generateRecoveryCode();
  console.log("🔐 Exemple de code recovery:", code);

  // مثال لإشعار عند بدء التشغيل
  Utils.notify(`${AppConfig.appName} prêt à être utilisé`, "info");
});
