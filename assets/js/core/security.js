// ==== security.js ====
// أدوات الأمان: تشفير بسيط، كود الاسترجاع، سؤال سري...

const Security = {
  hashLite(text) {
    // دالة تشفير بسيطة لتوليد رمز من النص
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = (h << 5) - h + text.charCodeAt(i);
      h |= 0;
    }
    return String(h);
  },

  generateRecoveryCode() {
    // إنشاء كود استرجاع عشوائي مكوّن من 6 أرقام
    return Math.floor(100000 + Math.random() * 900000);
  },

  validateRecoveryCode(inputCode, savedCode) {
    // تحقق من الكود المدخل مع المخزّن
    return String(inputCode) === String(savedCode);
  },

  validateAnswer(input, savedHash) {
    // تحقق من الجواب السري بعد تشفيره
    return this.hashLite(input.toLowerCase()) === savedHash;
  },
};

export default Security;
