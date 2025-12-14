import { initialize, startDetection, onResult } from "./caed.js";

const initBtn = document.getElementById("initBtn");
const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");
const outputPre = document.getElementById("output");

// Initialize button
initBtn.addEventListener("click", async () => {
  statusDiv.textContent = "Status: Initializing...";
  const ok = await initialize();

  if (ok) {
    statusDiv.textContent = "Status: Ready (real model loaded)";
    startBtn.disabled = false;
  } else {
    statusDiv.textContent = "Status: Initialization failed";
  }
});

// Start detection button
startBtn.addEventListener("click", () => {
  statusDiv.textContent = "Status: Detecting (REAL emotions)...";
  startDetection();
});

// Receive emotion results
onResult((result) => {
  outputPre.textContent = JSON.stringify(result, null, 2);
});
