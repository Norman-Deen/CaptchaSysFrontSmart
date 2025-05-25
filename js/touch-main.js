// touch-main.js

console.log("touch-main.js loaded");

import { TouchTracker } from "./touchTracker.js";
import { sendToBackendData } from "./SendToBackend.js";

// Initial state for drag interaction
let startX = 0;
let currentX = 0;
let dragging = false;

let lastY = 0;
let verticalMovements = [];
let startTime = 0;

let movementSeries = [];
let maxOffset = 0;

let failedAttempts = 0;

let hasVisuallyExtended = false;
let hasSecretlyExtended = false;                                                              //check this

// DOM references
const handle = document.getElementById("slider-handle");
const track = document.getElementById("slider-track");
const label = document.getElementById("slider-label");
const originalTrackWidth = track.offsetWidth;

// Prevent user interaction before delay
let allowTouch = false;

// Show loading spinner while waiting
label.innerHTML = `<div class="loading-spinner"></div>`;
handle.style.display = "none";           // Hide the slider handle
track.style.visibility = "hidden";       // Hide the slider track

// Wait before showing interactive elements
const delay = 500 + Math.random() * 1000;
setTimeout(() => {
  allowTouch = true;
  label.innerHTML = `Slide to verify`;
  handle.style.display = "block";
  track.style.visibility = "visible";
  console.log(`Touch click allowed after ${Math.round(delay)}ms`);
}, delay);

// Calculate vertical movement score based on movement pattern
function calculateVerticalScore(movements) {
  const total = movements.reduce((sum, y) => sum + y, 0);
  const avg = movements.length > 0 ? total / movements.length : 0;
  const count = movements.length;
  const score = (total * 0.6 + avg * 0.3 + count * 0.1).toFixed(2);
  return parseFloat(score);
}

// Start drag logic
handle.addEventListener("touchstart", (e) => {
  if (!allowTouch) return;

  if (!e.isTrusted) {
    console.warn("Untrusted touch event blocked");
    return;
  }

  dragging = true;
  startX = e.touches[0].clientX;
  startTime = Date.now();

  maxOffset = track.offsetWidth - handle.offsetWidth;
  hasVisuallyExtended = false;
  hasSecretlyExtended = false;
});

// Handle movement
document.addEventListener("touchmove", (e) => {
  if (!dragging) return;

  currentX = e.touches[0].clientX;

  const offsetLimit = track.offsetWidth - handle.offsetWidth;
  const offset = Math.min(Math.max(currentX - startX, 0), offsetLimit);
  handle.style.left = `${offset}px`;

  const distanceToEnd = maxOffset - offset;
  const percentage = offset / maxOffset;

  // Visually extend the slider if needed
  if (percentage > 0.7 && !hasVisuallyExtended) {
    track.style.width = "250px";
    maxOffset = track.offsetWidth - handle.offsetWidth;
    hasVisuallyExtended = true;
  }

  // Secretly extend the slider for extra challenge
  if (
    distanceToEnd < 30 &&
    !hasSecretlyExtended &&
    maxOffset < track.offsetWidth - handle.offsetWidth + 40
  ) {
    maxOffset += 10;
    hasSecretlyExtended = true;
  }

  // Track vertical finger movement (up/down)
  const currentY = e.touches[0].clientY;
  if (lastY !== 0) {
    const deltaY = Math.abs(currentY - lastY);
    if (deltaY >= 0.3) verticalMovements.push(deltaY);
  }
  lastY = currentY;

  movementSeries.push({
    x: currentX,
    y: currentY,
    time: Date.now(),
  });
});

// Handle drag release (touchend)
document.addEventListener("touchend", async () => {
  if (!dragging) return;
  dragging = false;

  const finalOffset = Math.min(
    parseInt(handle.style.left || "0", 10),
    track.offsetWidth - handle.offsetWidth
  );

  const totalDisplacementX = finalOffset;
  const totalDisplacementY = verticalMovements.reduce((a, b) => a + b, 0);
  const duration = Date.now() - startTime;

  const verified = finalOffset >= track.offsetWidth - handle.offsetWidth - 5;

  // Failed attempt: reset or ban
  if (!verified) {
    failedAttempts++;
    console.log(`Incomplete attempt (${failedAttempts}/3)`);

    handle.style.left = "0px";
    track.style.width = `${originalTrackWidth}px`;
    maxOffset = track.offsetWidth - handle.offsetWidth;

    if (failedAttempts >= 3) {
      label.textContent = "You are banned.";
      label.style.color = "red";
      track.style.display = "none";

      const report = {
        mode: "robot-detected",
        reason: "Three failed slider attempts",
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
      };

      sendToBackendData("touch", report).catch((err) => {
        console.warn("Backend unreachable:", err.message);
      });
    }

    return;
  }

  // Calculate speed series from movement
  const speedSeries = [];
  for (let i = 1; i < movementSeries.length; i++) {
    const dx = movementSeries[i].x - movementSeries[i - 1].x;
    const dy = movementSeries[i].y - movementSeries[i - 1].y;
    const dt = movementSeries[i].time - movementSeries[i - 1].time;

    if (dt > 0) {
      const distance = Math.hypot(dx, dy);
      const speed = distance / dt;
      speedSeries.push(speed);
    }
  }

  const baseResult = TouchTracker.analyze({
    duration,
    verticalMovements,
    totalDisplacementY,
    speedSeries,
    movementSeries,
  });

  const verticalScore = calculateVerticalScore(baseResult.verticalMovements);
  const verticalCount = baseResult.verticalMovements.length;

  const result = {
    ...baseResult,
    verticalScore,
    verticalCount,
  };

  // Clear recorded movement data after analysis
  verticalMovements = [];
  movementSeries = [];
  lastY = 0;

  label.innerHTML = `<div class="loading-spinner"></div>`;

  const backendDelay = 500 + Math.random() * 1000;
  await new Promise((res) => setTimeout(res, backendDelay));

  const backendResult = await sendToBackendData("touch", result);

  if (!backendResult || !backendResult.status) {
    label.innerHTML = `
      <div style="color: orange; font-size: 20px; font-weight: bold;">
        Server unreachable. Try again later.
      </div>`;
    return;
  }

  if (backendResult.status === "banned") {
    label.innerHTML = `
      <div style="color: red; font-size: 20px; font-weight: bold;">
        Banned by server
      </div>`;
    track.style.display = "none";
  } else {
    label.innerHTML = `
      <div style="color: green; font-size: 20px; font-weight: bold;">
        Verified
      </div>`;
    track.style.display = "none";
  }
});
