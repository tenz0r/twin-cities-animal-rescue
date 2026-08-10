/* =========================================================
   Twin Cities Animal Rescue - Interactivity (Touchstone 4)

   Three things happen in this file:
   1. An adoptable animal browser with filters (services.html)
   2. A saved list ("My List") that survives page reloads and page changes
   3. Form validation with messages next to each field (contact.html)

   Data lives in two structures: the ANIMALS array of objects and the
   FILTER_GROUPS array. Saved IDs are kept in localStorage.
   ========================================================= */

/* ---------- Data ---------- */

// Array #1: every adoptable animal is an object in this array.
const ANIMALS = [
  {
    id: "biscuit",
    name: "Biscuit",
    type: "cat",
    size: "small",
    age: "adult",
    summary: "Quiet tabby who has been with us the longest. Does best in a calm home without dogs.",
    image: "images/rescue-pet-spotlight_c.png"
  },
  {
    id: "maple",
    name: "Maple",
    type: "dog",
    size: "medium",
    age: "adult",
    summary: "Friendly brown and white mix. Already house trained and good on a leash.",
    image: "images/rescue-pet_c.png"
  },
  {
    id: "cooper",
    name: "Cooper",
    type: "dog",
    size: "large",
    age: "young",
    summary: "Energetic and still learning his manners. Needs a family with a fenced yard.",
    image: "images/rescue-feature-large_c.png"
  },
  {
    id: "pepper",
    name: "Pepper",
    type: "cat",
    size: "small",
    age: "young",
    summary: "Playful kitten who was found with her littermates. Can go home with another cat.",
    image: "images/rescue-feature-small_c.png"
  },
  {
    id: "juniper",
    name: "Juniper",
    type: "small-animal",
    size: "small",
    age: "adult",
    summary: "Gentle rabbit who is litter trained and enjoys being around people.",
    image: "images/rescue-volunteer_c.png"
  },
  {
    id: "shadow",
    name: "Shadow",
    type: "dog",
    size: "medium",
    age: "senior",
    summary: "Calm senior dog looking for a quiet home. Walks slow and sleeps a lot.",
    image: "images/rescue-feature-large_c.png"
  }
];

// Array #2: the filter buttons, so the markup is not hard coded.
const FILTER_GROUPS = [
  { value: "all", label: "All animals" },
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "small-animal", label: "Small animals" }
];

/* ---------- Storage keys ---------- */

const STORAGE_KEYS = {
  savedAnimals: "tcar-saved-animals",
  lastFilter: "tcar-last-filter",
  contactInfo: "tcar-contact-info"
};

/* ---------- Storage helpers ---------- */

