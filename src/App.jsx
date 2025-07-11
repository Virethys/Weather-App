import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleSearch = () => {
    if (!city) return; //if no city is entered, do nothing

    const apiKey = "8b6ceab7a83ad154b24228cec85d5bc5";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "404") {
          setWeather(null);
          setError("City not found, please try again.");
        } else {
          setWeather(data); //set the weather data if found
          setError(null); //clear any previous error
        }
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
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
export default App;
