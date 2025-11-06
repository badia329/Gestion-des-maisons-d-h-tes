// ==================== LOAD ADMIN DATA ====================

function loadAdminData() {
  const connectedUserId = localStorage.getItem("connectedUser");
  
  if (!connectedUserId) {
    alert("Please login first!");
    location.replace("login.html");
    return;
  }

  const user = searchObjByIdAndKey(connectedUserId, "users");
  
  if (!user || user.role !== "admin") {
    alert("Access denied! Admin only.");
    location.replace("login.html");
    return;
  }

  // Display admin name
  document.getElementById("adminName").textContent = user.firstName + " " + user.lastName;
  
  // Calculate and display stats
  calculateAdminStats();
  
  // Load pending owners
  displayPendingOwners();
}

// ==================== SHOW SECTION ====================

function showSection(section) {
  const sections = ["dashboard", "pending-owners", "all-users", "maisons", "chambres", "reservations"];

  sections.forEach((s) => {
    const elem = document.getElementById(s + "-section");
    if (elem) {
      elem.style.display = s === section ? "block" : "none";
    }
  });

  const navBtns = document.querySelectorAll(".admin-nav-btn");
  navBtns.forEach((btn) => btn.classList.remove("active"));
  
  const activeBtn = document.querySelector(`.admin-nav-btn[onclick="showSection('${section}')"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  // Load data for each section
  if (section === "pending-owners") {
    displayPendingOwners();
  } else if (section === "all-users") {
    displayAllUsers();
  } else if (section === "maisons") {
    displayAllMaisons();
  } else if (section === "chambres") {
    displayAllChambres();
  } else if (section === "reservations") {
    displayAllReservations();
  } else if (section === "dashboard") {
    calculateAdminStats();
  }
}

// ==================== CALCULATE STATS ====================

function calculateAdminStats() {
  const usersTab = getStoredData("users");
  const housesTab = getStoredData("houses");
  const reservationsTab = getStoredData("reservations");

  // Count pending owners
  let pendingCount = 0;
  let totalUsers = 0;
  
  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].role === "owner" && usersTab[i].status === "pending") {
      pendingCount++;
    }
    if (usersTab[i].role !== "admin") {
      totalUsers++;
    }
  }

  document.getElementById("pendingCount").textContent = pendingCount;
  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("totalMaisons").textContent = housesTab.length;
  document.getElementById("totalReservations").textContent = reservationsTab.length;
}

// ==================== PENDING OWNERS ====================

function displayPendingOwners() {
  const usersTab = getStoredData("users");
  let content = "";
  let hasPending = false;

  content += `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].role === "owner" && usersTab[i].status === "pending") {
      hasPending = true;
      content += `
        <tr>
          <td>${usersTab[i].firstName} ${usersTab[i].lastName}</td>
          <td>${usersTab[i].email}</td>
          <td>${usersTab[i].tel}</td>
          <td>${usersTab[i].address}</td>
          <td>
            <button class="btn btn-success btn-sm" onclick="approveOwner(${usersTab[i].id})">
              <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-danger btn-sm" onclick="rejectOwner(${usersTab[i].id})">
              <i class="fas fa-times"></i> Reject
            </button>
          </td>
        </tr>
      `;
    }
  }

  content += `
      </tbody>
    </table>
  `;

  if (!hasPending) {
    content = `
      <div class="text-center py-5">
        <i class="fas fa-check-circle fa-5x text-success mb-3"></i>
        <h4>No pending owners</h4>
        <p class="text-muted">All owner requests have been processed</p>
      </div>
    `;
  }

  document.getElementById("pendingOwnersTable").innerHTML = content;
}

// Approve owner
function approveOwner(ownerId) {
  if (!confirm("Approve this owner?")) {
    return;
  }

  const usersTab = getStoredData("users");
  
  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].id == ownerId) {
      usersTab[i].status = "approved";
      break;
    }
  }

  saveData("users", usersTab);
  alert("Owner approved successfully!");
  displayPendingOwners();
  calculateAdminStats();
}

