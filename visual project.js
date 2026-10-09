let imageModelURL = 'https://teachablemachine.withgoogle.com/models/PASTE_YOUR_MODEL_ID_HERE/';

let classifier, video, label = "Scanning...", confidence = 0.0;

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
  }
  classifyVideo();
}

function draw() {
  background(20);
  push(); translate(width, 0); scale(-1, 1);
  image(video, 0, 0, width, 440);
  pop();

  fill(30); noStroke(); rect(0, 440, width, 80);
  fill(255); textSize(20); textAlign(LEFT, CENTER);
  text("Item: " + label, 20, 480);
  textAlign(RIGHT, CENTER);
  text("Confidence: " + floor(confidence * 100) + "%", width - 20, 480);

  if (confidence > 0.80) {
    let item = label.toLowerCase();
    textAlign(CENTER, CENTER); textSize(26);
    if (item.includes("plastic")) {
      fill(240, 180, 0, 180); rect(0, 360, width, 80);
      fill(0); text("🟡 YELLOW BIN: PLASTIC CONTAINER", width / 2, 400);
    } else if (item.includes("paper")) {
      fill(0, 140, 255, 180); rect(0, 360, width, 80);
      fill(255); text("🔵 BLUE BIN: PAPER / CARDBOARD", width / 2, 400);
    } else if (item.includes("metal")) {
      fill(180, 180, 180, 180); rect(0, 360, width, 80);
      fill(0); text("⚪ GREY BIN: SCRAP METAL / CAN", width / 2, 400);
    }
  }
}
