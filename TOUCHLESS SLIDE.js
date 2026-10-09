let imageModelURL = 'https://teachablemachine.withgoogle.com/models/PASTE_YOUR_MODEL_ID_HERE/';

let classifier, video, label = "Standby", confidence = 0.0;
let currentSlide = 1;
let totalSlides = 5;
let canChange = true;

function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', video, () => classifyVideo());
}

function classifyVideo() {
  classifier.classify(gotResult);
}

function gotResult(err, res) {
  if (!err && res.length > 0) {
    label = res[0].label;
    confidence = res[0].confidence;
    handleNavigation();
  }
  classifyVideo();
}

function handleNavigation() {
  if (confidence > 0.85 && canChange) {
    let cur = label.toLowerCase();
    if (cur.includes("up")) {
      currentSlide = min(totalSlides, currentSlide + 1);
      canChange = false;
      setTimeout(() => { canChange = true; }, 1200); // 1.2s debounce cooldown
    } else if (cur.includes("down")) {
      currentSlide = max(1, currentSlide - 1);
      canChange = false;
      setTimeout(() => { canChange = true; }, 1200);
    }
  }
}

function draw() {
  background(230);

  // Slide canvas display
  fill(255); noStroke(); rect(20, 20, width - 40, 340, 10);
  fill(40); textAlign(CENTER, CENTER); textSize(32);
  text("Slide " + currentSlide + " of " + totalSlides, width / 2, 100);
  textSize(20);
  text("📖 Touchless Content Card #" + currentSlide, width / 2, 180);

  // Mirrored camera pip preview
  push(); translate(width - 20, height - 140); scale(-1, 1);
  image(video, 0, 0, 150, 110);
  pop();

  // Bottom action bar
  fill(30); rect(0, 440, width, 80);
  fill(255); textSize(20); textAlign(LEFT, CENTER);
  text("Gesture: " + label + " (" + floor(confidence * 100) + "%)", 20, 480);
}
