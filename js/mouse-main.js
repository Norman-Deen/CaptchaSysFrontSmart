// 📁 Mouse-main.js
console.log("✅ Mouse-main.js loaded");

import { MouseTracker } from "./mouseTracker.js";
import { createCheckBoxes } from "./checkboxGenerator.js";
import { sendToBackendData } from "./SendToBackend.js";
import {
  isClickTooFast,
  isCenterClick,
  toggleFakeBoxes,
  updateCaptchaBox,
  disableCaptcha,
  startBanTimer,
} from "./Service.js";
window.toggleFakeBoxes = toggleFakeBoxes;

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

function setupCaptcha() {
  const checkboxContainer = document.getElementById("checkbox-container");
  const label = document.getElementById("captcha-static-label");

  const checkboxes = createCheckBoxes();
  CaptchaState.realCheckbox = checkboxes.real;

  checkboxContainer.innerHTML = "";
  checkboxes.all.forEach((box) => checkboxContainer.appendChild(box));

  CaptchaState.allowClick = false;
  if (label) label.style.visibility = "hidden";
  if (checkboxContainer) checkboxContainer.style.visibility = "hidden";

  const delay = 500 + Math.random() * 1000;
  setTimeout(() => {
    CaptchaState.allowClick = true;
    console.log(`🟢 Click allowed after ${Math.round(delay)}ms`);
    if (label) label.style.visibility = "visible";
    if (checkboxContainer) checkboxContainer.style.visibility = "visible";
  }, delay);

  window.fakeBoxes = checkboxes.all.filter((box) => box !== checkboxes.real);
  window.fakeBoxes.forEach((box) => (box.style.display = "none"));
}

function handleFakeClick(event) {
  event.preventDefault();
  const checkboxContainer = document.getElementById("checkbox-container");
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
    document.getElementById("captcha-static-label").style.display = "none";
    startBanTimer(2, () => {
      setTimeout(() => {
        checkboxContainer.innerHTML = "";
        const label = document.getElementById("captcha-static-label");
        if (label) label.style.display = "block";
        setupCaptcha();
      }, 1000);
    });
  } else if (CaptchaState.fakeClickCount >= 3) {
    console.log("⚠️ Third Fail: Banned!");
    disableCaptcha();
    checkboxContainer.innerHTML = `
      <div style="color: red; font-size: 20px; font-weight: bold;">
        🚫 You have been banned.
      </div>`;
    const label = document.getElementById("captcha-static-label");
    if (label) label.style.display = "none";
    const report = {
      mode: "robot-detected",
      reason: "Three fake clicks detected",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      boxIndexes: CaptchaState.fakeBoxIndexes,
      pageUrl: window.location.href,
    };
    sendToBackendData("mouse", report).catch((err) => {
      console.warn("Backend unreachable:", err.message);
    });
    CaptchaState.fakeClickCount = 0;
    CaptchaState.fakeBoxIndexes = [];
  }
}

function startCaptchaCode() {
  const checkboxContainer = document.getElementById("checkbox-container");
  const captchaBox = document.querySelector(".captcha-box");
  const label = document.getElementById("captcha-static-label");

  if (label) label.textContent = "I am human";

  document.addEventListener("mousemove", (event) => {
    if (Math.abs(event.movementX) > 1 || Math.abs(event.movementY) > 1) {
      CaptchaState.userInteraction.mouseMoved = true;
    }
  });

  setupCaptcha();

  checkboxContainer.addEventListener("click", async (event) => {
    // 🔒 Enable real-user click protection
    if (!event.isTrusted) {
      console.warn("Untrusted click blocked (likely from a script).");
      return;
    }

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

      if (diffX < 0.3 && diffY < 0.3) {
        console.warn("🤖 Click was too perfect, suspicious");
        return handleFakeClick(event);
      }

      const data = MouseTracker.handleClick(event);
      if (!data || !data.speedSeries || data.speedSeries.length < 5) {
        console.warn("⛔ Ignored incomplete or invalid data.");
        return;
      }

      checkboxContainer.innerHTML = `<div class="loading-spinner"></div>`;
      const result = await sendToBackendData("mouse", data);

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
        CaptchaState.fakeClickCount = 0;
        CaptchaState.fakeBoxIndexes = [];
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
}

function waitUntilVisible() {
  const container = document.getElementById("checkbox-container");
  const label = document.getElementById("captcha-static-label");

  if (!container || !label) {
    setTimeout(waitUntilVisible, 50);
    return;
  }

  // console.log("✅ Elements ready, initializing Mouse Captcha...");
  startCaptchaCode();
}

waitUntilVisible();
