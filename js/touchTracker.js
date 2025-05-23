// TouchTracker.js

export const TouchTracker = {
  // Analyze user touch behavior and classify as "human" or "robot"
  analyze({ duration, verticalMovements, totalDisplacementY, speedSeries }) {
    const avgSpeed = this.getAverage(speedSeries);
    const stdSpeed = this.getStd(speedSeries, avgSpeed);
    const verticalCount = verticalMovements?.length || 0;

    // Analyze acceleration changes: how often speed direction shifts
    let accelerationChanges = 0;
    for (let i = 2; i < speedSeries.length; i++) {
      const prev = speedSeries[i - 1] - speedSeries[i - 2];
      const curr = speedSeries[i] - speedSeries[i - 1];
      if ((prev > 0 && curr < 0) || (prev < 0 && curr > 0)) {
        accelerationChanges++;
      }
    }

    // Evaluate suspicious indicators
    let suspiciousScore = 0;
    let reasons = [];

    if (duration < 300) {
      suspiciousScore++;
      reasons.push("Too fast");
    }

    if (avgSpeed > 0.9) {
      suspiciousScore++;
      reasons.push("High avg speed");
    }

    if (stdSpeed < 0.05) {
      suspiciousScore++;
      reasons.push("Speed too stable");
    }

    if (verticalCount < 2 && totalDisplacementY < 2) {
      suspiciousScore++;
      reasons.push("No vertical movement");
    }

    if (speedSeries.length < 10) {
      suspiciousScore++;
      reasons.push("Insufficient data");
    }

    if (accelerationChanges < 5) {
      suspiciousScore++;
      reasons.push("Not enough acceleration variation");
    }

    // Final classification
    const behaviorType = suspiciousScore >= 2 ? "robot" : "human";

    // Return the result object
    return {
      behaviorType,
      suspiciousScore,
      reasons,
      duration,
      avgSpeed: parseFloat(avgSpeed.toFixed(4)),
      stdSpeed: parseFloat(stdSpeed.toFixed(4)),
      accelerationChanges,
      verticalCount,
      totalDisplacementY: parseFloat(totalDisplacementY.toFixed(2)),
      speedSeries: speedSeries.slice(-10), // only keep recent movements
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,

      verticalMovements, // needed for scoring and feedback
    };
  },

  // Calculate average of array
  getAverage(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  },

  // Calculate standard deviation of array
  getStd(arr, mean) {
    if (!arr || arr.length === 0) return 0;
    const variance =
      arr.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  },
};
