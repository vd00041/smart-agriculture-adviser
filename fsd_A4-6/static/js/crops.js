const crops = [
  {
    name: "Wheat",
    season: "Rabi",
    soil: "Loamy soil",
    water: "Medium irrigation",
    market: "Stable demand, MSP supported",
    trend: "up",
    description: "Wheat performs best in cool climates with controlled irrigation and fertile loamy soil."
  },
  {
    name: "Rice",
    season: "Kharif",
    soil: "Clayey soil",
    water: "High water requirement",
    market: "High demand, MSP supported",
    trend: "up",
    description: "Rice requires flooded fields and consistent rainfall during the growing season."
  },
  {
    name: "Maize",
    season: "Kharif",
    soil: "Well-drained soil",
    water: "Medium",
    market: "Price fluctuating",
    trend: "down",
    description: "Maize grows well in warm temperatures with good sunlight and moderate rainfall."
  },
  {
    name: "Cotton",
    season: "Kharif",
    soil: "Black soil",
    water: "Medium to high",
    market: "Export dependent, volatile",
    trend: "down",
    description: "Cotton prefers warm climate and black soil with long frost-free periods."
  },
  {
    name: "Sugarcane",
    season: "Annual",
    soil: "Deep fertile soil",
    water: "High",
    market: "Stable industrial demand",
    trend: "up",
    description: "Sugarcane is a long-duration crop requiring heavy irrigation and fertile soil."
  },
  {
    name: "Groundnut",
    season: "Kharif",
    soil: "Sandy loam",
    water: "Low to medium",
    market: "Oilseed demand stable",
    trend: "up",
    description: "Groundnut grows best in sandy loam soil with low water requirement."
  },
  {
    name: "Soybean",
    season: "Kharif",
    soil: "Well-drained black soil",
    water: "Medium",
    market: "High processing demand",
    trend: "up",
    description: "Soybean requires warm weather and is sensitive to waterlogging."
  },
  {
    name: "Mustard",
    season: "Rabi",
    soil: "Alluvial soil",
    water: "Low",
    market: "Oilseed MSP supported",
    trend: "up",
    description: "Mustard is a short-duration rabi crop with low water requirement."
  },
  {
    name: "Bajra (Pearl Millet)",
    season: "Kharif",
    soil: "Sandy soil",
    water: "Low",
    market: "Stable rural demand",
    trend: "up",
    description: "Bajra is drought-resistant and suitable for arid and semi-arid regions."
  },
  {
    name: "Jowar (Sorghum)",
    season: "Kharif",
    soil: "Loamy soil",
    water: "Low to medium",
    market: "Moderate demand",
    trend: "stable",
    description: "Jowar is a hardy crop tolerant to drought and poor soil conditions."
  },
  {
    name: "Potato",
    season: "Rabi",
    soil: "Sandy loam",
    water: "Medium",
    market: "Highly price sensitive",
    trend: "down",
    description: "Potato requires cool climate and well-drained loose soil."
  },
  {
    name: "Tomato",
    season: "Zaid",
    soil: "Fertile loam",
    water: "Medium",
    market: "Highly volatile",
    trend: "down",
    description: "Tomato prices fluctuate heavily due to seasonal overproduction."
  }
];


const grid = document.getElementById("cropGrid");
const search = document.getElementById("searchInput");
const filter = document.getElementById("seasonFilter");

function render(list){
  grid.innerHTML="";
  list.forEach(c=>{
    grid.innerHTML+=`
    <div class="col-md-4 mb-4">
      <div class="card crop-card p-3" onclick="openModal('${c.name}')">
        <h5>${c.name}</h5>
        <span class="badge badge-trend ${c.trend}">
  Market ${c.trend === "up"
    ? "Up"
    : c.trend === "down"
    ? "Down"
    : "Stable"}
</span>
        <p class="mt-2 text-muted">Season: ${c.season}</p>
      </div>
    </div>`;
  });
}

function openModal(name){
  const c = crops.find(x=>x.name===name);
  document.getElementById("modalTitle").innerText = c.name;
  document.getElementById("modalDesc").innerText = c.description;
  document.getElementById("modalSoil").innerText = "Soil: " + c.soil;
  document.getElementById("modalWater").innerText = "Water: " + c.water;
  document.getElementById("modalSeason").innerText = "Season: " + c.season;
  document.getElementById("modalMarket").innerText = "Market: " + c.market;
  new bootstrap.Modal(document.getElementById("cropModal")).show();
}

search.oninput = filter.onchange = () => {
  const q = search.value.toLowerCase();
  const s = filter.value;
  render(crops.filter(c =>
    c.name.toLowerCase().includes(q) &&
    (s==="" || c.season===s)
  ));
};

render(crops);
