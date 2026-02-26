// Your OpenWeatherMap API Key
const API_KEY = '12d39d49a51df2ed6ca801cfa950510c';  // Replace with your actual API key
function WeatherApp() {

  this.apiKey = "12d39d49a51df2ed6ca801cfa950510c";

  this.cityInput = document.getElementById("city-input");
  this.searchBtn = document.getElementById("search-btn");
  this.weatherDisplay = document.getElementById("weather-display");
  this.forecastContainer = document.getElementById("forecast-container");
}

/* ---------------- Init ---------------- */

WeatherApp.prototype.init = function () {

  this.searchBtn.addEventListener(
    "click",
    this.handleSearch.bind(this)
  );

  this.cityInput.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter") this.handleSearch();
    }
  );

  this.showWelcome();
};

/* ---------------- Welcome ---------------- */

WeatherApp.prototype.showWelcome = function () {
  this.weatherDisplay.innerHTML =
    "<p>🌍 Search for a city to see weather and 5-day forecast</p>";
  this.forecastContainer.innerHTML = "";
};

/* ---------------- Search ---------------- */

WeatherApp.prototype.handleSearch = function () {

  const city = this.cityInput.value.trim();

  if (!city) {
    this.showError("Please enter a city name");
    return;
  }

  this.getWeather(city);
  this.cityInput.value = "";
};

/* ---------------- Loading ---------------- */

WeatherApp.prototype.showLoading = function () {
  this.weatherDisplay.innerHTML =
    "<p class='loading'>Loading...</p>";
  this.forecastContainer.innerHTML = "";
};

/* ---------------- Error ---------------- */

WeatherApp.prototype.showError = function (msg) {
  this.weatherDisplay.innerHTML =
    `<div class="error-message">${msg}</div>`;
  this.forecastContainer.innerHTML = "";
};

/* ---------------- Main fetch ---------------- */

WeatherApp.prototype.getWeather = async function (city) {

  try {

    this.showLoading();

    const currentURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [currentRes, forecastRes] =
      await Promise.all([
        axios.get(currentURL),
        axios.get(forecastURL)
      ]);

    this.displayWeather(currentRes.data);

    const days =
      this.processForecastData(forecastRes.data.list);

    this.displayForecast(days);

  } catch (err) {

    if (err.response && err.response.status === 404) {
      this.showError("City not found");
    } else {
      this.showError("Something went wrong");
    }

  }
};

/* ---------------- Current weather ---------------- */

WeatherApp.prototype.displayWeather = function (data) {

  this.weatherDisplay.innerHTML = `
    <h2>📍 ${data.name}, ${data.sys.country}</h2>
    <p>🌡 ${data.main.temp} °C</p>
    <p>${data.weather[0].description}</p>
  `;
};

/* ---------------- Forecast API helper ---------------- */

WeatherApp.prototype.processForecastData = function (list) {

  const filtered = list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  return filtered.slice(0, 5);
};

/* ---------------- Forecast UI ---------------- */

WeatherApp.prototype.displayForecast = function (days) {

  this.forecastContainer.innerHTML = "";

  days.forEach(d => {

    const date = new Date(d.dt_txt);
    const dayName =
      date.toLocaleDateString("en-US", { weekday: "short" });

    const icon =
      `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`;

    this.forecastContainer.innerHTML += `
      <div class="forecast-card">
        <div class="forecast-day">${dayName}</div>
        <img src="${icon}" alt="">
        <div>${Math.round(d.main.temp)} °C</div>
        <small>${d.weather[0].description}</small>
      </div>
    `;
  });
};

/* ---------------- Start app ---------------- */

const app = new WeatherApp();
app.init();
