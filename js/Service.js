// 📁 Service.js

//  Function to check if the click was too fast (less than 300ms)
// Used to detect suspicious behavior, as bots often click very fast.
export function isClickTooFast(timeDiff) {
  // If time between clicks is too short, it's flagged as likely a bot.
  return timeDiff !== null && timeDiff < 300;
}

// Used to detect unrealistic precision — a sign of robotic clicking.
export function isCenterClick(diffX, diffY, tolerance = 1) {
  // If the click is too close to the center, it’s considered too perfect.
  return diffX < tolerance && diffY < tolerance;
}

// Display a message in the captcha box area
// Used to inform the user about their status (ban, retry, etc.)
export function updateCaptchaBox(message, color = "black") {
  const checkboxContainer = document.getElementById("checkbox-container");
  if (!checkboxContainer) return;

  checkboxContainer.innerHTML = `
    <div style="color: ${color}; font-size: 20px; font-weight: bold;">
      ${message}
    </div>`;
}

// Disable the entire CAPTCHA interaction
// Used when the user is permanently banned.
export function disableCaptcha() {
  updateCaptchaBox("🚫 You have been permanently banned.", "red");
  const checkboxContainer = document.getElementById("checkbox-container");
  if (checkboxContainer) checkboxContainer.style.pointerEvents = "none";
}

// Start temporary ban countdown with a timer
// Disables interaction for a few seconds before allowing retries.
// Accepts an optional callback to run after the timer ends.
export function startBanTimer(seconds, onEnd = null) {
  const checkboxContainer = document.getElementById("checkbox-container");
  if (!checkboxContainer) return;

  checkboxContainer.style.pointerEvents = "none";
  updateCaptchaBox(`⏳ ${seconds}`, "orange");

  const interval = setInterval(() => {
    seconds--;
    updateCaptchaBox(`⏳ ${seconds}`, "orange");

    if (seconds < 0) {
      clearInterval(interval);
      checkboxContainer.style.pointerEvents = "auto";
      updateCaptchaBox("🔄 You can try again.", "green");
      if (onEnd) onEnd();
    }
  }, 1000);
}

// Toggle visibility of fake checkboxes
// Used for debugging or visual indication; shows/hides decoy boxes.
export function toggleFakeBoxes() {
  if (!window.fakeBoxes) return;
  window.fakeBoxes.forEach(box => {
    box.style.display = (box.style.display === "none") ? "inline-block" : "none";
  });
}
