// ==================== DISPLAY HOUSES ====================

function displayHouses() {
  const housesTab = getStoredData("houses");
  const roomsTab = getStoredData("rooms");
  let content = "";

  if (housesTab.length === 0) {
    content = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-home fa-5x text-muted mb-3"></i>
        <h4>No houses available yet</h4>
        <p class="text-muted">Please check back later</p>
      </div>
    `;
  } else {
    for (let i = 0; i < housesTab.length; i++) {
      // Count rooms for this house
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

      content += `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="single-rooms-area wow fadeInUp" data-wow-delay="100ms">
            <div class="bg-thumbnail bg-img" style="background-image: url('${housesTab[i].imageUrl || "img/bg-img/16.jpg"}'); height: 250px;"></div>
            ${minPrice ? `<p class="price-from">From ${minPrice} DT/night</p>` : ''}
            
            <div class="rooms-text" style="padding: 30px;">
              <div class="line"></div>
              <h4>${housesTab[i].houseName}</h4>
              
              <div class="room-info-bar" style="margin: 15px 0;">
                <div class="room-info-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${housesTab[i].cityName}</span>
                </div>
                <div class="room-info-item">
                  <i class="fas fa-bed"></i>
                  <span>${roomCount} Rooms</span>
                </div>
              </div>
              
              <p style="margin-bottom: 20px;">${housesTab[i].description.substring(0, 100)}...</p>
              
              <button class="btn palatin-btn w-100" onclick="goToRooms(${housesTab[i].id})">
                <i class="fas fa-door-open"></i> View Rooms
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  document.getElementById("housesDiv").innerHTML = content;
}

// ==================== GO TO ROOMS ====================

function goToRooms(houseId) {
  localStorage.setItem("selectedHouseId", houseId);
  location.replace("rooms.html");
}

// ==================== DISPLAY ROOMS ====================

function displayRooms() {
  const houseId = localStorage.getItem("selectedHouseId");
  // Security measures to close a gap
  if (!houseId) {
    alert("No house selected!");
    location.replace("index.html");
    return;
  }

  const house = searchObjByIdAndKey(houseId, "houses");
  const roomsTab = getStoredData("rooms");
  
  // Display house name
  const houseNameElement = document.getElementById("selectedHouseName");
  if (houseNameElement && house) {
    houseNameElement.textContent = house.houseName;
  }

  let content = "";
  let hasRooms = false;

  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].houseId == houseId) {
      hasRooms = true;
      content += `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="single-rooms-area wow fadeInUp" data-wow-delay="100ms">
           <div class="bg-thumbnail bg-img" style="background-image: url('${roomsTab[i].imageUrl || "img/bg-img/1.jpg"}'); height: 200px;"></div>
            <p class="price-from">From ${roomsTab[i].price} DT/night</p>
            
            <div class="rooms-text" style="padding: 30px;">
              <span class="room-type-badge">${roomsTab[i].type}</span>
              <div class="line"></div>
              <h4>${roomsTab[i].name}</h4>
              
              <div class="room-info-bar" style="margin: 15px 0;">
                <div class="room-info-item">
                  <i class="fas fa-users"></i>
                  <span>${roomsTab[i].capacity} Guests</span>
                </div>
                <div class="room-info-item">
                  <i class="fas fa-money-bill-wave"></i>
                  <span>${roomsTab[i].price} DT/night</span>
                </div>
              </div>
              
              <p style="margin-bottom: 20px;">${roomsTab[i].description}</p>
              
              <button class="btn palatin-btn w-100" onclick="goToBooking('${roomsTab[i].id}')">
                <i class="fas fa-calendar-check"></i> Book Now
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (!hasRooms) {
    content = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-bed fa-5x text-muted mb-3"></i>
        <h4>No rooms available</h4>
        <p class="text-muted">This house doesn't have any rooms yet</p>
        <a href="index.html" class="btn palatin-btn">
          <i class="fas fa-arrow-left"></i> Back to Houses
        </a>
      </div>
    `;
  }

  document.getElementById("roomsDiv").innerHTML = content;
}

// ==================== GO TO BOOKING ====================

function goToBooking(roomId) {
  const connectedUserId = localStorage.getItem("connectedUser");
  
  if (!connectedUserId) {
    alert("Please login first to book a room!");
    location.replace("login.html");
    return;
  }

  localStorage.setItem("selectedRoomId", roomId);
  location.replace("booking.html");
}

// ==================== LOAD ROOM FOR BOOKING ====================

function loadRoomForBooking() {
  const roomId = localStorage.getItem("selectedRoomId");
  
  if (!roomId) {
    alert("No room selected!");
    location.replace("index.html");
    return;
  }

  const room = searchObjByIdAndKey(roomId, "rooms");
  
  if (!room) {
    alert("Room not found!");
    location.replace("index.html");
    return;
  }

  const house = searchObjByIdAndKey(room.houseId, "houses");

  // Display room info
  document.getElementById("roomName").textContent = room.name;
  document.getElementById("roomType").textContent = room.type;
  document.getElementById("roomCapacity").textContent = room.capacity;
  document.getElementById("roomPrice").textContent = room.price;
  document.getElementById("roomDescription").textContent = room.description;
  // security
  if (house) {
    document.getElementById("houseName").textContent = house.houseName;
  }

  // Set max guests
  document.getElementById("guestsInput").setAttribute("max", room.capacity);
  
  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("checkInInput").setAttribute("min", today);
  document.getElementById("checkOutInput").setAttribute("min", today);
}
// ==================== CALCULATE BOOKING PRICE ====================

