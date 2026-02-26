// Your OpenWeatherMap API Key
const API_KEY = '12d39d49a51df2ed6ca801cfa950510c';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
function getWeather(city) {
    // Build the complete URL
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Make API call using Axios
    axios.get(url)
        .then(function(response) {
            // Success! We got the data
            console.log('Weather Data:', response.data);
            displayWeather(response.data);
        })
        .catch(function(error) {
            // Something went wrong
            console.error('Error fetching weather:', error);
            document.getElementById('weather-display').innerHTML = 
                '<p class="loading">Could not fetch weather data. Please try again.</p>';
        });
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
}

// Call the function when page loads
getWeather('London');
const apiKey = "YOUR_API_KEY";   // keep your same key
const weatherDisplay = document.getElementById("weather-display");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

/* -------------------------------
   Show Loading
--------------------------------*/
function showLoading() {
  weatherDisplay.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading weather...</p>
    </div>
  `;
}

/* -------------------------------
   Show Error
--------------------------------*/
function showError(message) {
  weatherDisplay.innerHTML = `
    <div class="error-message">
      ${message}
    </div>
  `;
}

/* -------------------------------
   Display Weather (simple example)
--------------------------------*/
function displayWeather(data) {
  weatherDisplay.innerHTML = `
    <h2>📍 ${data.name}, ${data.sys.country}</h2>
    <p>🌡 Temperature: ${data.main.temp} °C</p>
    <p>🌥 Condition: ${data.weather[0].description}</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
  `;
}

/* -------------------------------
   Get Weather (Async / Await)
--------------------------------*/
async function getWeather(city) {

  try {
    showLoading();
    searchBtn.disabled = true;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    displayWeather(response.data);

  } catch (error) {

    if (error.response && error.response.status === 404) {
      showError("❌ City not found. Please try another city.");
    } else {
      showError("⚠️ Something went wrong. Please try again later.");
    }

  } finally {
    searchBtn.disabled = false;
  }
}

/* -------------------------------
   Search Button Click
--------------------------------*/
searchBtn.addEventListener("click", () => {

  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    cityInput.focus();
    return;
  }

  getWeather(city);
  cityInput.value = "";
});

/* -------------------------------
   Enter Key Support
--------------------------------*/
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

/* -------------------------------
   Initial Page Message
--------------------------------*/
weatherDisplay.innerHTML = `
  <p style="text-align:center;">
    🌍 Search for a city to view its weather.
  </p>
`;