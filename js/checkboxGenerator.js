// checkboxGenerator.js

// Generate checkboxes: 4 fake + 1 real placed at a random position
export function createCheckBoxes() {
  let checkboxes = [];

  // Create 4 fake checkboxes (inactive)
  for (let i = 0; i < 4; i++) {
    let fakeBox = document.createElement("input");
    fakeBox.type = "checkbox";
    fakeBox.classList.add("hidden-checkbox"); // Add class to hide via CSS
    checkboxes.push(fakeBox);
  }

  // Create the real checkbox (the one to be correctly clicked)
  let realBox = document.createElement("input");
  realBox.type = "checkbox";
  realBox.classList.add("hidden-checkbox");

  // (For testing only): Highlight the real box with a green outline
  realBox.style.outline = "2px solid limegreen";

  // Choose a random position in the array (not on the edges) for the real box
  let possiblePositions = [1, 3];
  let insertIndex =
    possiblePositions[Math.floor(Math.random() * possiblePositions.length)];

  // Insert the real box at the chosen position
  checkboxes.splice(insertIndex, 0, realBox);

  // Return all checkboxes + the real one separately
  return {
    all: checkboxes, // All checkboxes (fake + real)
    real: realBox,   // Reference to the real one
  };
}

// Regenerate checkboxes inside a container (useful for retry)
export function shuffleCheckBoxes(container) {
  const result = createCheckBoxes();
  container.innerHTML = "";
  result.all.forEach((box) => container.appendChild(box));
  return result.real;
}
