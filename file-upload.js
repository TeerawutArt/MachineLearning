async function processFile() {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  const uploadContainer = document.getElementById('upload-container');
  const labelContainer = document.getElementById('label-container');
  const clearButton = document.getElementById('clear-button'); // ปุ่มล้าง
  const uploadTextDetail = document.getElementById('upload-detail');

  if (!file) {
    alert('กรุณาเลือกไฟล์');
    return;
  }

  // แสดง progress bar และ spinner

  const loadingSpinner = document.createElement('div');
  loadingSpinner.classList.add('spinner-border', 'text-primary', 'mt-3');
  uploadContainer.appendChild(loadingSpinner);

  const canvas = document.getElementById('file-preview');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = async () => {
    try {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.classList.remove('d-none');
      ctx.drawImage(img, 0, 0);

      // Process the image with the model
      const prediction = await model.predict(canvas);
      labelContainer.innerHTML = ''; // Clear previous results

      // Find the highest prediction
      let highestPrediction = { className: '', probability: 0 };

      prediction.forEach((p) => {
        if (p.probability > highestPrediction.probability) {
          highestPrediction = p;
        }
      });

      // Show result based on prediction
      let resultMessage = '';
      if (
        highestPrediction.className === 'Clean water' &&
        highestPrediction.probability > minimumPrediction
      ) {
        resultMessage = 'น้ำสะอาด';
      } else if (
        highestPrediction.className === 'Dirty water' &&
        highestPrediction.probability > minimumPrediction
      ) {
        resultMessage = 'น้ำสกปรก';
      } else if (
        highestPrediction.className === 'Not water' &&
        highestPrediction.probability > minimumPrediction
      ) {
        resultMessage = 'ไม่เกี่ยวข้อง';
      } else {
        resultMessage = 'ไม่สามารถระบุได้';
      }

      const resultDiv = document.createElement('div');
      resultDiv.innerText = `ผลการตรวจสอบ: ${resultMessage}`;
      labelContainer.appendChild(resultDiv);
      loadingSpinner.remove(); // Remove spinner once processing is complete
      clearButton.classList.remove('d-none');
      uploadTextDetail.classList.add('d-none');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('เกิดข้อผิดพลาดในการประมวลผลไฟล์');
    }
  };

  img.src = URL.createObjectURL(file); // Load the selected file
}

function uploadFile() {
  document.getElementById('webcam-container').classList.add('d-none');
  document.getElementById('upload-container').classList.remove('d-none');
}

function clearUploadedImage() {
  const fileInput = document.getElementById('file-input');
  const canvas = document.getElementById('file-preview');
  const labelContainer = document.getElementById('label-container');
  const clearButton = document.getElementById('clear-button');

  // รีเซ็ตฟอร์มการอัปโหลดและแสดงปุ่มล้าง
  fileInput.value = ''; // รีเซ็ตฟอร์มเลือกไฟล์
  canvas.classList.add('d-none'); // ซ่อนแคนวาส
  labelContainer.innerHTML = ''; // ลบข้อความผลลัพธ์
  clearButton.classList.add('d-none'); // ซ่อนปุ่มล้าง
  uploadTextDetail.classList.remove('d-none');
}
