let webcam, labelContainer;
let saveDB = false;
let cameraActive = false;
const clearButton = document.getElementById('stop-button');
async function initCamera() {
  cameraActive = true;
  const webcamContainer = document.getElementById('webcam-container');
  webcamContainer.innerHTML = ''; // รีเซ็ตกล้อง
  labelContainer = document.getElementById('label-container');
  labelContainer.innerHTML = ''; // รีเซ็ตผลลัพธ์
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }

  // เพิ่มสปินเนอร์ขณะโหลดกล้อง
  const loadingSpinner = document.createElement('div');
  loadingSpinner.classList.add('spinner-border', 'text-primary', 'mt-3');
  webcamContainer.appendChild(loadingSpinner);

  try {
    // ตั้งค่ากล้อง
    const flip = true;
    webcam = new tmImage.Webcam(500, 500, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loopCamera);

    webcamContainer.appendChild(webcam.canvas); // แสดงผลกล้อง
    loadingSpinner.remove(); // ลบสปินเนอร์เมื่อกล้องพร้อม
    clearButton.classList.remove('d-none');
  } catch (error) {
    console.error('Error initializing camera:', error);
    alert('ไม่สามารถเปิดกล้องได้');
    loadingSpinner.remove();
  }
}

async function loopCamera() {
  if (!cameraActive) {
    document.getElementById('label-container').innerHTML = '';
    return;
  }
  webcam.update();
  await predictFromCamera(); // ทำนายจากกล้อง
  window.requestAnimationFrame(loopCamera);
}

async function predictFromCamera() {
  const prediction = await model.predict(webcam.canvas);
  labelContainer.innerHTML = ''; // รีเซ็ตผลลัพธ์

  // ค้นหาค่าความน่าจะเป็นสูงสุด
  let highestPrediction = { className: '', probability: 0 };

  prediction.forEach((p) => {
    if (p.probability > highestPrediction.probability) {
      highestPrediction = p;
    }
  });

  // แสดงผลตามประเภทของน้ำ
  let resultMessage = '';
  if (highestPrediction.className === 'Clean water' && highestPrediction.probability > minimumPrediction) {
    resultMessage = 'น้ำสะอาด';
    saveDB = false;
  } else if (highestPrediction.className === 'Dirty water' && highestPrediction.probability > minimumPrediction) {
    resultMessage = 'น้ำสกปรก';
    if (!saveDB) {
      AddBadWater('แม่น้ำปิง', resultMessage);
      saveDB = true;
    }
  } else if (highestPrediction.className === 'Not water' && highestPrediction.probability > minimumPrediction) {
    resultMessage = 'ไม่เกี่ยวข้อง';
  } else {
    resultMessage = 'ไม่สามารถระบุได้';
  }

  const resultDiv = document.createElement('div');
  resultDiv.innerText = `ผลการตรวจสอบ: ${resultMessage}`;
  labelContainer.appendChild(resultDiv); // เพิ่มผลลัพธ์ลงใน div
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = document.createElement('div');
    classPrediction.innerText = `${prediction[i].className} : ${prediction[i].probability.toFixed(2)} `;
    labelContainer.appendChild(classPrediction);
  }
}

function startCamera() {
  document.getElementById('upload-container').classList.add('d-none');
  document.getElementById('webcam-container').classList.remove('d-none');
  initCamera();
}
function stopCamera() {
  cameraActive = false;
  document.getElementById('webcam-container').classList.add('d-none');
  clearButton.classList.add('d-none');
}
