// ==================== LOAD CITIES FOR FILTER ====================

function loadCities() {
  const housesTab = getStoredData("houses");
  const cities = [];
  
  // Get unique cities
  for (let i = 0; i < housesTab.length; i++) {
    if (cities.indexOf(housesTab[i].cityName) === -1) {
      cities.push(housesTab[i].cityName);
    }
  }
  
  // Sort cities
  cities.sort();
  
  // Populate dropdown
  let options = '<option value="">All Cities</option>';
  for (let i = 0; i < cities.length; i++) {
    options += `<option value="${cities[i]}">${cities[i]}</option>`;
  }
  
  document.getElementById("cityFilter").innerHTML = options;
}

// ==================== DISPLAY ALL HOUSES (INITIAL) ====================

function displayAllHouses() {
  const housesTab = getStoredData("houses");
  const roomsTab = getStoredData("rooms");
  
  if (housesTab.length === 0) {
    document.getElementById("searchResultsDiv").innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-home fa-5x text-muted mb-3"></i>
        <h4>No houses available</h4>
        <p class="text-muted">No houses to display yet</p>
      </div>
    `;
    document.getElementById("resultCount").textContent = "0";
    return;
  }
  
  let content = "";
  
  for (let i = 0; i < housesTab.length; i++) {
    // Count rooms
    let roomCount = 0;
    let minPrice = null;
    for (let j = 0; j < roomsTab.length; j++) {
      if (roomsTab[j].houseId == housesTab[i].id) {
        roomCount++;
        if (minPrice === null || roomsTab[j].price < minPrice) {
          minPrice = roomsTab[j].price;
        }
      }
    }
    
    content += createHouseCard(housesTab[i], roomCount, minPrice);
  }
  
  document.getElementById("searchResultsDiv").innerHTML = content;
  document.getElementById("resultCount").textContent = housesTab.length;
}

// ==================== SEARCH HOUSES ====================

function searchHouses() {
  const searchTerm = getValue("searchInput").toLowerCase().trim();
  const searchType = getValue("searchType");
  const cityFilter = getValue("cityFilter");
  
  const housesTab = getStoredData("houses");
  const roomsTab = getStoredData("rooms");
  
  let filteredHouses = [];
  
  for (let i = 0; i < housesTab.length; i++) {
    let matchesSearch = false;
    let matchesCity = true;
    
    // City filter
    if (cityFilter !== "" && housesTab[i].cityName !== cityFilter) {
      matchesCity = false;
    }
    
    // Search term
    if (searchTerm === "") {
      matchesSearch = true;
    } else {
      if (searchType === "all") {
        if (housesTab[i].houseName.toLowerCase().includes(searchTerm) || 
            housesTab[i].address.toLowerCase().includes(searchTerm) ||
            housesTab[i].cityName.toLowerCase().includes(searchTerm)) {
          matchesSearch = true;
        }
      } else if (searchType === "name") {
        if (housesTab[i].houseName.toLowerCase().includes(searchTerm)) {
          matchesSearch = true;
        }
      } else if (searchType === "address") {
        if (housesTab[i].address.toLowerCase().includes(searchTerm) ||
            housesTab[i].cityName.toLowerCase().includes(searchTerm)) {
          matchesSearch = true;
        }
      }
    }
    
    if (matchesSearch && matchesCity) {
      filteredHouses.push(housesTab[i]);
    }
  }
  
  // Display results
  if (filteredHouses.length === 0) {
    document.getElementById("searchResultsDiv").innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-search fa-5x text-muted mb-3"></i>
        <h4>No results found</h4>
        <p class="text-muted">Try adjusting your search criteria</p>
      </div>
    `;
    document.getElementById("resultCount").textContent = "0";
  } else {
    let content = "";
    
    for (let i = 0; i < filteredHouses.length; i++) {
      // Count rooms
      let roomCount = 0;
      let minPrice = null;
      for (let j = 0; j < roomsTab.length; j++) {
        if (roomsTab[j].houseId == filteredHouses[i].id) {
          roomCount++;
          if (minPrice === null || roomsTab[j].price < minPrice) {
            minPrice = roomsTab[j].price;
          }
        }
      }
      
      content += createHouseCard(filteredHouses[i], roomCount, minPrice);
    }
    
    document.getElementById("searchResultsDiv").innerHTML = content;
    document.getElementById("resultCount").textContent = filteredHouses.length;
  }
}

// ==================== CREATE HOUSE CARD ====================

function createHouseCard(house, roomCount, minPrice) {
  return `
    <div class="col-12 col-md-6 col-lg-4 mb-4">
      <div class="single-rooms-area wow fadeInUp" data-wow-delay="100ms">
        <div class="bg-thumbnail bg-img" style="background-image: url('${house.imageUrl || "img/bg-img/16.jpg"}'); height: 250px;"></div>
        ${minPrice ? `<p class="price-from">From ${minPrice} DT/night</p>` : ''}
        
        <div class="rooms-text" style="padding: 30px;">
          <div class="line"></div>
          <h4>${house.houseName}</h4>
          
          <div class="room-info-bar" style="margin: 15px 0;">
            <div class="room-info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${house.cityName}</span>
            </div>
            <div class="room-info-item">
              <i class="fas fa-bed"></i>
              <span>${roomCount} Rooms</span>
            </div>
          </div>
          
          <p style="margin-bottom: 10px;"><small><i class="fas fa-location-dot"></i> ${house.address}</small></p>
          <p style="margin-bottom: 20px;">${house.description.substring(0, 100)}...</p>
          
          <button class="btn palatin-btn w-100" onclick="goToRooms(${house.id})">
            <i class="fas fa-door-open"></i> View Rooms
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==================== CLEAR SEARCH ====================

function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("searchType").value = "all";
  document.getElementById("cityFilter").value = "";
  displayAllHouses();
}

// ==================== GO TO ROOMS ====================

function goToRooms(houseId) {
  localStorage.setItem("selectedHouseId", houseId);
  location.replace("rooms.html");
}