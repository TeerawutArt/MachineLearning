function loadData() {
  const tableContainer = document.getElementById('data-table');

  const ref = firebase.database().ref('badWaters/');
  ref.on('value', function (snapshot) {
    // ใช้ 'value' event เพื่อติดตามการเปลี่ยนแปลง
    const badWater = snapshot.val();
    console.log(badWater);
    tableContainer.innerHTML = ''; // เคลียร์ข้อมูลเก่า

    if (badWater) {
      Object.keys(badWater).forEach((key) => {
        const water = badWater[key];
        const row = document.createElement('div');
        row.classList.add('row', 'border-bottom', 'py-2', 'align-items-center');

        row.innerHTML = `
          <div class="col-2">${water.location}</div>
          <div class="col-2"><img src="https://via.placeholder.com/80" alt="${water.location}" class="img-fluid rounded" /></div>
          <div class="col-2">${water.date}</div>
          <div class="col-2">${water.time}</div>
          <div class="col-2">${water.waterQuality}</div>
          <div class="col-2"><button class="btn btn-sm btn-primary">ตรวจสอบ</button></div>
        `;

        tableContainer.appendChild(row);
      });
    } else {
      tableContainer.innerHTML = '<p>ไม่มีข้อมูลในฐานข้อมูล</p>';
    }
  });
}
window.onload = loadData;
