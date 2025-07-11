import { useState } from "react";

function App() {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (!city) return; //if no city is entered, do nothing

    const apiKey = "8b6ceab7a83ad154b24228cec85d5bc5";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Weather data:", data);
      })
      .catch((error) => {
        console.log("Error fetching weather: ", error);
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
    </div>
  );
}
export default App;
