// ==== storage.js ====
// نظام تخزين محلي لإعدادات المستخدم و صور الواجهة

const StorageManager = {
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("خطأ في الحفظ:", e);
    }
  },

  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error("خطأ في القراءة:", e);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("خطأ في الحذف:", e);
    }
  },

  clearAll() {
    try {
      localStorage.clear();
      console.log("تم حذف جميع البيانات المحلية");
    } catch (e) {
      console.error("خطأ أثناء مسح البيانات:", e);
    }
  },
};

// تصدير الوحدة لاستعمالها في باقي الصفحات
export default StorageManager;
