// Get value from input
function getValue(id) {
  return document.getElementById(id).value;
}

// Set text and color
function setText(id, text, color = null) {
  const el = document.getElementById(id);
  el.innerHTML = text;
  if (color) el.style.color = color;
}

// Check length
function checkLength(text, minLength, maxLength = 1000) {
  return text.length >= minLength && text.length <= maxLength;
}

// Check telephone number
function checkTel(number, length) {
  return number.length == length && !isNaN(number);
}

// Check if passwords match
function matchingPassword(password, confirmPassword) {
  return password === confirmPassword;
}

// Validate field and show error
function validateField(isValid, errorId, errorMsg) {
  const errorElement = document.getElementById(errorId);
  if (!isValid) {
    errorElement.innerHTML = errorMsg;
    errorElement.style.color = "red";
  } else {
    errorElement.innerHTML = "";
  }
}

// Check if email exists
function checkEmail(usersArray, emailValue, errorId) {
  if (usersArray.length == 0) {
    document.getElementById(errorId).innerHTML = "";
    return true;
  }
  
  for (let i = 0; i < usersArray.length; i++) {
    if (usersArray[i].email == emailValue) {
      document.getElementById(errorId).innerHTML = "This email already exists";
      document.getElementById(errorId).style.color = "red";
      return false;
    }
  }
  
  document.getElementById(errorId).innerHTML = "";
  return true;
}

// Generate unique ID
function generateId(array) {
  if (array.length == 0) {
    return 1;
  }
  
  let maxId = array[0].id;
  for (let i = 1; i < array.length; i++) {
    if (array[i].id > maxId) {
      maxId = array[i].id;
    }
  }
  return maxId + 1;
}

// Save data to localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get data from localStorage
function getStoredData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Search object by ID
function searchObjByIdAndKey(id, key) {
  const array = getStoredData(key);
  for (let i = 0; i < array.length; i++) {
    if (array[i].id == id) {
      return array[i];
    }
  }
  return null;
}

// Search position by ID
function searchPos(id, key) {
  const array = getStoredData(key);
  for (let i = 0; i < array.length; i++) {
    if (array[i].id == id) {
      return i;
    }
  }
  return -1;
}