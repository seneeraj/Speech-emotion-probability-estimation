// ==========================================================
// CAED – Client-Side Audio Emotion Detector (REAL MODEL)
// ==========================================================

let audioContext;
let analyser;
let freqBuffer;
let model;
let resultCallback = null;
let detectionInterval = null;

// Emotion label order (MUST match Python LabelEncoder)
const EMOTIONS = ["angry", "calm", "happy", "sad"];

// ----------------------------------------------------------
// INITIALIZE
// ----------------------------------------------------------
export async function initialize() {
  try {
    console.log("Initializing CAED...");

    const basePath = window.location.pathname.endsWith("/")
      ? window.location.pathname
      : window.location.pathname + "/";

    model = await tf.loadGraphModel(basePath + "model/model.json");
    console.log("Model loaded");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    freqBuffer = new Float32Array(analyser.frequencyBinCount);

    console.log("Microphone ready");
    return true;

  } catch (err) {
    console.error("Initialization failed:", err);
    alert("Initialization failed: " + err.message);
    return false;
  }
}


// ----------------------------------------------------------
// FEATURE NORMALIZATION (matches Python StandardScaler)
// ----------------------------------------------------------
function normalize(features) {
  const mean = features.reduce((a, b) => a + b, 0) / features.length;
  const std = Math.sqrt(
    features.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / features.length
  );
  return features.map(x => (x - mean) / (std + 1e-6));
}

// ----------------------------------------------------------
// START DETECTION
// ----------------------------------------------------------
export function startDetection() {
  if (!model || !analyser) {
    console.warn("CAED not initialized");
    return;
  }

  detectionInterval = setInterval(async () => {
    analyser.getFloatFrequencyData(freqBuffer);

    // Take first 13 bins as MFCC-like proxy
    let features = Array.from(freqBuffer.slice(0, 13));
    features = normalize(features);

    // Convert to Tensor
    const input = tf.tensor2d([features]);

    // Predict
    const output = model.execute({ "keras_tensor_5": input });
    const probs = output.dataSync();

    // Cleanup tensors
    tf.dispose([input, output]);

    // Build JSON output
    const result = { timestamp: Date.now() };
    EMOTIONS.forEach((emo, i) => {
      result[emo] = probs[i];
    });

    if (resultCallback) resultCallback(result);

  }, 1000);
}

// ----------------------------------------------------------
// STOP DETECTION
// ----------------------------------------------------------
export function stopDetection() {
  if (detectionInterval) clearInterval(detectionInterval);
}

// ----------------------------------------------------------
// REGISTER CALLBACK
// ----------------------------------------------------------
export function onResult(cb) {
  resultCallback = cb;
}


