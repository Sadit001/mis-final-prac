
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const yearElement = document.getElementById('year');


yearElement.textContent = new Date().getFullYear();


async function fetchCountryData(countryName) {
  try {
    resultsContainer.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i> Searching for "${countryName}"...
      </div>
    `;

    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    
    if (!response.ok) {
      throw new Error(`No countries found for "${countryName}". Try another name.`);
    }

    const data = await response.json();
    displayCountryData(data);
  } catch (error) {
    resultsContainer.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-circle"></i> ${error.message}
      </div>
    `;
  }
}


function displayCountryData(countries) {
  resultsContainer.innerHTML = '';

  countries.forEach(country => {
    const currencyCode = Object.keys(country.currencies || {})[0];
    const currency = currencyCode ? country.currencies[currencyCode] : null;

    const countryCard = document.createElement('div');
    countryCard.className = 'country-card';
    countryCard.innerHTML = `
      <h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="${country.name.common} Flag" class="country-flag">
      
      <div class="country-details">
        <p><strong><i class="fas fa-city"></i> Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
        <p><strong><i class="fas fa-money-bill-wave"></i> Currency:</strong> 
          ${currency ? `${currency.name} (${currency.symbol || '—'})` : 'N/A'}
        </p>
        <p><strong><i class="fas fa-users"></i> Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong><i class="fas fa-globe-asia"></i> Region:</strong> ${country.region}</p>
        <p><strong><i class="fas fa-language"></i> Languages:</strong> 
          ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
        </p>
        <p><strong><i class="fas fa-map-marked-alt"></i> Area:</strong> 
          ${country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
        </p>
      </div>
    `;
    resultsContainer.appendChild(countryCard);
  });
}


searchBtn.addEventListener('click', () => {
  const countryName = searchInput.value.trim();
  if (countryName) {
    fetchCountryData(countryName);
  } else {
    resultsContainer.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-circle"></i> Please enter a country name
      </div>
    `;
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

