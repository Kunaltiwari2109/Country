document.addEventListener("DOMContentLoaded", () => {
  const countryName = new URLSearchParams(location.search).get("name");
  const flag = document.querySelector(".flag");
  const countryHead = document.querySelector(".country-name");
  const panel = document.querySelector(".desc-panel");
  const nativName = document.querySelector(".native-name");
  const borderCountriesContainer = document.querySelector(".border-countries");
  const changeMode = document.querySelector(".mode");

  let currMode = localStorage.getItem("pageMode") || "light";

  // Function to get the native name
  const native = (country) => {
    if (country.name.nativeName) {
      const nativeNames = Object.values(country.name.nativeName);
      return nativeNames.length ? nativeNames[0].common : "N/A";
    }
    return country.name.common;
  };

  fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then((res) => res.json())
    .then(([country]) => {
      // Set the flag image
      if (flag) {
        flag.src = country.flags.svg;
        flag.alt = `${country.name.common} Flag`;
      }

      // Set the country name
      if (countryHead) {
        countryHead.innerHTML = country.name.common;
      }

      // Set the native name
      if (nativName) {
        nativName.innerHTML = native(country);
      }

      // Set the panel information
      if (panel) {
        const currencies = Object.values(country.currencies || {})
          .map((currency) => currency.name)
          .join(", ");
        const languages = Object.values(country.languages || {}).join(", ");

        panel.innerHTML = `
                  <div class="left-desc descs">
                      <p><b>Native name: </b><span class="native-name">${native(
                        country
                      )}</span></p>
                      <p><b>Population: </b>${country.population.toLocaleString(
                        "en-IN"
                      )}</p>
                      <p><b>Region: </b>${country.region}</p>
                      <p><b>Sub Region: </b>${country.subregion}</p>
                      <p><b>Capital: </b>${country.capital}</p>
                  </div>
                  <div class="right-desc descs">
                      <p><b>Top Level Domain: </b>${country.tld.join(", ")}</p>
                      <p><b>Currencies: </b>${currencies}</p>
                      <p><b>Languages: </b>${languages}</p>
                  </div>
              `;

        // Display border countries
        if (borderCountriesContainer && country.borders) {
          borderCountriesContainer.innerHTML =
            "<p><b>Border Countries: </b></p>";
          country.borders.forEach((border) => {
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
              .then((response) => response.json())
              .then(([borderCountry]) => {
                const borderElement = document.createElement("a");
                borderElement.classList.add("each-border");
                borderElement.href = `?name=${borderCountry.name.common}`;
                borderElement.textContent = borderCountry.name.common;
                borderCountriesContainer.appendChild(borderElement);
              });
          });
        } else {
          borderCountriesContainer.innerHTML =
            "<p><b>Border Countries: </b>None</p>";
        }
      }
    });

  changeMode.addEventListener("click", (event) => {
    event.preventDefault();
    currMode = currMode === "light" ? "dark" : "light";
    document.body.classList.toggle("dark", currMode === "dark");
    localStorage.setItem("pageMode", currMode);
  });
});
