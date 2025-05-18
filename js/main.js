// 📁 main.js

import { MouseTracker } from "./MouseTracker.js";
import { createCheckBoxes } from "./checkboxGenerator.js";
import {
  isClickTooFast,
  isCenterClick,
  toggleFakeBoxes,
  updateCaptchaBox,
  disableCaptcha,
  startBanTimer
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

  CaptchaState.allowClick = false;
  const delay = 500 + Math.random() * 1000;
  setTimeout(() => {
    CaptchaState.allowClick = true;
    console.log(`🟢 Click allowed after ${Math.round(delay)}ms`);
  }, delay);

 // Store only the fake checkboxes in a global variable
  window.fakeBoxes = checkboxes.all.filter(box => box !== checkboxes.real);
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("captcha-static-label").textContent = "Click the box to verify you're human.";

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

      if (isCenterClick(diffX, diffY)) {
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
            ✅ Welcome! You have been verified as human.
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

  const boxIndex = [...checkboxContainer.querySelectorAll("input")].indexOf(event.target);
  CaptchaState.fakeBoxIndexes.push(boxIndex);

  if (CaptchaState.fakeClickCount === 1) {
    console.log("⚠️ First Fail");
    setupCaptcha();
  } else if (CaptchaState.fakeClickCount === 2) {
    console.log("⚠️ Second Fail: Banned for 2 Sec");
    startBanTimer(2, () => setTimeout(setupCaptcha, 1500));
  } else if (CaptchaState.fakeClickCount >= 3) {
    console.log("⚠️ Third Fail: Banned!");
    disableCaptcha();

    const report = {
      mode: "robot-detected",
      reason: "Three fake clicks detected",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      boxIndexes: CaptchaState.fakeBoxIndexes,
      pageUrl: window.location.href,
    };

    const result = await sendToBackend(report);

    if (result?.status === "banned") {
      checkboxContainer.innerHTML = `
        <div style="color: red; font-size: 20px; font-weight: bold;">
          🚫 You have been permanently banned.
        </div>`;
      document.getElementById("captcha-static-label").style.display = "none";
    }

    CaptchaState.fakeClickCount = 0;
    CaptchaState.fakeBoxIndexes = [];
  }
}
