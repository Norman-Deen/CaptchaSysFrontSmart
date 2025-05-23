// MouseTracker.js

/* Mouse movement tracking object for CAPTCHA interaction */
export const MouseTracker = {
  // General state variables
  entryTime: null,           // Timestamp when the user entered the CAPTCHA box
  speedLog: [],              // Stores recent speed values of the mouse
  maxSpeed: 0,               // Maximum speed reached during tracking
  suddenStopCount: 0,       // Counts how many sudden stops the user made
  trackingActive: false,    // Whether tracking is currently active

  // Called when the user enters the CAPTCHA area
  startTracking(event) {
    this.entryTime = Date.now();  // Start time
    this.speedLog = [];           // Clear previous speeds
    this.maxSpeed = 0;
    this.suddenStopCount = 0;
    this.trackingActive = true;
  },

  // Called on every mouse movement while inside the CAPTCHA area
  trackMovement(event) {
    if (!this.trackingActive) return;

    let dx = event.movementX;
    let dy = event.movementY;
    let speed = Math.sqrt(dx * dx + dy * dy); // Calculate instantaneous speed

                     // Optional log (commented): console.log("speed:", speed);

    if (speed > 0.5) {
      // Filter out small, meaningless movements
      this.speedLog.push(speed);

      if (speed > this.maxSpeed) this.maxSpeed = speed;

      // Check if there was a sudden drop in speed
      if (
        this.speedLog.length > 1 &&
        this.speedLog[this.speedLog.length - 2] > 0.8 &&
        speed < 0.1
      ) {
        this.suddenStopCount++;
      }

      // Limit the log to last 10 movements
      if (this.speedLog.length > 10) this.speedLog.shift();
    }
  },

  // Called when the user clicks inside the CAPTCHA
  handleClick(event) {
    if (!this.trackingActive || this.speedLog.length < 5) return null;

    let clickTime = Date.now();
    let movementTime = clickTime - this.entryTime;

    let lastSpeed = this.speedLog.at(-1) || 0;

    // Calculate deceleration rate from recent speeds
    let lastSpeeds = this.speedLog.slice(-5);
    let avgLastSpeed =
      lastSpeeds.length > 0
        ? lastSpeeds.reduce((a, b) => a + b, 0) / lastSpeeds.length
        : 0;

    let decelerationRate =
      avgLastSpeed > 0 ? (avgLastSpeed - lastSpeed) / avgLastSpeed : 0;
    decelerationRate = Math.max(0, parseFloat(decelerationRate.toFixed(2)));

    // Calculate speed variance (for stability analysis)
    let meanSpeed =
      this.speedLog.length > 0
        ? this.speedLog.reduce((a, b) => a + b, 0) / this.speedLog.length
        : 0;

    let variance =
      this.speedLog.length > 1
        ? this.speedLog.reduce((sum, s) => sum + Math.pow(s - meanSpeed, 2), 0) / this.speedLog.length
        : 0;

    let speedStability = parseFloat(Math.sqrt(variance).toFixed(2));

    // Analyze movement pattern
    let movementPattern = "normal";
    if (speedStability < 0.1) movementPattern = "too stable";
    else if (speedStability > 2.0) movementPattern = "chaotic";

    // Default behavior classification
    let behaviorType = "human";

    // Evaluate how suspicious the behavior is
    let suspiciousScore = 0;
    if (movementTime < 200) suspiciousScore++;
    if (speedStability < 0.1) suspiciousScore++;
    if (decelerationRate < 0.2) suspiciousScore++;
    if (this.suddenStopCount > 3) suspiciousScore++;

    if (suspiciousScore >= 2) {
      behaviorType = "robot";
    }

    // Construct the final output object
    let jsonData = {
      maxSpeed: parseFloat(this.maxSpeed.toFixed(2)),
      lastSpeed: parseFloat(lastSpeed.toFixed(2)),
      speedStability,
      movementTime,
      // behaviorType, // Uncomment if backend expects it
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      speedSeries: this.speedLog.slice(-10),
    };

    this.trackingActive = false;
    this.speedLog = [];

    return jsonData;
  },
};
