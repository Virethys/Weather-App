# Weather App

A simple React weather application that displays current weather, a 5-slot forecast, and a dynamic Unsplash background for any city.

## Features

- Search for any city and get current weather data
- See a 5-slot forecast for the city
- Local time display for the city
- Light/Dark mode toggle
- Dynamic Unsplash background images

## Setup

1. **Clone the repository:**

   ```
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **API Keys:**

   - This app uses [OpenWeatherMap](https://openweathermap.org/) and [Unsplash](https://unsplash.com/developers) APIs.
   - **Important:** For security, do not hardcode your API keys in the source code.  
     Instead, create a `.env` file in the root of your project and add:
     ```
     VITE_WEATHER_API_KEY=your_openweathermap_api_key
     VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
     ```
   - Update your code to use these environment variables (ask for help if needed).

4. **Start the app:**
   ```
   npm run dev
   ```

## Security Warning

If you have ever committed your API keys to this repository, they may still be visible in the commit history.  
**Rotate your keys** and follow [GitHub’s guide to removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## License

MIT
