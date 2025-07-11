import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

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
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={handleSearch}>Search</button>
      <div className="search-spinner">
        {loading && <div className="spinner"></div>}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
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
