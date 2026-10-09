let audioModelURL = 'https://teachablemachine.withgoogle.com/models/PASTE_YOUR_MODEL_ID_HERE/';

let classifier, label = "Whistle to Tune", confidence = 0.0;
let meterValue = 50;

function preload() {
  classifier = ml5.soundClassifier(audioModelURL + 'model.json', { probabilityThreshold: 0.75 });
}

function setup() {
  createCanvas(640, 480);
  classifier.classify(gotResult);
}

function gotResult(err, res) {
  if (!err && res.length > 0) {
    label = res[0].label;
    confidence = res[0].confidence;
    let sound = label.toLowerCase();
    if (sound.includes("high")) meterValue = min(100, meterValue + 10);
    if (sound.includes("low")) meterValue = max(0, meterValue - 10);
  }
}

function draw() {
  background(30);

  // Meter container
  fill(50); rect(120, 200, 400, 40, 6);
  // Meter fill
  fill(0, 180, 255); rect(120, 200, map(meterValue, 0, 100, 0, 400), 40, 6);

  fill(255); textAlign(CENTER, CENTER); textSize(32);
  text("🎚️ Level: " + meterValue + "%", width / 2, 140);
  textSize(20);
  text("Acoustic Input: " + label + " (" + floor(confidence * 100) + "%)", width / 2, 340);
}
