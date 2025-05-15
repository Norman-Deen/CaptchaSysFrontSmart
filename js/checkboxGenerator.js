// 📁 checkboxGenerator.js

// ✅ إنشاء المربعات: 4 وهمية + 1 حقيقي يتم وضعه في موقع عشوائي
export function createCheckBoxes() {
  let checkboxes = [];

  // 🔸 إنشاء 4 مربعات وهمية (غير فعّالة)
  for (let i = 0; i < 4; i++) {
    let fakeBox = document.createElement("input");
    fakeBox.type = "checkbox";
    fakeBox.classList.add("hidden-checkbox"); // نضيف كلاس لإخفائه بالـ CSS
    checkboxes.push(fakeBox); // نضيفه للمصفوفة
  }

  // 🔸 إنشاء المربع الحقيقي (هو المطلوب للنقر الصحيح)
  let realBox = document.createElement("input");
  realBox.type = "checkbox";
  realBox.classList.add("hidden-checkbox");

  // ✳️ (لأغراض التجربة فقط): إبراز المربع الحقيقي بلون أخضر
  realBox.style.outline = "2px solid limegreen";

  // 🔸 نختار موقع عشوائي داخل المصفوفة (بس مو بالأطراف) لنضع فيه المربع الحقيقي
  let possiblePositions = [1, 3]; // أماكن مقبولة داخل المصفوفة
  let insertIndex =
    possiblePositions[Math.floor(Math.random() * possiblePositions.length)];

  // ندرج المربع الحقيقي بالمكان العشوائي المحدد
  checkboxes.splice(insertIndex, 0, realBox);

  // ✅ نرجع كل المربعات + المربع الحقيقي لوحده
  return {
    all: checkboxes, // كل المربعات (وهمية + حقيقي)
    real: realBox, // مرجع للمربع الحقيقي فقط
  };
}

// ✅ دالة لإعادة توليد المربعات داخل حاوية معينة (مفيدة لإعادة المحاولة)
export function shuffleCheckBoxes(container) {
  const result = createCheckBoxes(); // توليد جديد
  container.innerHTML = ""; // مسح المحتوى السابق
  result.all.forEach((box) => container.appendChild(box)); // عرض المربعات
  return result.real; // إرجاع المربع الحقيقي
}
