let model, maxPredictions;
const modelURL = 'model/model.json';
const metadataURL = 'model/metadata.json';
const minimumPrediction = 0.7;
let resultMessage = '';

// โหลดโมเดล
async function loadModel() {
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  console.log('Model Loaded');
}
loadModel(); // โหลดโมเดลตั้งแต่เริ่มต้น
