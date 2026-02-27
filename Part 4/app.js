function WeatherApp(){

  this.apiKey = "1c21c573cfbbf43f9fcf1e323990823b";

  this.cityInput = document.getElementById("city-input");
  this.searchBtn = document.getElementById("search-btn");

  this.weatherBox = document.getElementById("weather");
  this.forecastBox = document.getElementById("forecast");

  this.recentContainer = document.getElementById("recent-searches");
  this.clearBtn = document.getElementById("clear-history");

  this.recentSearches = [];
  this.maxRecent = 5;
}

/* ---------------- INIT ---------------- */

WeatherApp.prototype.init = function(){

  this.searchBtn.addEventListener("click", () => {
    const city = this.cityInput.value.trim();
    if(city){
      this.getWeather(city);
    }
  });

  const cityButtons = document.querySelectorAll(".city-btn");
  cityButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      this.getWeather(btn.textContent);
    });
  });

  this.clearBtn.addEventListener("click", () => {
    this.clearHistory();
  });

  this.loadRecentSearches();
  this.loadLastCity();
};

/* ---------------- API ---------------- */

WeatherApp.prototype.getWeather = async function(city){

  try{

    const currentURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;

    const currentRes = await fetch(currentURL);
    const currentData = await currentRes.json();

    if(currentData.cod !== 200){
      alert("City not found");
      return;
    }

    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;

    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    this.displayCurrent(currentData);
    this.displayForecast(forecastData);

    this.saveRecentSearch(currentData.name);

  }catch(err){
    console.log(err);
    alert("Error while fetching data");
  }
};

/* ---------------- UI ---------------- */

WeatherApp.prototype.displayCurrent = function(data){

  this.weatherBox.innerHTML = `
    <h3>${data.name}</h3>
    <p>Temperature : ${data.main.temp} °C</p>
    <p>${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  `;
};

WeatherApp.prototype.displayForecast = function(data){

  this.forecastBox.innerHTML = "";

  const days = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  days.forEach(day => {

    const card = document.createElement("div");
    card.className = "card";

    const date = new Date(day.dt_txt).toDateString();

    card.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
      <p>${day.main.temp} °C</p>
    `;

    this.forecastBox.appendChild(card);
  });
};

/* ---------------- LOCAL STORAGE ---------------- */

WeatherApp.prototype.loadRecentSearches = function(){

  const data = localStorage.getItem("recentSearches");

  if(data){
    this.recentSearches = JSON.parse(data);
    this.displayRecentSearches();
  }
};

WeatherApp.prototype.saveRecentSearch = function(city){

  const formatted =
    city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(
    c => c.toLowerCase() !== formatted.toLowerCase()
  );

  this.recentSearches.unshift(formatted);

  if(this.recentSearches.length > this.maxRecent){
    this.recentSearches.pop();
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(this.recentSearches)
  );

  localStorage.setItem("lastCity", formatted);

  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function(){

  this.recentContainer.innerHTML = "";

  this.recentSearches.forEach(function(city){

    const btn = document.createElement("button");
    btn.textContent = city;

    btn.addEventListener("click", () => {
      this.getWeather(city);
    });

    this.recentContainer.appendChild(btn);

  }.bind(this));
};

WeatherApp.prototype.loadLastCity = function(){

  const lastCity = localStorage.getItem("lastCity");

  if(lastCity){
    this.getWeather(lastCity);
  }
};

WeatherApp.prototype.clearHistory = function(){

  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");

  this.recentSearches = [];
  this.displayRecentSearches();
};

/* ---------------- START ---------------- */

const app = new WeatherApp();
app.init();