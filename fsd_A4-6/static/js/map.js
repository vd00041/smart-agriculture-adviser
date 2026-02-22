document.addEventListener("DOMContentLoaded", function () {

  const API_KEY = "923ce0c07c43da0d4cfc126773f61ae5";

  const gujaratBounds = [[20.0, 68.0],[24.7, 74.5]];

  const map = L.map("map", {
    maxBounds: gujaratBounds,
    minZoom: 6
  }).fitBounds(gujaratBounds);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  /* =========================
     🔍 SEARCH WITH SUGGESTIONS
  ========================= */

  const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    suggestMinLength: 2,
    geocoder: L.Control.Geocoder.nominatim({
      geocodingQueryParams: {
        countrycodes: "in"
      }
    })
  }).addTo(map);

  geocoder.on("markgeocode", function(e) {
    const latlng = e.geocode.center;
    map.setView(latlng, 13);
    setMarker(latlng.lat, latlng.lng);
  });

  

  let marker = null;
  let selectedLocation = null;
  let lastAnalysis = null;

  const analyzeBtn = document.getElementById("analyzeBtn");
  const resultCard = document.getElementById("resultCard");
  const openSaveModal = document.getElementById("openSaveModal");
  const saveFarmBtn = document.getElementById("saveFarmBtn");

  const farmModal = new bootstrap.Modal(document.getElementById("farmModal"));
  const toastEl = document.getElementById("successToast");
  const toast = new bootstrap.Toast(toastEl);

  analyzeBtn.disabled = true;
  openSaveModal.disabled = true;

  /* =========================
     AUTO CURRENT LOCATION
  ========================= */

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const {latitude, longitude} = pos.coords;
      setMarker(latitude, longitude);
      map.setView([latitude, longitude], 12);
    });
  }

  /* =========================
     CLICK TO PLACE PIN
  ========================= */

  map.on("click", e => {
    setMarker(e.latlng.lat, e.latlng.lng);
  });

  function setMarker(lat, lng) {

    selectedLocation = {lat, lng};

    if (marker) map.removeLayer(marker);

    marker = L.marker([lat, lng]).addTo(map);

    analyzeBtn.disabled = false;
    openSaveModal.disabled = true;
  }

  /* =========================
      ANALYZE LOCATION
  ========================= */

  analyzeBtn.addEventListener("click", async () => {

    if (!selectedLocation) return;

    resultCard.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-success"></div>
        <p class="mt-2">Analyzing weather...</p>
      </div>
    `;
    resultCard.classList.add("show");

    try {

      const weather = await getWeather(selectedLocation.lat, selectedLocation.lng);
      const soil = inferSoil(selectedLocation.lat, selectedLocation.lng);
      const crops = recommend(weather);

      lastAnalysis = {weather, soil, crops};

      resultCard.innerHTML = `
        <h5>Estimated Soil: ${soil}</h5>
        <p><b>Temperature:</b> ${weather.main.temp}°C</p>
        <p><b>Humidity:</b> ${weather.main.humidity}%</p>
        <hr>
        <h6>Top Crops:</h6>
        <ul>
          ${crops.map(c=>`<li>${c.name} ⭐ ${c.rating}/10</li>`).join("")}
        </ul>
      `;

      openSaveModal.disabled = false;

    } catch (error) {

      resultCard.innerHTML = `
        <div class="text-danger">
          Failed to fetch weather data. Check API key.
        </div>
      `;
    }
  });

  /* =========================
      OPEN MODAL
  ========================= */

  openSaveModal.addEventListener("click", () => {
    farmModal.show();
  });

  /* =========================
     SAVE FARM
  ========================= */

  saveFarmBtn.addEventListener("click", () => {

    const name = document.getElementById("farmNameInput").value.trim();
    if (!name || !lastAnalysis) return;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;

    const key = `farms_${user.email}`;
    const farms = JSON.parse(localStorage.getItem(key)) || [];

    farms.push({
      id: Date.now(),
      name,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      soil: lastAnalysis.soil,
      weather: {
        temp: lastAnalysis.weather.main.temp,
        humidity: lastAnalysis.weather.main.humidity
      },
      crops: lastAnalysis.crops,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(key, JSON.stringify(farms));

    farmModal.hide();
    document.getElementById("farmNameInput").value = "";

    toast.show();
  });

  /* =========================
     WEATHER API
  ========================= */

  async function getWeather(lat, lon) {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Weather API failed");
    }

    return await response.json();
  }

  /* =========================
     SOIL ESTIMATION
  ========================= */

  function inferSoil(lat, lng) {
    if (lat >= 23.0) return "Sandy";
    if (lng <= 70.5) return "Black";
    if (lat <= 21.5) return "Clay";
    return "Loamy";
  }

  /* =========================
    CROP RECOMMENDATION
  ========================= */

  function recommend(weather) {

    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const month = new Date().getMonth() + 1;

    let season = "zaid";
    if (month >= 6 && month <= 10) season = "kharif";
    else if (month >= 11 || month <= 3) season = "rabi";

    const rules = [
      {name:"Rice",t:[22,35],h:70,s:["kharif"]},
      {name:"Wheat",t:[10,25],h:40,s:["rabi"]},
      {name:"Cotton",t:[21,35],h:50,s:["kharif"]},
      {name:"Millet",t:[20,35],h:30,s:["kharif","zaid"]}
    ];

    return rules.map(c=>{
      let score=0;
      if(temp>=c.t[0] && temp<=c.t[1]) score+=5;
      if(humidity>=c.h) score+=3;
      if(c.s.includes(season)) score+=2;
      return {name:c.name,rating:score};
    }).sort((a,b)=>b.rating-a.rating).slice(0,3);
  }

});