function calculateBookingPrice() {
  const checkIn = getValue("checkInInput");
  const checkOut = getValue("checkOutInput");
  const guests = getValue("guestsInput");
  
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate > checkInDate) {
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const roomId = localStorage.getItem("selectedRoomId");
      const room = searchObjByIdAndKey(roomId, "rooms");
      
      if (room) {
        const totalPrice = nights * room.price;
        
        document.getElementById("summaryNights").textContent = nights;
        document.getElementById("summaryGuests").textContent = guests || 0;
        document.getElementById("summaryPricePerNight").textContent = room.price + " DT";
        document.getElementById("totalPrice").textContent = totalPrice + " DT";
      }
    }
  }
}

// ==================== CONFIRM BOOKING ====================

function confirmBooking() {
  const connectedUserId = localStorage.getItem("connectedUser");
  
  if (!connectedUserId) {
    alert("Please login first!");
    location.replace("login.html");
    return;
  }

  const roomId = localStorage.getItem("selectedRoomId");
  const checkIn = getValue("checkInInput");
  const checkOut = getValue("checkOutInput");
  const guests = Number(getValue("guestsInput"));

  // Validate
  if (!checkIn) {
    alert("Please select check-in date");
    return;
  }

  if (!checkOut) {
    alert("Please select check-out date");
    return;
  }

  if (!guests || guests <= 0) {
    alert("Please enter number of guests");
    return;
  }

  const room = searchObjByIdAndKey(roomId, "rooms");
  
  if (guests > room.capacity) {
    alert(`Maximum ${room.capacity} guests for this room!`);
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    alert("Check-out date must be after check-in date!");
    return;
  }

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * room.price;

  // Create reservation
  const reservationsTab = getStoredData("reservations");
  const reservation = {
    id: generateId(reservationsTab),
    userId: connectedUserId,
    roomId: roomId,
    checkIn: checkIn,
    checkOut: checkOut,
    guests: guests,
    nights: nights,
    totalPrice: totalPrice,
    status: "confirmed",
    bookingDate: new Date().toISOString().split('T')[0]
  };

  reservationsTab.push(reservation);
  saveData("reservations", reservationsTab);

  alert("Booking confirmed successfully!");
  localStorage.removeItem("selectedRoomId");
  location.replace("basket.html");
}

// ==================== DISPLAY BASKET (MY RESERVATIONS) ====================

function displayBasket() {
  const connectedUserId = localStorage.getItem("connectedUser");
  
  if (!connectedUserId) {
    alert("Please login first!");
    location.replace("login.html");
    return;
  }

  const reservationsTab = getStoredData("reservations");
  let content = "";
  let hasReservations = false;

  for (let i = 0; i < reservationsTab.length; i++) {
    if (reservationsTab[i].userId == connectedUserId) {
      hasReservations = true;
      
      const room = searchObjByIdAndKey(reservationsTab[i].roomId, "rooms");
      const house = room ? searchObjByIdAndKey(room.houseId, "houses") : null;

      content += `
        <div class="col-12 mb-4">
          <div class="card shadow">
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <h5 class="card-title">
                    <i class="fas fa-home"></i> ${house ? house.houseName : "Unknown House"}
                  </h5>
                  <h6 class="text-muted">
                    <i class="fas fa-bed"></i> ${room ? room.name : "Unknown Room"} 
                    <span class="badge badge-info">${room ? room.type : ""}</span>
                  </h6>
                  
                  <hr>
                  
                  <div class="row mt-3">
                    <div class="col-6">
                      <p><i class="fas fa-calendar-alt"></i> <strong>Check-in:</strong> ${reservationsTab[i].checkIn}</p>
                      <p><i class="fas fa-calendar-alt"></i> <strong>Check-out:</strong> ${reservationsTab[i].checkOut}</p>
                    </div>
                    <div class="col-6">
                      <p><i class="fas fa-moon"></i> <strong>Nights:</strong> ${reservationsTab[i].nights}</p>
                      <p><i class="fas fa-users"></i> <strong>Guests:</strong> ${reservationsTab[i].guests}</p>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-4 text-center">
                  <h3 class="text-success">${reservationsTab[i].totalPrice} DT</h3>
                  <p class="text-muted">Total Price</p>
                  <button class="btn btn-danger w-100" onclick="cancelReservation(${reservationsTab[i].id})">
                    <i class="fas fa-times"></i> Cancel Reservation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (!hasReservations) {
    content = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-calendar-times fa-5x text-muted mb-3"></i>
        <h4>No reservations yet</h4>
        <p class="text-muted">Start booking your perfect stay!</p>
        <a href="index.html" class="btn palatin-btn">
          <i class="fas fa-home"></i> Browse Houses
        </a>
      </div>
    `;
  }

  document.getElementById("basketDiv").innerHTML = content;
}

// ==================== CANCEL RESERVATION ====================

function cancelReservation(reservationId) {
  if (!confirm("Are you sure you want to cancel this reservation?")) {
    return;
  }

  const reservationsTab = getStoredData("reservations");
  const newReservationsTab = [];

  for (let i = 0; i < reservationsTab.length; i++) {
    if (reservationsTab[i].id != reservationId) {
      newReservationsTab.push(reservationsTab[i]);
    }
  }

  saveData("reservations", newReservationsTab);
  alert("Reservation cancelled successfully!");
  displayBasket();
}