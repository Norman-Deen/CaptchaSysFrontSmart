// SendToBackend.js

// Determine whether the environment is local or deployed
const isLocal =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost";

// Set the base URL depending on the environment
const BASE_URL = isLocal
  ? "http://127.0.0.1:8080"
  : "https://captchasysbacksmart.onrender.com";

// Define API endpoints for different input types
const API_ENDPOINTS = {
  mouse: `${BASE_URL}/api/box`,
  touch: `${BASE_URL}/api/slider`,
};

// Maps internal error types to human-readable reasons
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

// Unified function for sending mouse or touch data to the backend
export async function sendToBackendData(type, data, errorType = null) {
  const isRobotDetected = data.mode === "robot-detected";
  const clickedFakeBox = errorType === "fake-box";
  const url = API_ENDPOINTS[type] || API_ENDPOINTS.mouse;

  let payload;

  if (isRobotDetected) {
    // Case: server-side ban already triggered
    payload = { ...data };
  } else if (clickedFakeBox) {
    // Case: user clicked a fake checkbox
    const reason = getErrorInfo(errorType);
    payload = {
      behaviorType: "robot",
      movementPattern: "clicked-fake-box",
      reason,
      pageUrl: window.location.href,
    };
  } else if (type === "touch") {
    // Case: slider/touch-based data
    payload = {
      avgSpeed: data.avgSpeed,
      stdSpeed: data.stdSpeed,
      accelerationChanges: data.accelerationChanges,
      movementTime: data.duration,
      verticalCount: data.verticalCount,
      verticalScore: data.verticalScore,
      totalVerticalMovement: data.totalDisplacementY,
      speedSeries: data.speedSeries,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    };
  } else {
    // Case: regular mouse input data
    payload = {
      ...data,
      pageUrl: window.location.href,
    };
  }

  try {
    console.log("Sending to:", url);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Server responded with status:", response.status);
    console.log("Raw response headers:", [...response.headers.entries()]);

    const contentType = response.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) {
      console.warn("Response is not JSON.");
      return { success: false };
    }

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    if (!result) {
      console.error("Empty backend response");
      return { success: false };
    }

    console.log("Backend response:", result);
    return result;
  } catch (err) {
    console.error("Failed to send data:", err);
    return { success: false };
  }
}
