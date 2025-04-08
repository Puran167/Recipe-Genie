// ======================= RECIPE GENERATOR =========================
function displayRecipe(response) {
  console.log("recipe generated");
  new Typewriter("#recipe", {
    strings: response.data.answer,
    autoStart: true,
    delay: 40,
    cursor: "",
  });
}

let isLogedIn = false;

function generateRecipe(event) {
  event.preventDefault();
  if(isLogedIn==false)
    return document.getElementById("login-popup").classList.remove("hidden");
  let instructions = document.querySelector("#user-instructions").value;
  let apiKey = "16t1b3fa04b8866116ccceb0d2do3a04";
  let prompt = `User instructions are: Generate a recipe for ${instructions}`;
  let context =
    "You are an expert at recipes. Your mission is to generate a short and easy recipe in basic HTML. Make sure to follow user instructions. Sign the recipe at the end with '<strong>SheCodes AI</strong>' in bold";

  let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`;

  let recipeElement = document.querySelector("#recipe");
  recipeElement.classList.remove("hidden");
  recipeElement.innerHTML = `<div class="blink">👩🏽‍🍳 Generating recipe for ${instructions}..</div>`;

  console.log("generating recipe");

  // Dynamically change title while loading
  document.title = "Cooking...";
  axios.get(apiUrl).then((response) => {
    document.title = "Recipe Genie";
    displayRecipe(response);
  });
}

// ========== Event Listener for Recipe Form ==========
document.querySelector("#recipe-generator-form").addEventListener("submit", generateRecipe);

// ======================= DARK MODE =========================
document.querySelector("#dark-toggle").addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});

// ======================= VOICE INPUT =========================
const voiceBtn = document.querySelector("#voice-btn");
const inputField = document.querySelector("#user-instructions");

voiceBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = (event) => {
    inputField.value = event.results[0][0].transcript;
  };
});

// ======================= PDF DOWNLOAD =========================
document.querySelector("#download-btn").addEventListener("click", () => {
  const recipe = document.querySelector("#recipe");
  html2pdf().from(recipe).save("recipe.pdf");
});

// // ======================= SAVE TO LOCAL STORAGE =========================
// document.querySelector("#save-btn").addEventListener("click", () => {
//   const recipeHTML = document.querySelector("#recipe").innerHTML;
//   localStorage.setItem("favorite-recipe", recipeHTML);
//   alert("Recipe saved to favorites!");
//   displayFavorite();
// });

function displayFavorite() {
  const saved = localStorage.getItem("favorite-recipe");
  if (saved) {
    document.querySelector("#favorites").innerHTML = `
      <h3>Saved Recipe:</h3>
      <div class="recipe">${saved}</div>
    `;
  } else {
    alert("No saved recipe found.");
  }
}

// ✅ Show Saved Recipes button click
// document.querySelector("#show-btn").addEventListener("click", displayFavorite);

// Show on page load if exists
window.onload = displayFavorite;

// ======================= AUTH POPUPS =========================
document.getElementById("open-login").addEventListener("click", () => {
  document.getElementById("login-popup").classList.remove("hidden");
});
document.getElementById("open-signup").addEventListener("click", () => {
  document.getElementById("signup-popup").classList.remove("hidden");
});
function closePopup(id) {
  document.getElementById(id).classList.add("hidden");
}

// ======================= AUTH FUNCTIONS =========================
function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  axios.post("/signup", { username, password })
    .then(res => {
      alert("Sign up successful!");
      goToRecipeGenerator();
    })
    .catch(err => {
      console.error("Signup error:", err);
      const message = err?.response?.data?.message || "Something went wrong during signup.";
      alert("Sign up failed: " + message);
    });
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  axios.post("/signin", { username, password })
    .then(res => {
      alert("Login successful!");
      isLogedIn=true;
      localStorage.setItem("token", res.data.token);
      goToRecipeGenerator();
    })
    .catch((err) => {
      console.error("Login error:", err.response?.data || err.message);
      const message = err?.response?.data?.message || "Something went wrong during login.";
      alert("Login failed: " + message);
    });
}

function goToRecipeGenerator() {
  closePopup("login-popup");
  closePopup("signup-popup");
  document.querySelector("#user-instructions").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    document.querySelector("#user-instructions").focus();
  }, 500);
}

// ======================= WELCOME MESSAGE =========================
function showWelcomeMessage(username) {
  const welcome = document.getElementById("welcome-message");
  welcome.innerHTML = `👋 Welcome, <strong>${username}</strong>!`;
  welcome.classList.remove("hidden");
}

// ======================= TYPEWRITER TITLE =========================
const genieText = document.getElementById('genie-title');
genieText.textContent = '';

const typewriter = new Typewriter(genieText, {
  loop: false,
  delay: 80
});

  typewriter
    .typeString('Recipe Genie')
    .start();
    document.getElementById("dark-toggle").addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);
    });
    

document.getElementById("copy-btn").addEventListener("click", () => {
  const recipe = document.getElementById("recipe").innerText;
  navigator.clipboard.writeText(recipe);
  alert("Recipe copied to clipboard!");
});
// ======================= SAVE AS FAVORITE (Multiple Support) =========================
function saveAsFavorite() {
  const recipeHTML = document.querySelector("#recipe").innerHTML.trim();

  if (!recipeHTML || recipeHTML === "") {
    alert("No recipe to save!");
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorite-recipes")) || [];

  // Avoid duplicate saves (optional)
  if (favorites.includes(recipeHTML)) {
    alert("Recipe already saved!");
    return;
  }

  favorites.push(recipeHTML);
  localStorage.setItem("favorite-recipes", JSON.stringify(favorites));
  alert("Recipe saved to favorites!");
  showFavorites(); // Refresh list
}

// ======================= SHOW FAVORITE RECIPES =========================
function showFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorite-recipes")) || [];
  const favoritesList = document.getElementById("favoritesList");

  if (!favoritesList) return;

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>No saved recipes yet.</p>";
    return;
  }

  // Clear old content
  favoritesList.innerHTML = "<h3>🍲 Saved Recipes:</h3>";

  favorites.forEach((recipe, index) => {
    const recipeBox = document.createElement("div");
    recipeBox.className = "saved-recipe";
    recipeBox.innerHTML = `
      <div class="recipe-content">${recipe}</div>
      <button class="delete-btn" onclick="deleteFavorite(${index})">❌ Delete</button>
    `;
    favoritesList.appendChild(recipeBox);
  });
}

// ======================= DELETE FAVORITE RECIPE =========================
function deleteFavorite(index) {
  let favorites = JSON.parse(localStorage.getItem("favorite-recipes")) || [];

  if (index >= 0 && index < favorites.length) {
    favorites.splice(index, 1);
    localStorage.setItem("favorite-recipes", JSON.stringify(favorites));
    showFavorites(); // Refresh
  }
}

// ======================= AUTO-SHOW ON LOAD =========================
window.addEventListener("load", showFavorites);

