document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("Please login");
    window.location.href = "login.html";
    return;
  }

  const farms = JSON.parse(
    localStorage.getItem(`farms_${user.email}`)
  ) || [];

  document.getElementById("userName").innerText = user.name || "User";
  document.getElementById("userEmail").innerText = user.email;

  if (farms.length === 0) {
    document.getElementById("overallMessage").innerText =
      "No farms added yet. Add a farm from the map.";
    return;
  }

  /* ======================
     TOTAL FARMS
  ====================== */
  document.getElementById("totalFarms").innerText = farms.length;

  /* ======================
     SOIL DISTRIBUTION
  ====================== */
  const soilCount = {};
  farms.forEach(f => {
    soilCount[f.soil] = (soilCount[f.soil] || 0) + 1;
  });

  const dominantSoil = Object.entries(soilCount)
    .sort((a, b) => b[1] - a[1])[0][0];

  document.getElementById("dominantSoil").innerText = dominantSoil;

  /* ======================
     CROPS ANALYSIS
  ====================== */
  const cropFreq = {};
  const cropRatings = {};

  farms.forEach(farm => {
    farm.crops.forEach(crop => {
      cropFreq[crop.name] = (cropFreq[crop.name] || 0) + 1;

      if (!cropRatings[crop.name]) {
        cropRatings[crop.name] = [];
      }
      cropRatings[crop.name].push(parseFloat(crop.rating));
    });
  });

  const mostRecommendedCrop = Object.entries(cropFreq)
    .sort((a, b) => b[1] - a[1])[0][0];

  document.getElementById("topCrop").innerText = mostRecommendedCrop;

  let bestCrop = "";
  let bestAvg = 0;

  Object.keys(cropRatings).forEach(crop => {
    const avg =
      cropRatings[crop].reduce((a, b) => a + b, 0) /
      cropRatings[crop].length;

    if (avg > bestAvg) {
      bestAvg = avg;
      bestCrop = crop;
    }
  });

  document.getElementById("bestCrop").innerText =
    `${bestCrop} (${bestAvg.toFixed(1)}/10)`;

  /* ======================
     CLIMATE RANGE
  ====================== */
  const temps = farms.map(f => f.weather.temp);
  const humidity = farms.map(f => f.weather.humidity);

  document.getElementById("tempRange").innerText =
    `${Math.min(...temps)}°C – ${Math.max(...temps)}°C`;

  document.getElementById("humidityRange").innerText =
    `${Math.min(...humidity)}% – ${Math.max(...humidity)}%`;

  /* ======================
     FARM CARDS
  ====================== */
  const farmList = document.getElementById("farmList");

  farmList.innerHTML = farms.map(farm => `
    <div class="col-md-4">
      <div class="card p-3 h-100">
        <h5>${farm.name}</h5>
<p><b>Lat:</b> ${farm.lat.toFixed(3)}</p>
<p><b>Lng:</b> ${farm.lng.toFixed(3)}</p>

        <p class="mb-1"><b>Soil:</b> ${farm.soil}</p>
        <p class="mb-1">
          <b>Top Crop:</b> ${farm.crops[0]?.name}
          (${farm.crops[0]?.rating}/10)
        </p>
        <p class="small text-muted">
          Analysed: ${new Date(farm.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  `).join("");

});
