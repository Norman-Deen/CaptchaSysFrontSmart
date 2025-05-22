// 📁 MouseTracker.js

/* Mouse movement tracking object for CAPTCHA interaction */
export const MouseTracker = {
  // General state variables
  entryTime: null,           // Time when the mouse entered the box
  speedLog: [],              // Recent speed values
  maxSpeed: 0,               // Highest speed recorded
  suddenStopCount: 0,        // Number of sudden stops detected
  trackingActive: false,     // Whether tracking is currently active

  // Triggered when user enters the box
  startTracking(event) {
    this.entryTime = Date.now(); // Record entry time
    this.speedLog = [];          // Reset speed log
    this.maxSpeed = 0;
    this.suddenStopCount = 0;
    this.trackingActive = true;
  },

  // Triggered on every mouse movement inside the box
  trackMovement(event) {
    if (!this.trackingActive) return;

    let dx = event.movementX;
    let dy = event.movementY;
    let speed = Math.sqrt(dx * dx + dy * dy); // Instantaneous speed

         //    console.log("🟡 speed:", speed);   // all speed record

    if (speed > 0.5) {
      // Ignore very small micro-movements
      this.speedLog.push(speed);

      if (speed > this.maxSpeed) this.maxSpeed = speed;

      // Detect sudden stop (from high to low)
      if (
        this.speedLog.length > 1 &&
        this.speedLog[this.speedLog.length - 2] > 0.8 &&
        speed < 0.1
      ) {
        this.suddenStopCount++;
      }

      // Keep only the last 10 speeds
      if (this.speedLog.length > 10) this.speedLog.shift();
    }
  },

  // Called on click to analyze movement data
  handleClick(event) {
    if (!this.trackingActive || this.speedLog.length < 5) return null;

    let clickTime = Date.now();
    let movementTime = clickTime - this.entryTime;

    let lastSpeed = this.speedLog.at(-1) || 0;

    // Deceleration calculation
    let lastSpeeds = this.speedLog.slice(-5);
    let avgLastSpeed =
      lastSpeeds.length > 0
        ? lastSpeeds.reduce((a, b) => a + b, 0) / lastSpeeds.length
        : 0;

    let decelerationRate =
      avgLastSpeed > 0 ? (avgLastSpeed - lastSpeed) / avgLastSpeed : 0;

    decelerationRate = Math.max(0, parseFloat(decelerationRate.toFixed(2)));

    // Speed consistency analysis
    let meanSpeed =
      this.speedLog.length > 0
        ? this.speedLog.reduce((a, b) => a + b, 0) / this.speedLog.length
        : 0;

    let variance =
      this.speedLog.length > 1
        ? this.speedLog.reduce(
            (sum, s) => sum + Math.pow(s - meanSpeed, 2),
            0
          ) / this.speedLog.length
        : 0;

    let speedStability = parseFloat(Math.sqrt(variance).toFixed(2));

    // Movement pattern classification
    let movementPattern = "normal";
    if (speedStability < 0.1) movementPattern = "too stable";
    else if (speedStability > 2.0) movementPattern = "chaotic";

    // Default behavior type
    let behaviorType = "human";

    // Suspicion logic
    let suspiciousScore = 0;
    if (movementTime < 200) suspiciousScore++;
    if (speedStability < 0.1) suspiciousScore++;
    if (decelerationRate < 0.2) suspiciousScore++;
    if (this.suddenStopCount > 3) suspiciousScore++;

    if (suspiciousScore >= 2) {
      behaviorType = "robot";
    }

    // Final result object
    let jsonData = {
      maxSpeed: parseFloat(this.maxSpeed.toFixed(2)),
      lastSpeed: parseFloat(lastSpeed.toFixed(2)),
      speedStability,
      movementTime,
      // behaviorType, // You can include this field if needed
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      speedSeries: this.speedLog.slice(-10),
    };

    this.trackingActive = false;
    this.speedLog = [];

    return jsonData;
  },
};



