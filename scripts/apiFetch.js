/** @format */

// API Endpoints
const observationsUrl = "https://api.inaturalist.org/v1/observations";

// Fetch observations
fetch(observationsUrl)
  .then((response) => response.json())
  .then((data) => console.log("Observations Data:", data))
  .catch((error) => console.error("Error fetching observations:", error));

// Fetch places and Identifications
function fetchPlaces(placeName) {
  const placesUrl = `https://api.inaturalist.org/v1/places/autocomplete?q=${placeName}`;

  return fetch(placesUrl)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching places:", error);
      return { results: [] };
    });
}

function fetchIdentifications(placeId) {
  const identificationsUrl = `https://api.inaturalist.org/v1/identifications?place_id=${placeId}`;

  fetch(identificationsUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Identifications:", data.results); // Debugging
      displayIdentifications(data.results);
    })
    .catch((error) => console.error("Error fetching identifications:", error));
}

// Function to Display Results
function displayResults(results) {
  const resultsElement = document.getElementById("results");
  resultsElement.innerHTML = ""; // Clear Previous results

  if (!results.length) {
    resultsElement.innerHTML = "<p>No places found.</p>";
    return;
  }

  // Create a list of clickable places
  const list = document.createElement("ul");
  results.forEach((place) => {
    const listItem = document.createElement("li");
    listItem.textContent = place.display_name || "Unknown Place";
    listItem.dataset.placeId = place.id; // Store IDs
    listItem.addEventListener("click", function () {
      console.log(`Fetching identifications for place ID: ${place.id}`); // Debugging
      fetchIdentifications(place.id);
    });

    list.appendChild(listItem);
  });
  resultsElement.appendChild(list);
}

// Display pics and species
function displayIdentifications(identifications) {
  const identificationsElement = document.getElementById("identifications");
  identificationsElement.innerHTML = ""; // Clear previous results

  if (!Array.isArray(identifications) || identifications.length === 0) {
    identificationsElement.innerHTML = "<p>No identifications found.</p>";
    return;
  }

  identifications.forEach((identification) => {
    const speciesName =
      identification?.taxon?.preferred_common_name ||
      identification?.taxon?.name ||
      "Unknown Species";

    const imageUrl =
      identification?.taxon?.default_photo?.medium_url || // Corrected image property
      "https://placehold.co/150"; // Fallback image

    // Create card
    const card = document.createElement("div");
    card.classList.add("identification-card");

    // Create image
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = speciesName;

    // Create name element
    const name = document.createElement("p");
    name.textContent = speciesName;

    // Append elements
    card.appendChild(img);
    card.appendChild(name);
    identificationsElement.appendChild(card);
  });
}

// Event Listener for Form Submission
document
  .getElementById("place-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const placeName = document.getElementById("place-input").value;
    if (!placeName) return; // Stop if input is empty

    const data = await fetchPlaces(placeName); // Fetch places
    console.log("Fetched Places:", data.results); // Debugging
    displayResults(data.results);
  });
