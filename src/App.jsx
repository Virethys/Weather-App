import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State variables for city input, error messages, weather data, forecast data, loading spinner, dark mode, local time, and background image
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [localTime, setLocalTime] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  // Effect: Toggle dark mode class on body when darkMode state changes
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Effect: Handle background image overlay and transitions
  useEffect(() => {
    const overlayId = "bg-overlay";

    // Ensure overlay div exists
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.className = "bg-overlay";
      document.body.appendChild(overlay);
    }

    // If background image is set, fade out, change image, then fade in
    if (backgroundImage) {
      overlay.classList.remove("fade-in");
      overlay.classList.add("fade-out");

      setTimeout(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

        overlay.classList.remove("fade-out");
        overlay.classList.add("fade-in");
      }, 700);
    } else {
      // Remove background image if none is set
      document.body.style.backgroundImage = "";
      overlay.classList.remove("fade-in");
    }
  }, [backgroundImage]);

  // Effect: Update the displayed local time for the selected city every second
  useEffect(() => {
    if (!weather) return;

    // Function to calculate and set the local time based on city's timezone
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityTime = new Date(utc + weather.timezone * 1000);

      const formattedTime = cityTime.toLocaleString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setLocalTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval); // Cleanup interval on unmount or weather change
  }, [weather]);

  // Function: Handle search button click or Enter key press
  const handleSearch = () => {
    if (!city) return;

    setLoading(true); // Show loading spinner
    setError(null); // Clear previous errors
    setWeather(null); // Clear previous weather data
    setForecast([]); // Clear previous forecast data

    // OpenWeatherMap API endpoints
    const apiKey = "8b6ceab7a83ad154b24228cec85d5bc5";
    const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
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

    // Fetch forecast data (next 5 time slots)
    fetch(forecastURL)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "200") {
          setForecast(data.list.slice(0, 5));
        }
      })
      .catch((err) => console.error("Forecast error:", err));
  };

  // Effect: Fetch a background image from Unsplash based on the city name
  useEffect(() => {
    if (!weather) return;

    const queryCity = weather.name || city;
    const unsplashAccessKey = "orTi-inI1Z1AWyN-0lwDyUhmcrE34dJIr87mO3qt0cg";
    const imageUrl = `https://api.unsplash.com/search/photos?query=${queryCity}&client_id=${unsplashAccessKey}&orientation=landscape`;

    fetch(imageUrl)
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.results && imgData.results.length > 0) {
          // Prefer landscape images
          const bestImage =
            imgData.results.find((img) => img.width >= img.height) ||
            imgData.results[0];
          setBackgroundImage(bestImage.urls.full);
        } else {
          setBackgroundImage(null);
        }
      })
      .catch((err) => {
        console.error("Unsplash error:", err);
        setBackgroundImage(null);
      });
  }, [weather]);

  // Main render
  return (
    <div className={`content-card ${darkMode ? "dark" : ""}`}>
      <h1>Weather App</h1>
      <h3>Made by : Virethys</h3>
      {/* City input field */}
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
      {/* Search button */}
      <button onClick={handleSearch}>Search</button>
      {/* Loading spinner */}
      <div className="search-spinner">
        {loading && <div className="spinner"></div>}
      </div>
      {/* Dark mode toggle */}
      <div>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Weather display */}
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
          <p>
            Temperature: {weather.main.temp}°C /{" "}
            {((weather.main.temp * 9) / 5 + 32).toFixed(2)}°F
          </p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}

      {/* Forecast display */}
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
                <p>
                  {Math.round(item.main.temp)}°C / {""}
                  {Math.round(weather.main.temp * 9) / 5 + 32}°F
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
