// checkboxGenerator.js

// Generates a group of checkboxes: 4 fake ones and 1 real checkbox inserted at a random position
export function createCheckBoxes() {
  let checkboxes = [];

  // Create 4 fake checkboxes (not interactive)
  for (let i = 0; i < 4; i++) {
    let fakeBox = document.createElement("input");
    fakeBox.type = "checkbox";
    fakeBox.classList.add("checkbox-box", "fake-checkbox"); // Style class to identify fake checkboxes
    checkboxes.push(fakeBox);
  }

  // Create the real interactive checkbox
  let realBox = document.createElement("input");
  realBox.type = "checkbox";
  realBox.classList.add("checkbox-box", "real-checkbox"); // Style class to identify the real checkbox

  // Randomly select a central position (not first or last) for the real checkbox
  let possiblePositions = [1, 3];
  let insertIndex =
    possiblePositions[Math.floor(Math.random() * possiblePositions.length)];

  // Insert the real checkbox at the selected position
  checkboxes.splice(insertIndex, 0, realBox);

  // Return all checkboxes (fake + real), and a reference to the real one
  return {
    all: checkboxes, // Array of all generated checkboxes
    real: realBox    // Reference to the actual (correct) checkbox
  };
}

// Utility function to regenerate and reshuffle the checkboxes inside a container
// Useful when user retries or fails verification
export function shuffleCheckBoxes(container) {
  const result = createCheckBoxes();
  container.innerHTML = ""; // Clear existing checkboxes
  result.all.forEach((box) => container.appendChild(box)); // Add new ones
  return result.real; // Return reference to the real checkbox
}
