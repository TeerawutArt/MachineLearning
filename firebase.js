const firebaseConfig = {
  databaseURL:
    'https://waterqualityml-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'waterqualityml',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
}
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour12: false, // ใช้เวลา 24 ชั่วโมง
  });
}
const waterBadQualityRef = db.ref('badWaters/');

function AddBadWater(loc, quality) {
  const formattedDate = formatDate(Date.now());
  const formattedTime = formatTime(Date.now());
  const newBadWaterRef = waterBadQualityRef.push();

  newBadWaterRef
    .set({
      location: loc,
      date: formattedDate,
      time: formattedTime,
      waterQuality: quality,
    })
    .then(() => {
      console.log('Data saved');
    })
    .catch((error) => {
      console.error('Error saving data:', error);
    });
}

window.AddBadWater = AddBadWater;