// Reject owner
function rejectOwner(ownerId) {
  if (!confirm("Reject this owner? This will delete their account.")) {
    return;
  }

  const usersTab = getStoredData("users");
  const newUsersTab = [];

  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].id != ownerId) {
      newUsersTab.push(usersTab[i]);
    }
  }

  saveData("users", newUsersTab);
  alert("Owner rejected and removed!");
  displayPendingOwners();
  calculateAdminStats();
}

// ==================== ALL USERS ====================

function displayAllUsers() {
  const usersTab = getStoredData("users");
  let content = "";

  content += `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].role !== "admin") {
      const statusBadge = usersTab[i].status === "approved" 
        ? '<span class="badge badge-success">Approved</span>' 
        : usersTab[i].status === "pending"
        ? '<span class="badge badge-warning">Pending</span>'
        : '<span class="badge badge-info">Active</span>';

      content += `
        <tr>
          <td>${usersTab[i].firstName} ${usersTab[i].lastName}</td>
          <td>${usersTab[i].email}</td>
          <td><span class="badge badge-primary">${usersTab[i].role}</span></td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteUser(${usersTab[i].id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    }
  }

  content += `
      </tbody>
    </table>
  `;

  document.getElementById("allUsersTable").innerHTML = content;
}

// Delete user
function deleteUser(userId) {
  if (!confirm("Delete this user? This action cannot be undone.")) {
    return;
  }

  const usersTab = getStoredData("users");
  const newUsersTab = [];

  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].id != userId) {
      newUsersTab.push(usersTab[i]);
    }
  }

  saveData("users", newUsersTab);
  alert("User deleted successfully!");
  displayAllUsers();
  calculateAdminStats();
}

// ==================== ALL MAISONS ====================

function displayAllMaisons() {
  const housesTab = getStoredData("houses");
  const usersTab = getStoredData("users");
  let content = "";

  if (housesTab.length === 0) {
    content = `
      <div class="text-center py-5">
        <i class="fas fa-home fa-5x text-muted mb-3"></i>
        <h4>No houses yet</h4>
        <p class="text-muted">Houses will appear here when owners add them</p>
      </div>
    `;
  } else {
    content += `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < housesTab.length; i++) {
      const owner = searchObjByIdAndKey(housesTab[i].ownerId, "users");
      const ownerName = owner ? owner.firstName + " " + owner.lastName : "Unknown";

      content += `
        <tr>
          <td>${housesTab[i].houseName}</td>
          <td>${housesTab[i].cityName}</td>
          <td>${housesTab[i].address}</td>
          <td>${ownerName}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteHouse(${housesTab[i].id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    }

    content += `
        </tbody>
      </table>
    `;
  }

  document.getElementById("maisonsTable").innerHTML = content;
}

// Delete house
function deleteHouse(houseId) {
  if (!confirm("Delete this house and all its rooms?")) {
    return;
  }

  const housesTab = getStoredData("houses");
  const roomsTab = getStoredData("rooms");

  // Delete all rooms for this house
  const newRoomsTab = [];
  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].houseId != houseId) {
      newRoomsTab.push(roomsTab[i]);
    }
  }
  saveData("rooms", newRoomsTab);

  // Delete house
  const newHousesTab = [];
  for (let i = 0; i < housesTab.length; i++) {
    if (housesTab[i].id != houseId) {
      newHousesTab.push(housesTab[i]);
    }
  }
  saveData("houses", newHousesTab);

  alert("House and its rooms deleted successfully!");
  displayAllMaisons();
  calculateAdminStats();
}

// ==================== ALL CHAMBRES ====================

