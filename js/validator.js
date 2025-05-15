// 📁 validator.js

// ✅ دالة تتحقق إذا النقر كان سريع جدًا (أقل من 300 ميلي ثانية)
export function isClickTooFast(timeDiff) {
  // إذا كان الفرق بين النقرات أقل من 300ms، نعتبره مشبوه (روبوت غالباً)
  return timeDiff !== null && timeDiff < 300;
}

// ✅ دالة تتحقق إذا النقر كان تماماً في منتصف المربع (بدقة مريبة)
export function isCenterClick(diffX, diffY, tolerance = 1) {
  // إذا كانت المسافة بين موقع النقر والمركز أقل من الهامش (tolerance)، نعتبره مثالي زيادة عن اللزوم
  return diffX < tolerance && diffY < tolerance;
}
