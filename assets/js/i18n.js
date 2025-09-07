// Hàm load file ngôn ngữ (JSON) và cập nhật nội dung các phần tử có data-i18n và data-i18n-placeholder
async function loadLanguage(lang) {
  try {
    // Nếu HTML nằm trong thư mục con thì cần ../
    const prefix = (window.location.pathname.includes('products_detail')|| window.location.pathname.includes('product-type')) ? '../' : '';
    const response = await fetch(`${prefix}assets/lang/${lang}.json`);

    if (!response.ok) {
      throw new Error(`Không thể tải ngôn ngữ: ${lang}`);
    }

    const translations = await response.json();

    // Cập nhật textContent
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      if (translations[key]) {
        elem.textContent = translations[key];
      }
    });

    // Cập nhật value
    document.querySelectorAll('[data-i18n-value]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-value');
      if (translations[key]) {
        elem.value = translations[key];
      }
    });

    // Cập nhật placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        elem.setAttribute('placeholder', translations[key]);
      }
    });

    // Lưu ngôn ngữ đã chọn
    localStorage.setItem('selectedLanguage', lang);

  } catch (error) {
    console.error("Lỗi khi tải ngôn ngữ:", error);
  }
}


// Gắn sự kiện click cho từng lựa chọn ngôn ngữ
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', function (e) {
      e.preventDefault();
      const lang = this.dataset.lang;

      loadLanguage(lang);

      const dropdownBtn = document.getElementById('languageDropdown');
      dropdownBtn.innerHTML = this.innerHTML; // giữ nguyên SVG + text
    });
  });

  // Load ngôn ngữ mặc định
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  loadLanguage(savedLang);

  // Cập nhật nút ban đầu theo ngôn ngữ đã lưu
  const activeOption = document.querySelector(`.language-option[data-lang="${savedLang}"]`);
  if (activeOption) {
    document.getElementById('languageDropdown').innerHTML = activeOption.innerHTML;
  }
});
