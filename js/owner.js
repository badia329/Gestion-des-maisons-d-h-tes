// ==================== OWNER DASHBOARD ====================

// Load owner data on page load
function loadOwnerData() {
  const connectedUserId = localStorage.getItem("connectedUser");
  
  if (!connectedUserId) {
    alert("Please login first!");
    location.replace("login.html");
    return;
  }

  const user = searchObjByIdAndKey(connectedUserId, "users");
  
  if (!user || user.role !== "owner") {
    alert("Access denied!");
    location.replace("login.html");
    return;
  }

  if (user.status === "pending") {
    alert("Your account is pending admin approval!");
    location.replace("login.html");
    return;
  }

  document.getElementById("ownerName").textContent = user.firstName + " " + user.lastName;
  displayOwnerHouses();
}

// Show section
function showSection(section) {
  const sections = ["dashboard", "maisons", "add-maison", "edit-maison", "reservations"];

  sections.forEach((s) => {
    const elem = document.getElementById(s + "-section");
    if (elem) {
      elem.style.display = s === section ? "block" : "none";
    }
  });

  const navBtns = document.querySelectorAll(".owner-nav-btn");
  navBtns.forEach((btn) => btn.classList.remove("active"));
  
  const activeBtn = document.querySelector(`.owner-nav-btn[onclick="showSection('${section}')"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  if (section === "maisons") {
    displayOwnerHouses();
  } else if (section === "reservations") {
    displayOwnerReservations();
  } else if (section === "dashboard") {
    calculateStats();
  }
}

// Calculate statistics
function calculateStats() {
  const connectedUserId = localStorage.getItem("connectedUser");
  const housesTab = getStoredData("houses");
  const roomsTab = getStoredData("rooms");
  const reservationsTab = getStoredData("reservations");

  let myHouses = 0;
  for (let i = 0; i < housesTab.length; i++) {
    if (housesTab[i].ownerId == connectedUserId) {
      myHouses++;
    }
  }

  let myRooms = 0;
  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].ownerId == connectedUserId) {
      myRooms++;
    }
  }

  let myReservations = 0;
  let totalRevenue = 0;
  for (let i = 0; i < reservationsTab.length; i++) {
    const room = searchObjByIdAndKey(reservationsTab[i].roomId, "rooms");
    if (room && room.ownerId == connectedUserId) {
      myReservations++;
      totalRevenue += reservationsTab[i].totalPrice || 0;
    }
  }

  document.getElementById("totalMaisons").textContent = myHouses;
  document.getElementById("totalChambres").textContent = myRooms;
  document.getElementById("totalReservations").textContent = myReservations;
  document.getElementById("totalRevenue").textContent = totalRevenue + " DT";
}

// ==================== HOUSES ====================

// Add house
function addHouse() {
  const housesTab = getStoredData("houses");
  const connectedUserId = localStorage.getItem("connectedUser");

  const houseName = getValue("houseNameInput");
  const isHouseNameValid = checkLength(houseName, 2);
  validateField(
    isHouseNameValid,
    "houseNameError",
    "House name must be at least 2 characters"
  );

  const cityName = getValue("cityInput");
  const isCityNameValid = checkLength(cityName, 2);
  validateField(
    isCityNameValid,
    "cityError",
    "City name must be at least 2 characters"
  );

  const address = getValue("addressInput");
  const isAddressValid = checkLength(address, 5);
  validateField(
    isAddressValid,
    "addressError",
    "Address must be at least 5 characters"
  );

  const description = getValue("descriptionInput");
  const isDescriptionValid = checkLength(description, 10);
  validateField(
    isDescriptionValid,
    "descriptionError",
    "Description must be at least 10 characters"
  );

  if (isHouseNameValid && isCityNameValid && isAddressValid && isDescriptionValid) {
    const house = {
      id: generateId(housesTab),
      houseName: houseName,
      cityName: cityName,
      address: address,
      description: description,
      ownerId: connectedUserId
    };

    housesTab.push(house);
    saveData("houses", housesTab);

    alert("House added successfully!");
    
    document.getElementById("houseNameInput").value = "";
    document.getElementById("cityInput").value = "";
    document.getElementById("addressInput").value = "";
    document.getElementById("descriptionInput").value = "";
    
    showSection("maisons");
  }
}

// Display owner houses
function displayOwnerHouses() {
  const housesTab = getStoredData("houses");
  const roomsTab = getStoredData("rooms");
  const reservationsTab = getStoredData("reservations");
  const connectedUserId = localStorage.getItem("connectedUser");
  let content = "";
  let hasHouses = false;

  for (let i = 0; i < housesTab.length; i++) {
    if (housesTab[i].ownerId == connectedUserId) {
      hasHouses = true;

      let roomCount = 0;
      let totalCapacity = 0;
      for (let j = 0; j < roomsTab.length; j++) {
        if (roomsTab[j].houseId == housesTab[i].id) {
          roomCount++;
          totalCapacity += Number(roomsTab[j].capacity) || 0;
        }
      }

      let reservationCount = 0;
      for (let j = 0; j < reservationsTab.length; j++) {
        const room = searchObjByIdAndKey(reservationsTab[j].roomId, "rooms");
        if (room && room.houseId == housesTab[i].id) {
          reservationCount++;
        }
      }

      content += `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card shadow h-100">
            <div class="card-body">
              <h5 class="card-title">${housesTab[i].houseName}</h5>
              <p><i class="fas fa-map-marker-alt"></i> ${housesTab[i].address}</p>
              <p><i class="fas fa-city"></i> ${housesTab[i].cityName}</p>
              <p class="card-text">${housesTab[i].description}</p>
              <hr> 
              <div class="row text-center mb-3">
                <div class="col-4">
                  <i class="fas fa-bed"></i>
                  <p class="mb-0">${roomCount} Chambres</p>
                </div>
                <div class="col-4">
                  <i class="fas fa-users"></i>
                  <p class="mb-0">${totalCapacity} Places</p>
                </div>
                <div class="col-4">
                  <i class="fas fa-calendar-check"></i>
                  <p class="mb-0">${reservationCount} Réservations</p>
                </div>
              </div>

              <div class="btn-group w-100 mb-2" role="group">
                <button class="btn btn-warning" onclick="editHouse(${housesTab[i].id})">
                  <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-danger" onclick="deleteHouse(${housesTab[i].id})">
                  <i class="fas fa-trash"></i> Supprimer
                </button>
              </div>

              <button class="btn btn-success w-100" onclick="goToAddRoom(${housesTab[i].id})">
                <i class="fas fa-plus"></i> Ajouter Chambre (${roomCount}/5)
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (!hasHouses) {
    content = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-home fa-5x text-muted mb-3"></i>
        <h4>No houses yet</h4>
        <p class="text-muted">Start by adding your first house</p>
        <button class="btn palatin-btn" onclick="showSection('add-maison')">
          <i class="fas fa-plus"></i> Add House
        </button>
      </div>
    `;
  }

  document.getElementById("houseOwnerDiv").innerHTML = content;
}

// Edit house
function editHouse(houseId) {
  const house = searchObjByIdAndKey(houseId, "houses");
  
  if (!house) {
    alert("House not found!");
    return;
  }

  document.getElementById("editHouseNameInput").value = house.houseName;
  document.getElementById("editCityInput").value = house.cityName;
  document.getElementById("editAddressInput").value = house.address;
  document.getElementById("editDescriptionInput").value = house.description;

  localStorage.setItem("editingHouseId", houseId);
  showSection("edit-maison");
}

// Update house
function updateHouse() {
  const houseId = localStorage.getItem("editingHouseId");
  const housesTab = getStoredData("houses");

  const houseName = getValue("editHouseNameInput");
  const isHouseNameValid = checkLength(houseName, 2);
  validateField(isHouseNameValid, "editHouseNameError", "House name must be at least 2 characters");

  const cityName = getValue("editCityInput");
  const isCityNameValid = checkLength(cityName, 2);
  validateField(isCityNameValid, "editCityError", "City name must be at least 2 characters");

  const address = getValue("editAddressInput");
  const isAddressValid = checkLength(address, 5);
  validateField(isAddressValid, "editAddressError", "Address must be at least 5 characters");

  const description = getValue("editDescriptionInput");
  const isDescriptionValid = checkLength(description, 10);
  validateField(isDescriptionValid, "editDescriptionError", "Description must be at least 10 characters");

  if (isHouseNameValid && isCityNameValid && isAddressValid && isDescriptionValid) {
    for (let i = 0; i < housesTab.length; i++) {
      if (housesTab[i].id == houseId) {
        housesTab[i].houseName = houseName;
        housesTab[i].cityName = cityName;
        housesTab[i].address = address;
        housesTab[i].description = description;
        break;
      }
    }

    saveData("houses", housesTab);
    localStorage.removeItem("editingHouseId");
    alert("House updated successfully!");
    showSection("maisons");
  }
}

// Delete house
function deleteHouse(houseId) {
  if (!confirm("Are you sure you want to delete this house?")) {
    return;
  }

  const housesTab = getStoredData("houses");
  const roomsTab = getStoredData("rooms");

  const newRoomsTab = [];
  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].houseId != houseId) {
      newRoomsTab.push(roomsTab[i]);
    }
  }
  saveData("rooms", newRoomsTab);

  const newHousesTab = [];
  for (let i = 0; i < housesTab.length; i++) {
    if (housesTab[i].id != houseId) {
      newHousesTab.push(housesTab[i]);
    }
  }
  saveData("houses", newHousesTab);

  alert("House deleted successfully!");
  displayOwnerHouses();
  calculateStats();
}

// Go to add room page
function goToAddRoom(houseId) {
  const roomsTab = getStoredData("rooms");
  
  let roomCount = 0;
  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].houseId == houseId) {
      roomCount++;
    }
  }

  if (roomCount >= 5) {
    alert("Maximum 5 rooms per house! You already have " + roomCount + " rooms.");
    return;
  }

  localStorage.setItem("selectedHouseId", houseId);
  location.replace("addRoom.html");
}

// ==================== ROOMS ====================

// Load selected house (for addRoom.html page)
function loadSelectedHouse() {
  const houseId = localStorage.getItem("selectedHouseId");
  
  if (!houseId) {
    alert("No house selected!");
    location.replace("owner-dashboard.html");
    return;
  }

  const house = searchObjByIdAndKey(houseId, "houses");
  
  if (!house) {
    alert("House not found!");
    location.replace("owner-dashboard.html");
    return;
  }

  document.getElementById("selectedHouseName").textContent = house.houseName;

  const roomsTab = getStoredData("rooms");
  let roomCount = 0;
  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].houseId == houseId) {
      roomCount++;
    }
  }

  document.getElementById("currentRoomCount").textContent = roomCount;

  if (roomCount >= 5) {
    alert("This house already has 5 rooms (maximum)!");
    location.replace("owner-dashboard.html");
  }
}

// Add room
function addRoom() {
  const houseId = localStorage.getItem("selectedHouseId");
  const connectedUserId = localStorage.getItem("connectedUser");
  const roomsTab = getStoredData("rooms");

  let roomCount = 0;
  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].houseId == houseId) {
      roomCount++;
    }
  }

  if (roomCount >= 5) {
    alert("Maximum 5 rooms per house!");
    return;
  }

  const name = getValue("roomNameInput");
  const isNameValid = checkLength(name, 2);
  showError("nameError", !isNameValid, "Room name must be at least 2 characters");

  const type = getValue("roomTypeInput");
  const isTypeValid = type !== "";
  showError("typeError", !isTypeValid, "Please select a room type");

  const capacity = getValue("capacityInput");
  const isCapacityValid = capacity > 0 && capacity <= 10;
  showError("capacityError", !isCapacityValid, "Capacity must be between 1 and 10");

  const price = getValue("priceInput");
  const isPriceValid = price > 0;
  showError("priceError", !isPriceValid, "Price must be greater than 0");

  const description = getValue("descriptionInput");
  const isDescriptionValid = checkLength(description, 10);
  showError("descriptionError", !isDescriptionValid, "Description must be at least 10 characters");

  if (isNameValid && isTypeValid && isCapacityValid && isPriceValid && isDescriptionValid) {
    const house = searchObjByIdAndKey(houseId, "houses");

    const room = {
      id: generateId(roomsTab),
      name: name,
      type: type,
      capacity: Number(capacity),
      price: Number(price),
      description: description,
      houseId: houseId,
      houseName: house.houseName,
      ownerId: connectedUserId,
      available: true
    };

    roomsTab.push(room);
    saveData("rooms", roomsTab);

    alert("Room added successfully!");
    location.replace("owner-dashboard.html");
  }
}

// Show/hide error message
function showError(elementId, show, message) {
  const element = document.getElementById(elementId);
  if (show) {
    element.textContent = message;
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

// ==================== RESERVATIONS ====================

// Display owner reservations
function displayOwnerReservations() {
  const connectedUserId = localStorage.getItem("connectedUser");
  const reservationsTab = getStoredData("reservations");
  let content = "";
  let hasReservations = false;

  for (let i = 0; i < reservationsTab.length; i++) {
    const room = searchObjByIdAndKey(reservationsTab[i].roomId, "rooms");
    
    if (room && room.ownerId == connectedUserId) {
      hasReservations = true;
      
      const client = searchObjByIdAndKey(reservationsTab[i].userId, "users");
      const house = searchObjByIdAndKey(room.houseId, "houses");

      content += `
        <div class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5><i class="fas fa-user"></i> ${client ? client.firstName + " " + client.lastName : "Unknown"}</h5>
                <p><i class="fas fa-home"></i> ${house ? house.houseName : "Unknown House"}</p>
                <p><i class="fas fa-bed"></i> ${room.name}</p>
              </div>
              <div class="col-md-6">
                <p><i class="fas fa-calendar-alt"></i> ${reservationsTab[i].checkIn} → ${reservationsTab[i].checkOut}</p>
                <p><i class="fas fa-moon"></i> ${reservationsTab[i].nights} nights</p>
                <p><i class="fas fa-users"></i> ${reservationsTab[i].guests} guests</p>
                <p><strong><i class="fas fa-money-bill-wave"></i> ${reservationsTab[i].totalPrice} DT</strong></p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (!hasReservations) {
    content = `
      <div class="empty-state">
        <i class="fas fa-calendar-times"></i>
        <h4>No Reservations Yet</h4>
        <p>Your reservations will appear here</p>
      </div>
    `;
  }

  document.getElementById("reservationsContainer").innerHTML = content;
}

// ==================== LOGOUT ====================

function logout() {
  localStorage.removeItem("connectedUser");
  location.replace("login.html");
}