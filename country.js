document.addEventListener("DOMContentLoaded", () => {
  const countryContainer = document.querySelector(".container");
  const searchInput = document.querySelector(".country-input");
  const filterByRegion = document.querySelector(".filter-by-region");
  const changeMode = document.querySelector(".mode-button");
  const search = document.querySelector(".search");
  const navBar = document.querySelector(".nav-bar");

  let allCountriesData = [];
  let currMode = localStorage.getItem("pageMode") || "light";

  // Apply saved theme
  if (currMode === "dark") {
    document.body.classList.add("dark");
    navBar.classList.add("dark");
  }

  // Fetch all countries
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
      allCountriesData = data;
      renderCountries(allCountriesData);
    })
    .catch((err) => console.error(err));

  // Render countries
  function renderCountries(data) {
    countryContainer.innerHTML = "";

    data.forEach((country) => {
      const countryCard = document.createElement("a");

      countryCard.classList.add("country-card");
      countryCard.href = `detail.html?name=${country.name.common}`;

      countryCard.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name.common}" class="flag">

        <div class="desc">
          <h3>${country.name.common}</h3>

          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Capital:</strong> ${
            country.capital ? country.capital[0] : "N/A"
          }</p>
        </div>
      `;

      countryContainer.appendChild(countryCard);
    });
  }

  // SEARCH
  searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase().trim();

    const filteredCountries = allCountriesData.filter((country) =>
      country.name.common.toLowerCase().includes(value)
    );

    renderCountries(filteredCountries);
  });

  // FILTER BY REGION
  filterByRegion.addEventListener("change", () => {
    const region = filterByRegion.value;

    if (!region) {
      renderCountries(allCountriesData);
      return;
    }

    const filtered = allCountriesData.filter(
      (country) => country.region.toLowerCase() === region.toLowerCase()
    );

    renderCountries(filtered);
  });

  // DARK MODE
  changeMode.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    navBar.classList.toggle("dark");

    currMode =
      document.body.classList.contains("dark") ? "dark" : "light";

    localStorage.setItem("pageMode", currMode);
  });

  // Prevent form submit
  document.querySelector(".search-bar").addEventListener("submit", (e) => {
    e.preventDefault();
  });
});
