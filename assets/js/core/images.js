// ==== images.js ====
// إعداد الصور والشعارات الخاصة بتطبيق AB AGRIWEB

const Images = {
  logo: "assets/images/logo.png",
  banner: "assets/images/banner.png",
  loginBg: "assets/images/login-bg.jpg",
  topbarIcon: "assets/images/topbar-icon.png",

  // تحميل الصور فـ localStorage إذا كانت غير موجودة
  init() {
    const stored = localStorage.getItem("ab_appimg");
    if (!stored) {
      localStorage.setItem("ab_appimg", JSON.stringify(this));
      console.log("📦 Images enregistrées par défaut dans localStorage.");
    }
  },
};

export default Images;