function displayAllChambres() {
  const roomsTab = getStoredData("rooms");
  const housesTab = getStoredData("houses");
  let content = "";

  if (roomsTab.length === 0) {
    content = `
      <div class="text-center py-5">
        <i class="fas fa-bed fa-5x text-muted mb-3"></i>
        <h4>No rooms yet</h4>
        <p class="text-muted">Rooms will appear here when owners add them</p>
      </div>
    `;
  } else {
    content += `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>House</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < roomsTab.length; i++) {
      const house = searchObjByIdAndKey(roomsTab[i].houseId, "houses");
      const houseName = house ? house.houseName : "Unknown";

      content += `
        <tr>
          <td>${roomsTab[i].name}</td>
          <td>${houseName}</td>
          <td>${roomsTab[i].type}</td>
          <td>${roomsTab[i].capacity}</td>
          <td>${roomsTab[i].price} DT</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteRoom(${roomsTab[i].id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    }

    content += `
        </tbody>
      </table>
    `;
  }

  document.getElementById("chambresTable").innerHTML = content;
}

// Delete room
function deleteRoom(roomId) {
  if (!confirm("Delete this room?")) {
    return;
  }

  const roomsTab = getStoredData("rooms");
  const newRoomsTab = [];

  for (let i = 0; i < roomsTab.length; i++) {
    if (roomsTab[i].id != roomId) {
      newRoomsTab.push(roomsTab[i]);
    }
  }

  saveData("rooms", newRoomsTab);
  alert("Room deleted successfully!");
  displayAllChambres();
}

// ==================== ALL RESERVATIONS ====================

function displayAllReservations() {
  const reservationsTab = getStoredData("reservations");
  const usersTab = getStoredData("users");
  const roomsTab = getStoredData("rooms");
  let content = "";

  if (reservationsTab.length === 0) {
    content = `
      <div class="text-center py-5">
        <i class="fas fa-calendar-times fa-5x text-muted mb-3"></i>
        <h4>No reservations yet</h4>
        <p class="text-muted">Reservations will appear here when clients book rooms</p>
      </div>
    `;
  } else {
    content += `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Client</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Nights</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < reservationsTab.length; i++) {
      const client = searchObjByIdAndKey(reservationsTab[i].userId, "users");
      const room = searchObjByIdAndKey(reservationsTab[i].roomId, "rooms");
      
      const clientName = client ? client.firstName + " " + client.lastName : "Unknown";
      const roomName = room ? room.name : "Unknown";

      content += `
        <tr>
          <td>${clientName}</td>
          <td>${roomName}</td>
          <td>${reservationsTab[i].checkIn}</td>
          <td>${reservationsTab[i].checkOut}</td>
          <td>${reservationsTab[i].nights}</td>
          <td>${reservationsTab[i].totalPrice} DT</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteReservation(${reservationsTab[i].id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    }

    content += `
        </tbody>
      </table>
    `;
  }

  document.getElementById("reservationsTable").innerHTML = content;
}

// Delete reservation
function deleteReservation(reservationId) {
  if (!confirm("Delete this reservation?")) {
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
  alert("Reservation deleted successfully!");
  displayAllReservations();
  calculateAdminStats();
}

// ==================== LOGOUT ====================

function logout() {
  localStorage.removeItem("connectedUser");
  location.replace("login.html");
}

// ==================== CREATE DEFAULT ADMIN ====================

function createDefaultAdmin() {
  const usersTab = getStoredData("users");
  
  // Check if admin already exists
  let adminExists = false;
  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].role === "admin") {
      adminExists = true;
      break;
    }
  }

  // Create admin if doesn't exist
  if (!adminExists) {
    const admin = {
      id: generateId(usersTab),
      firstName: "Admin",
      lastName: "System",
      email: "admin@palatin.com",
      tel: "12345678",
      password: "admin123",
      address: "Admin Office",
      role: "admin"
    };
    usersTab.push(admin);
    saveData("users", usersTab);
    console.log("Default admin created: admin@palatin.com / admin123");
  }
}

// Create admin on page load
createDefaultAdmin();