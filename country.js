// Fetch all countries
fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    allCountriesData = data;
    searchCountries(allCountriesData);
  });

// Filter by region
filterByRegion.addEventListener("change", () => {
  const region = filterByRegion.value;

  if (!region) {
    searchCountries(allCountriesData);
    return;
  }

  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then((res) => res.json())
    .then((data) => {
      allCountriesData = data;
      searchCountries(data);
    });
});

// Search countries
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();

  if (!allCountriesData) return;

  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm)
  );

  searchCountries(filteredCountries);
});
