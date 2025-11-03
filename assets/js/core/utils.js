// ==== utils.js ====
// دوال مساعدة تُستعمل في صفحات متعددة داخل التطبيق

const Utils = {
  // 🔹 دالة مساعدة لاختيار عنصر حسب ID
  $(id) {
    return document.getElementById(id);
  },

  // 🔹 إنشاء عنصر جديد في DOM
  create(tag, className = "", content = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
  },

  // 🔹 تنسيق التاريخ
  formatDate(date = new Date()) {
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  },

  // 🔹 عرض رسالة صغيرة في الأعلى (notification)
  notify(message, type = "info") {
    const div = this.create("div", `notify ${type}`, message);
    Object.assign(div.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      padding: "10px 14px",
      borderRadius: "8px",
      background: type === "error" ? "#ef4444" : "#22c55e",
      color: "#fff",
      fontSize: "14px",
      zIndex: "9999",
      boxShadow: "0 2px 8px rgba(0,0,0,.3)",
    });
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  },
};

export default Utils;
