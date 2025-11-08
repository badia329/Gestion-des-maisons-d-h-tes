// Sign Up Function
function signUp() {
  const usersData = getStoredData("users");

  // First Name
  const firstName = getValue("firstNameInput");
  const isFirstNameValid = checkLength(firstName, 2, 10);
  validateField(
    isFirstNameValid,
    "firstNameInputError",
    "First name must be between 2 and 10 characters."
  );

  // Last Name
  const lastName = getValue("lastNameInput");
  const isLastNameValid = checkLength(lastName, 3, 10);
  validateField(
    isLastNameValid,
    "lastNameInputError",
    "Last name must be between 3 and 10 characters."
  );

  // Email
  const email = getValue("emailInput");
  const isEmailValid = checkEmail(usersData, email, "emailInputError");

  // Phone
  const tel = getValue("phoneInput");
  const isTelValid = checkTel(tel, 8);
  validateField(
    isTelValid,
    "telInputError",
    "Please enter a valid 8-digit phone number."
  );

  // Address
  const address = getValue("addressInput");
  const isAddressValid = checkLength(address, 5, 100);
  validateField(
    isAddressValid,
    "addressInputError",
    "Address must be at least 5 characters long."
  );

  // Password
  const password = getValue("passwordInput");
  const isPasswordValid = checkLength(password, 6, 50);
  validateField(
    isPasswordValid,
    "passwordInputError",
    "Password must be at least 6 characters long."
  );

  // Confirm Password
  const confirmPassword = getValue("confirmPasswordInput");
  const isConfirmPasswordValid = matchingPassword(password, confirmPassword);
  validateField(
    isConfirmPasswordValid,
    "confirmePasswordInputError",
    "Passwords do not match."
  );

  // User Type
  const userType = document.querySelector(
    'input[name="userType"]:checked'
  ).value;

  // Check all validations
  if (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isTelValid &&
    isAddressValid &&
    isPasswordValid &&
    isConfirmPasswordValid
  ) {
    if (userType === "owner") {
      const owner = {
        id: generateId(usersData),
        firstName: firstName,
        lastName: lastName,
        email: email,
        tel: tel,
        password: password,
        address: address,
        role: "owner",
        status: "pending",
      };
      usersData.push(owner);
      saveData("users", usersData);
      // alert("Registration successful! Wait for admin approval.");
    } else {
      const client = {
        id: generateId(usersData),
        firstName: firstName,
        lastName: lastName,
        email: email,
        tel: tel,
        password: password,
        address: address,
        role: "client",
      };
      usersData.push(client);
      saveData("users", usersData);
      alert("Registration successful!");
    }
    location.replace("login.html");
  }
}

// Login Function
function login() {
  const email = getValue("loginEmailInput");
  const password = getValue("loginPasswordInput");

  const usersData = getStoredData("users");

  if (!email || !password) {
    setText("login-error", "Please fill all fields", "red");
    return;
  }

  for (let i = 0; i < usersData.length; i++) {
    if (usersData[i].email == email && usersData[i].password == password) {
      // Check if owner and not approved
      if (usersData[i].role == "owner" && usersData[i].status == "pending") {
        setText("login-error", "Your account is pending admin approval", "red");
        return;
      }

      // Save user ID
      localStorage.setItem("connectedUser", usersData[i].id);

      // Redirect based on role
      if (usersData[i].role == "admin") {
        location.replace("admin-dashboard.html");
      } else if (usersData[i].role == "owner") {
        location.replace("owner-dashboard.html");
      } else {
        location.replace("index.html");
      }
      return;
    }
  }

  // alert("Invalid email or password");
  setText("errorLogin","Invalid email or password", "red")
}
