// 📁 main.js

import { MouseTracker } from "./MouseTracker.js";
import { createCheckBoxes } from "./checkboxGenerator.js";
import {
  isClickTooFast,
  isCenterClick,
  toggleFakeBoxes,
  updateCaptchaBox,
  disableCaptcha,
  startBanTimer,
} from "./Service.js";
window.toggleFakeBoxes = toggleFakeBoxes;

import { sendToBackend } from "./SendToBackend.js";

// HTML elements
const checkboxContainer = document.getElementById("checkbox-container");
const captchaBox = document.querySelector(".captcha-box");

// Captcha state
const CaptchaState = {
  realCheckbox: null,
  allowClick: false,
  fakeClickCount: 0,
  fakeBoxIndexes: [],
  userInteraction: {
    lastTime: 0,
    lastX: 0,
    lastY: 0,
    mouseMoved: false,
  },
};

// Setup captcha
function setupCaptcha() {
  const checkboxes = createCheckBoxes();
  CaptchaState.realCheckbox = checkboxes.real;

  checkboxContainer.innerHTML = "";
  checkboxes.all.forEach((box) => checkboxContainer.appendChild(box));



// Disable clicking temporarily until delay is over
CaptchaState.allowClick = false;

// Hide the "I am human" label during the waiting period
const label = document.getElementById("captcha-static-label");
if (label) label.style.visibility = "hidden";

// Hide the checkbox container during the waiting period
const checkbox = document.getElementById("checkbox-container");
if (checkbox) checkbox.style.visibility = "hidden";

// Generate a random delay between 500ms and 1500ms
const delay = 500 + Math.random() * 1000;

setTimeout(() => {
  // Re-enable clicking after the delay
  CaptchaState.allowClick = true;
  console.log(`🟢 Click allowed after ${Math.round(delay)}ms`);

  // Show the "I am human" label again
  if (label) label.style.visibility = "visible";

  // Show the checkbox container again
  if (checkbox) checkbox.style.visibility = "visible";
}, delay);





  // Store only the fake checkboxes in a global variable
  window.fakeBoxes = checkboxes.all.filter((box) => box !== checkboxes.real);
  // ✅ Hide fake boxes by default
  window.fakeBoxes.forEach((box) => (box.style.display = "none"));
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("captcha-static-label").textContent = "I am human";

  document.addEventListener("mousemove", (event) => {
    if (Math.abs(event.movementX) > 1 || Math.abs(event.movementY) > 1) {
      CaptchaState.userInteraction.mouseMoved = true;
    }
  });

  setupCaptcha();

  checkboxContainer.addEventListener("click", async (event) => {
    //IMPORTANT: Uncomment the following block to enable real-user click protection
    /*
  if (!event.isTrusted) {
    console.warn("Untrusted click blocked (likely from a script).");
    return;
  }
  */

    const now = Date.now();
    const clickX = event.clientX;
    const clickY = event.clientY;
    const timeDiff = CaptchaState.userInteraction.lastTime
      ? now - CaptchaState.userInteraction.lastTime
      : null;
    CaptchaState.userInteraction.lastTime = now;

    const dx = clickX - CaptchaState.userInteraction.lastX;
    const dy = clickY - CaptchaState.userInteraction.lastY;
    const distance = Math.hypot(dx, dy);

    if (
      !CaptchaState.allowClick ||
      isClickTooFast(timeDiff) ||
      !CaptchaState.userInteraction.mouseMoved ||
      distance < 10
    ) {
      console.warn("⚠️ Suspicious click attempt");
      return handleFakeClick(event);
    }

    if (event.target === CaptchaState.realCheckbox) {
      const rect = event.target.getBoundingClientRect();
      const diffX = Math.abs(clickX - (rect.left + rect.width / 2));
      const diffY = Math.abs(clickY - (rect.top + rect.height / 2));

      console.log("📏 diffX:", diffX, "diffY:", diffY);

      if (diffX < 0.3 && diffY < 0.3) {
        console.warn("🤖 Click was too perfect, suspicious");
        return handleFakeClick(event);
      }

      console.log("✅ Verification successful");
      CaptchaState.fakeClickCount = 0;
      CaptchaState.fakeBoxIndexes = [];

      const data = MouseTracker.handleClick(event);
      if (!data || !data.speedSeries || data.speedSeries.length < 5) {
        console.warn("⛔ Ignored incomplete or invalid data.");
        return;
      }

      // Show loading spinner
      checkboxContainer.innerHTML = `
        <div class="loading-spinner"></div>
      `;

      // Send data to backend
      const result = await sendToBackend(data);

      if (result?.status === "banned") {
        checkboxContainer.innerHTML = `
          <div style="color: red; font-size: 20px; font-weight: bold;">
            🚫 Access denied. You have been permanently banned.
          </div>`;
        document.getElementById("captcha-static-label").style.display = "none";
        return;
      }

      if (result?.status === "human") {
        document.getElementById("captcha-static-label").style.display = "none";
        checkboxContainer.innerHTML = `
          <div style="color: green; font-size: 20px; font-weight: bold;">
            ✅ Success!
          </div>`;
      }
    } else {
      handleFakeClick(event);
    }

    CaptchaState.userInteraction.lastX = clickX;
    CaptchaState.userInteraction.lastY = clickY;
    CaptchaState.userInteraction.mouseMoved = false;
  });

  if (captchaBox) {
    captchaBox.addEventListener("mouseenter", (event) =>
      MouseTracker.startTracking(event)
    );
    captchaBox.addEventListener("mousemove", (event) =>
      MouseTracker.trackMovement(event)
    );
  }
});

// Handle incorrect clicks
async function handleFakeClick(event) {
  event.preventDefault();
  CaptchaState.fakeClickCount++;

  const boxIndex = [...checkboxContainer.querySelectorAll("input")].indexOf(
    event.target
  );
  CaptchaState.fakeBoxIndexes.push(boxIndex);

  if (CaptchaState.fakeClickCount === 1) {
    console.log("⚠️ First Fail");
    setupCaptcha();
  } else if (CaptchaState.fakeClickCount === 2) {
    console.log("⚠️ Second Fail: Banned for 2 Sec");

    // Hide text directly
    document.getElementById("captcha-static-label").style.display = "none";

    startBanTimer(2, () => {
      // Wait a second after displaying the message
      setTimeout(() => {
        checkboxContainer.innerHTML = ""; // Delete the message " You can try again."

        // Show the text "I am human"
        const label = document.getElementById("captcha-static-label");
        if (label) label.style.display = "block";

        // Regenerate the captcha
        setupCaptcha();
      }, 1000); // A slight delay until the message is shown to the user first
    });
  } else if (CaptchaState.fakeClickCount >= 3) {
    console.log("⚠️ Third Fail: Banned!");
    disableCaptcha();

    // Local ban directly
    checkboxContainer.innerHTML = `
    <div style="color: red; font-size: 20px; font-weight: bold;">
      🚫 You have been banned.
    </div>`;

    // Hide the text "I am human"
    const label = document.getElementById("captcha-static-label");
    if (label) label.style.display = "none";

    // Send data to the bank without waiting for a response
    const report = {
      mode: "robot-detected",
      reason: "Three fake clicks detected",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      boxIndexes: CaptchaState.fakeBoxIndexes,
      pageUrl: window.location.href,
    };

    sendToBackend(report).catch((err) => {
      console.warn("Backend unreachable:", err.message);
    });

    // Reset state
    CaptchaState.fakeClickCount = 0;
    CaptchaState.fakeBoxIndexes = [];
  }
}
