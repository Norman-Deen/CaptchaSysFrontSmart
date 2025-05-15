// 📡 رابط الـ API الخاص بالخادم لاستقبال بيانات التفاعل
//const API_URL = "https://localhost:7089/api/captcha"; // غيّره حسب الحاجة

const API_URL = "https://captchasysbacksmart.onrender.com/api/captcha";



// 🧩 دالة ترجع كائن يحتوي على كود الخطأ وسببه بناءً على نوع الخطأ
function getErrorInfo(type) {
  const reasons = {
    "fake-box": "Clicked on fake box",
    "too-fast": "Click was too fast",
    "center-click": "Click was too perfect (center)",
    "no-movement": "No mouse movement detected",
    unknown: "Unknown or untracked attempt",
  };

  return { reason: reasons[type] || reasons["unknown"] };
}

// 🚀 الدالة الرئيسية لإرسال البيانات إلى الخادم
export async function sendToBackend(
  data,
  clickedFakeBox = false,
  errorType = null
) {
  let payload;

  if (data.mode === "robot-detected") {
    payload = { ...data };
  } else if (clickedFakeBox) {
   const reason = getErrorInfo(errorType);

    payload = {
      behaviorType: "robot",
      movementPattern: "clicked-fake-box",
      reason,
      pageUrl: window.location.href,
    };
  } else {
    payload = {
      ...data,
      pageUrl: window.location.href,
    };
  }

  try {
    console.log(
      "📤 Sending payload to backend:",
      JSON.stringify(payload, null, 2)
    );

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ Server responded with status:", response.status);
    console.log("🧪 Raw response headers:", [...response.headers.entries()]);

    // ✅ تحقق من نوع المحتوى قبل محاولة قراءة JSON
    const contentType = response.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) {
      console.warn("⚠️ Response is not JSON.");
      return { success: false };
    }

    let result = null;

    try {
      const text = await response.text();
      result = text ? JSON.parse(text) : null;
    } catch (jsonError) {
      console.error("❌ Failed to parse JSON manually:", jsonError);
      return { success: false };
    }

    if (!result) {
      console.error("❌ No usable response from backend!");
      return { success: false };
    }

    console.log("📡 Backend response:", result);
    return result;
  } catch (error) {
    console.error("❌ Fetch failed completely!", error);
    return { success: false };
  }
}