// localStorage only stores strings, so the saved list is converted to and
// from JSON on the way in and out.
function loadSavedAnimals() {
  const raw = localStorage.getItem(STORAGE_KEYS.savedAnimals);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveAnimalList(idList) {
  localStorage.setItem(STORAGE_KEYS.savedAnimals, JSON.stringify(idList));
}

function loadLastFilter() {
  return localStorage.getItem(STORAGE_KEYS.lastFilter) || "all";
}

function saveLastFilter(value) {
  localStorage.setItem(STORAGE_KEYS.lastFilter, value);
}

function loadContactInfo() {
  const raw = localStorage.getItem(STORAGE_KEYS.contactInfo);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function saveContactInfo(info) {
  localStorage.setItem(STORAGE_KEYS.contactInfo, JSON.stringify(info));
}

/* ---------- Animal browser ---------- */

function findAnimalById(id) {
  return ANIMALS.find(function (animal) {
    return animal.id === id;
  });
}

function getAnimalsByType(type) {
  if (type === "all") {
    return ANIMALS;
  }
  return ANIMALS.filter(function (animal) {
    return animal.type === type;
  });
}

function isSaved(id) {
  return loadSavedAnimals().indexOf(id) !== -1;
}

// Adds or removes one animal from the saved list, then redraws the page.
function toggleSavedAnimal(id) {
  const saved = loadSavedAnimals();
  const position = saved.indexOf(id);

  if (position === -1) {
    saved.push(id);
  } else {
    saved.splice(position, 1);
  }

  saveAnimalList(saved);
  renderAnimals(getActiveFilter());
  renderSavedList();
}

function buildAnimalCard(animal) {
  const item = document.createElement("li");
  item.className = "animal-card";

  const saved = isSaved(animal.id);

  const picture = document.createElement("img");
  picture.src = animal.image;
  picture.alt = animal.name + ", a " + animal.age + " " + animal.type.replace("-", " ") +
    " available for adoption at Twin Cities Animal Rescue";

  const title = document.createElement("h3");
  title.textContent = animal.name;

  const meta = document.createElement("p");
  meta.className = "animal-meta";
  meta.textContent = animal.age + " | " + animal.size + " | " + animal.type.replace("-", " ");

  const summary = document.createElement("p");
  summary.textContent = animal.summary;

  const button = document.createElement("button");
  button.type = "button";
  button.className = saved ? "save-button is-saved" : "save-button";
  button.textContent = saved ? "Saved to my list" : "Save to my list";
  button.setAttribute("aria-pressed", saved ? "true" : "false");
  button.addEventListener("click", function () {
    toggleSavedAnimal(animal.id);
  });

  item.appendChild(picture);
  item.appendChild(title);
  item.appendChild(meta);
  item.appendChild(summary);
  item.appendChild(button);

  return item;
}

function renderAnimals(type) {
  const list = document.getElementById("animal-list");
  const count = document.getElementById("animal-count");

  if (!list) {
    return;
  }

  const matches = getAnimalsByType(type);
  list.innerHTML = "";

  matches.forEach(function (animal) {
    list.appendChild(buildAnimalCard(animal));
  });

  if (count) {
    count.textContent = matches.length === 1
      ? "Showing 1 animal."
      : "Showing " + matches.length + " animals.";
  }
}

function getActiveFilter() {
  const active = document.querySelector(".filter-button.is-active");
  return active ? active.dataset.filter : "all";
}

function setActiveFilter(value) {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach(function (button) {
    const match = button.dataset.filter === value;
    button.classList.toggle("is-active", match);
    button.setAttribute("aria-pressed", match ? "true" : "false");
  });
}

function renderFilterButtons() {
  const bar = document.getElementById("filter-bar");
  if (!bar) {
    return;
  }

  bar.innerHTML = "";

  FILTER_GROUPS.forEach(function (group) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.dataset.filter = group.value;
    button.textContent = group.label;
    button.addEventListener("click", function () {
      setActiveFilter(group.value);
      saveLastFilter(group.value);
      renderAnimals(group.value);
    });
    bar.appendChild(button);
  });
}

function renderSavedList() {
  const container = document.getElementById("saved-list");
  if (!container) {
    return;
  }

  const savedIds = loadSavedAnimals();
  container.innerHTML = "";

  if (savedIds.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "You have not saved any animals yet. Use the Save to my list button on any animal above.";
    container.appendChild(empty);
    return;
  }

  const heading = document.createElement("p");
  heading.textContent = savedIds.length === 1
    ? "You saved 1 animal:"
    : "You saved " + savedIds.length + " animals:";
  container.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "saved-items";

  savedIds.forEach(function (id) {
    const animal = findAnimalById(id);
    if (!animal) {
      return;
    }
    const item = document.createElement("li");
    item.textContent = animal.name + " (" + animal.type.replace("-", " ") + ")";
    list.appendChild(item);
  });

  container.appendChild(list);
}

function startAnimalBrowser() {
  if (!document.getElementById("animal-list")) {
    return;
  }

  const savedFilter = loadLastFilter();

  renderFilterButtons();
  setActiveFilter(savedFilter);
  renderAnimals(savedFilter);
  renderSavedList();
}

/* ---------- Contact form validation ---------- */

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorBox = document.getElementById(fieldId + "-error");

  if (errorBox) {
    errorBox.textContent = message;
  }
  if (field) {
    field.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorBox = document.getElementById(fieldId + "-error");

  if (errorBox) {
    errorBox.textContent = "";
  }
  if (field) {
    field.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  }
}

// Check 1: the name cannot be empty and needs at least two letters.
function validateName() {
  const field = document.getElementById("full-name");
  if (!field) {
    return true;
  }

  const value = field.value.trim();

  if (value === "") {
    showFieldError("full-name", "Please enter your full name so we know who to contact.");
    return false;
  }
  if (value.length < 2) {
    showFieldError("full-name", "Your name needs at least 2 characters.");
    return false;
  }

  clearFieldError("full-name");
  return true;
}

// Check 2: the email has to look like a real address.
function validateEmail() {
  const field = document.getElementById("email");
  if (!field) {
    return true;
  }

  const value = field.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  if (value === "") {
    showFieldError("email", "Please enter your email address.");
    return false;
  }
  if (!pattern.test(value)) {
    showFieldError("email", "Please enter a valid email address, for example name@example.com.");
    return false;
  }

  clearFieldError("email");
  return true;
}

function showFormSummary(message, isError) {
  const summary = document.getElementById("form-summary");
  if (!summary) {
    return;
  }
  summary.textContent = message;
  summary.className = isError ? "form-summary is-error" : "form-summary is-success";
}

function handleFormSubmit(event) {
  // Both checks run every time so the user sees all the problems at once
  // instead of fixing one and finding another.
  const nameOk = validateName();
  const emailOk = validateEmail();

  if (!nameOk || !emailOk) {
    event.preventDefault();
    showFormSummary("Please fix the highlighted fields before sending the form.", true);
    return;
  }

  event.preventDefault();

  const nameField = document.getElementById("full-name");
  const emailField = document.getElementById("email");

  saveContactInfo({
    name: nameField ? nameField.value.trim() : "",
    email: emailField ? emailField.value.trim() : ""
  });

  showFormSummary("Thank you. Your interest form was sent and we will contact you within three business days.", false);
}

function prefillContactForm() {
  const info = loadContactInfo();
  const note = document.getElementById("prefill-note");

  if (!info) {
    return;
  }

  const nameField = document.getElementById("full-name");
  const emailField = document.getElementById("email");

  if (nameField && info.name) {
    nameField.value = info.name;
  }
  if (emailField && info.email) {
    emailField.value = info.email;
  }
  if (note && info.name) {
    note.textContent = "Welcome back, " + info.name + ". We filled your name and email from your last visit.";
  }
}

function showSavedAnimalsOnForm() {
  const box = document.getElementById("form-saved-animals");
  if (!box) {
    return;
  }

  const savedIds = loadSavedAnimals();
  if (savedIds.length === 0) {
    box.textContent = "You have not saved any animals yet. Browse the Services page to add some to your list.";
    return;
  }

  const names = savedIds.map(function (id) {
    const animal = findAnimalById(id);
    return animal ? animal.name : null;
  }).filter(function (name) {
    return name !== null;
  });

  box.textContent = "Animals on your list: " + names.join(", ") + ".";
}

function startContactForm() {
  const form = document.getElementById("interest-form");
  if (!form) {
    return;
  }

  prefillContactForm();
  showSavedAnimalsOnForm();

  form.addEventListener("submit", handleFormSubmit);

  const nameField = document.getElementById("full-name");
  const emailField = document.getElementById("email");

  // Re-check as soon as the user leaves the field, so the message disappears
  // once the entry is fixed.
  if (nameField) {
    nameField.addEventListener("blur", validateName);
  }
  if (emailField) {
    emailField.addEventListener("blur", validateEmail);
  }
}

/* ---------- Start ---------- */

document.addEventListener("DOMContentLoaded", function () {
  startAnimalBrowser();
  startContactForm();
});
