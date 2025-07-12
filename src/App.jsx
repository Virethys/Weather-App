import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [localTime, setLocalTime] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!weather) return;

    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityTime = new Date(utc + weather.timezone * 1000);

      const formattedTime = cityTime.toLocaleString("en-US", {
        weekday: "long", // e.g., Friday
        day: "2-digit", // e.g., 12
        month: "long", // e.g., July
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // AM/PM format
      });

      setLocalTime(formattedTime);
    };

    updateTime(); // Run immediately
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [weather]);

  const handleSearch = () => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast([]); // Reset

    const apiKey = "8b6ceab7a83ad154b24228cec85d5bc5";
    const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentURL)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "404") {
          setError("City not found.");
        } else {
          setWeather(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather:", err);
        setError("Error occurred.");
        setLoading(false);
      });

    fetch(forecastURL)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "200") {
          setForecast(data.list.slice(0, 5)); // next 5 time slots (each 3 hours)
        }
      })
      .catch((err) => console.error("Forecast error:", err));
  };

  return (
    <div>
      <h1>Weather App</h1>
      <h3>Made by : Virethys</h3>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Enter city"
      />
      <button onClick={handleSearch}>Search</button>
      <div className="search-spinner">
        {loading && <div className="spinner"></div>}
      </div>
      <div>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>
            {weather.name}
            <br />
            {localTime && <span className="weather-time">{localTime}</span>}
          </h2>
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
      {forecast.length > 0 && (
        <div className="forecast-container">
          <h3>Upcoming Forecast</h3>
          <div className="forecast-list">
            {forecast.map((item, idx) => (
              <div className="forecast-item" key={idx}>
                <p>{new Date(item.dt_txt).getHours()}:00</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="icon"
                />
                <p>{Math.round(item.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
