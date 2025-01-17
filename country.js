document.addEventListener("DOMContentLoaded", () => {
  const countryContainer = document.querySelector(".container");
  const search = document.querySelector(".search");
  const filterByRegion = document.querySelector(".filter-by-region");
  const changeMode = document.querySelector(".mode-button");
  const searchInput = document.querySelector(".country-input");
  const desc = document.querySelector(".desc");
  const navBar = document.querySelector(".nav-bar");

  let allCountriesData;
  let currMode = localStorage.getItem("pageMode") || "light";

  // Fetch all countries and store in allCountriesData
  fetch(`https://restcountries.com/v3.1/all`)
    .then((res) => res.json())
    .then((data) => {
      allCountriesData = data; // Assign the data to the global variable
      searchCountries(data); // Initial render of all countries
    });

  // Filter countries by region
  filterByRegion.addEventListener("change", () => {
    fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
      .then((res) => res.json())
      .then(searchCountries);
  });

  // Function to render countries
  function searchCountries(data) {
    countryContainer.innerHTML = "";
    data.forEach((country) => {
      const countryCard = document.createElement("a");
      countryCard.classList.add("country-card");
      countryCard.href = `/detail.html?name=${country.name.common}`;
      countryCard.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag of ${
        country.name.common
      }" class="flag" />
        <div class="desc">
          <h3 class="name-display">${country.name.common}</h3>
          <div class="desc-display">
            <div class="flex">
              <h4>Population:</h4>
              <p class="popu">${country.population.toLocaleString("en-IN")}</p>
            </div>
            <div class="flex">
              <h4>Region:</h4>
              <p class="reg">${country.region}</p>
            </div>
            <div class="flex">
              <h4>Capital:</h4>
              <p class="cap">${
                country.capital ? country.capital.join(", ") : "N/A"
              }</p>
            </div>
          </div>
        </div>
      `;

      countryContainer.append(countryCard);
    });
  }

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const searchedCountries = allCountriesData.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm)
    );
    searchCountries(searchedCountries); // Update displayed countries
  });

  // Dark mode toggle
  changeMode.addEventListener("click", () => {
    currMode = currMode === "light" ? "dark" : "light";
    document.body.classList.toggle("dark", currMode === "dark");
    navBar.classList.toggle("dark", currMode === "dark");
    search.style.backgroundColor =
      currMode === "dark" ? "hsl(207, 26%, 17%)" : "white";
    searchInput.style.color = currMode === "dark" ? "white" : "black";
    filterByRegion.style.color = currMode === "dark" ? "white" : "black";
    desc.style.color = currMode === "dark" ? "white" : "black";
    // Change color of "Dark Mode" text inside the button
    changeMode.style.color = currMode === "dark" ? "white" : "black"; // Update mode button text color
    console.log(currMode);

    //store  currMode in local storage
    // localStorage.setItem("pageMode", currMode);

    // Re-render countries with the updated mode
    searchCountries(allCountriesData);
  });

  // Prevent form submission and reload
  document.querySelector(".search-bar").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission
  });
});
