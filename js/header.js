function generateHeader() {
  const connectedUserId = localStorage.getItem("connectedUser");
  let content = "";

  if (!connectedUserId) {
    // Guest (not logged in)
    content = `
      <li><a href="index.html">Home</a></li>
      <li><a href="search.html">Search</a></li>
      <li><a href="register.html">Register</a></li>
      <li><a href="login.html">Login</a></li>
    `;
  } else {
    const user = searchObjByIdAndKey(connectedUserId, "users");

    if (!user) {
      // User not found, logout
      localStorage.removeItem("connectedUser");
      content = `
        <li><a href="index.html">Home</a></li>
        <li><a href="search.html">Search</a></li>
        <li><a href="register.html">Register</a></li>
        <li><a href="login.html">Login</a></li>
      `;
    } else if (user.role === "client") {
      // Client menu
      content = `
        <li><a href="index.html">Home</a></li>
        <li><a href="search.html">Search Houses</a></li>
        <li><a href="basket.html">My Reservations</a></li>
        <li><a href="#" style="color: #16c306ff;">
          <i class="fas fa-user"></i> ${user.firstName} ${user.lastName} (${user.role})
        </a></li>
        <li><a href="#" onclick="logout()" style="color: red; font-weight: bold;"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
      `;
    } else if (user.role === "owner") {
      // Owner menu
      content = `
    <li><a href="index.html">Home</a></li>
    <li><a href="owner-dashboard.html">Dashboard</a></li>
    <li><a href="search.html">Search</a></li>
    <li><a href="#" style="color: #007bff;">
      <i class="fas fa-user"></i> ${user.firstName} ${user.lastName} (${user.role})
    </a></li>
    <li><a href="#" onclick="logout()" style="color: red; font-weight: bold;"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
  `;
    } else if (user.role === "admin") {
      // Admin menu
      content = `
    <li><a href="index.html">Home</a></li>
    <li><a href="admin-dashboard.html">Admin Dashboard</a></li>
    <li><a href="search.html">Search</a></li>
    <li><a href="#" style="color: #ff8c00; font-weight: bold;">
      <i class="fas fa-user-shield"></i> ${user.firstName} ${user.lastName} (${user.role})
    </a></li>
    <li><a href="#" onclick="logout()" style="color: red; font-weight: bold;"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
  `;
    }
  }

  document.getElementById("headerDiv").innerHTML = content;
}

function logout() {
  localStorage.removeItem("connectedUser");
  location.replace("index.html");
}
