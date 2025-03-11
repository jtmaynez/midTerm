/** @format */

// Base URL for the iNaturalist API
const baseUrl = "https://api.inaturalist.org/v1/";

// Selecting the search button, place list, and description elements from the DOM
const searchButton = document.querySelector("#search"); // Button to trigger place search
const listElem = document.querySelector("#pList"); // List where places will be displayed
const descriptionElem = document.querySelector("#description"); // Section where identifications will be displayed

/**
 * Fetches data from the given API URL
 * @param {string} url - The API endpoint to fetch data from
 * @returns {Promise<Object>} - Parsed JSON data from the response
 */
async function getInfo(url) {
  const res = await fetch(url); // Fetch the data from the API
  if (res.ok) {
    const data = await res.json(); // Convert the response to JSON
    return data; // Return the fetched data
  }
}

/**
 * Organizes the list of identifications by extracting relevant details
 * @param {Array} list - List of identification objects from the API
 * @returns {Array} - A new list with only the relevant identification data
 */
function organize(list) {
  const organizeList = list.map((item) => {
    return {
      name: item.observation.taxon.preferred_common_name, // Common name of the species
      image: item.observation.taxon.default_photo.medium_url, // Image URL
      taxon_id: item.taxon_id, // Unique taxonomic ID
    };
  });
  return organizeList; // Return the cleaned-up list
}

/**
 * Generates an HTML template for a place list item
 * @param {Object} place - A place object with an ID and display name
 * @returns {string} - HTML template for a single place list item
 */
function placeTemplate(place) {
  return `<li data-id="${place.id}">${place.display_name}</li>`; // Generates an interactive list item
}

/**
 * Generates an HTML template for an identification item (species card)
 * @param {Object} ident - An identification object containing name and image
 * @returns {string} - HTML template for a species card
 */
function identifyTemplate(ident) {
  return `<li> 
      <img src="${ident.image}">
      <h2>${ident.name}</h2>
      </li>`;
}

/**
 * Renders a list of items inside a given HTML element
 * @param {Array} list - The list of items to render
 * @param {HTMLElement} element - The DOM element where the list will be inserted
 * @param {Function} template - Function to generate the HTML template for each item
 */
function renderList(list, element, template) {
  const html = list.map((item) => template(item)); // Convert each item into its HTML representation
  element.innerHTML = html.join(""); // Insert all items into the element
}

/**
 * Searches for places based on user input and updates the UI
 * @param {Event} e - The event object from the click event
 */
async function searchPlace(e) {
  const q = document.querySelector("#place").value; // Get the search query from input field
  const data = await getInfo(baseUrl + `places/autocomplete?q=${q}`); // Fetch places based on user input
  renderList(data.results, listElem, placeTemplate); // Display the fetched places in the list
}

/**
 * Fetches identifications for a selected place and updates the UI
 * @param {Event} e - The event object from clicking a place
 */
async function getIdenByPlace(e) {
  const id = e.target.dataset.id; // Get the selected place ID from the clicked list item
  const data = await getInfo(
    baseUrl +
      `identifications?current=true&place_id=${id}&order=desc&order_by=created_at`
  ); // Fetch identifications for the selected place

  const organiz = organize(data.results); // Organize the raw identification data
  // const distinct = deDuplicate(organize)  // (Commented out) Could be used for removing duplicate species
  renderList(organiz, descriptionElem, identifyTemplate); // Display species identifications in the UI
  // console.log(organiz);  // Debugging: Logs organized identifications
}

// Event listener for the search button to trigger place search
searchButton.addEventListener("click", searchPlace);

// Event listener for place selection to fetch identifications
listElem.addEventListener("click", getIdenByPlace);

// // stretch remove duplicates
// function deDuplicate(list) {
//   const filtered = list.filter(
//     (value, index, self) => index === self.findIndex((t) => t.taxon_id === value.taxon_id)
//     );
// return filtered;
// }

// API Endpoints
// const observationsUrl = "https://api.inaturalist.org/v1/observations";

// // Fetch observations
// fetch(observationsUrl)
//   .then((response) => response.json())
//   .then((data) => console.log("Observations Data:", data))
//   .catch((error) => console.error("Error fetching observations:", error));

// Have Base URL

// Fetch places and Identifications
// function fetchPlaces(placeName) {
//   const placesUrl = `https://api.inaturalist.org/v1/places/autocomplete?q=${placeName}`;

//   return fetch(placesUrl)
//     .then((response) => response.json())
//     .catch((error) => {
//       console.error("Error fetching places:", error);
//       return { results: [] };
//     });
// }

// function fetchIdentifications(placeId) {
//   const identificationsUrl = `https://api.inaturalist.org/v1/identifications?place_id=${placeId}`;

//   fetch(identificationsUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Fetched Identifications:", data.results); // Debugging
//       displayIdentifications(data.results);
//     })
//     .catch((error) => console.error("Error fetching identifications:", error));
// }

// // Function to Display Results
// function displayResults(results) {
//   const resultsElement = document.getElementById("results");
//   resultsElement.innerHTML = ""; // Clear Previous results

//   if (!results.length) {
//     resultsElement.innerHTML = "<p>No places found.</p>";
//     return;
//   }

//   // Create a list of clickable places
//   const list = document.createElement("ul");
//   results.forEach((place) => {
//     const listItem = document.createElement("li");
//     listItem.textContent = place.display_name || "Unknown Place";
//     listItem.dataset.placeId = place.id; // Store IDs
//     listItem.addEventListener("click", function () {
//       console.log(`Fetching identifications for place ID: ${place.id}`); // Debugging
//       fetchIdentifications(place.id);
//     });

//     list.appendChild(listItem);
//   });
//   resultsElement.appendChild(list);
// }

// // Display pics and species
// function displayIdentifications(identifications) {
//   const identificationsElement = document.getElementById("identifications");
//   identificationsElement.innerHTML = ""; // Clear previous results

//   if (!Array.isArray(identifications) || identifications.length === 0) {
//     identificationsElement.innerHTML = "<p>No identifications found.</p>";
//     return;
//   }

//   identifications.forEach((identification) => {
//     const speciesName =
//       identification?.taxon?.preferred_common_name ||
//       identification?.taxon?.name ||
//       "Unknown Species";

//     const imageUrl =
//       identification?.taxon?.default_photo?.medium_url || // Corrected image property
//       "https://placehold.co/150"; // Fallback image

//     // Create card
//     const card = document.createElement("div");
//     card.classList.add("identification-card");

//     // Create image
//     const img = document.createElement("img");
//     img.src = imageUrl;
//     img.alt = speciesName;

//     // Create name element
//     const name = document.createElement("p");
//     name.textContent = speciesName;

//     // Append elements
//     card.appendChild(img);
//     card.appendChild(name);
//     identificationsElement.appendChild(card);
//   });
// }

// // Event Listener for Form Submission
// document
//   .getElementById("place-form")
//   .addEventListener("submit", async function (event) {
//     event.preventDefault(); // Prevent page reload

//     const placeName = document.getElementById("place-input").value;
//     if (!placeName) return; // Stop if input is empty

//     const data = await fetchPlaces(placeName); // Fetch places
//     console.log("Fetched Places:", data.results); // Debugging
//     displayResults(data.results);
//   });
