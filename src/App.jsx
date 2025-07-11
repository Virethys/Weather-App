import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
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
    if (!city) return; //if no city is entered, do nothing

    setLoading(true);
    setError(null);
    setWeather(null);

    const apiKey = "8b6ceab7a83ad154b24228cec85d5bc5";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          if (data.cod === "404") {
            setError("City not found. Please try again.");
            setWeather(null);
          } else {
            setWeather(data);
            setError(null);
          }
          setLoading(false);
        }, 1000); // wait 1 second before showing results
      })

      .catch((error) => {
        console.error("Error fetching weather:", error); // log the error for debugging
        setWeather(null);
        setError("An error occurred. Please try again.");
      });
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
        </div>
      )}
    </div>
  );
}
export default App;
