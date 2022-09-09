import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const http = axios.create({
  baseURL: "https://restcountries.com/v3.1",
});

let timeout;

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState({});

  const fetchAllCountries = async () => {
    try {
      setShowWeather(false);
      const { data } = await http.get("/all");
      setCountries(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCountries();
  }, []);

  const fetchCountryWeather = async (lat, lon) => {
    try {
      const { data } = await http.get(WEATHER_API_URL, {
        params: {
          lat,
          lon,
          units: "metric",
          appid: API_KEY,
        },
      });

      setWeatherCondition({
        windSpeed: data.wind.speed,
        temp: data.main.temp,
        icon: data.weather[0]?.icon || "01d",
      });

      setShowWeather(true);
    } catch (error) {
      console.log(error);
      setShowWeather(false);
    }
  };

  const searchCountriesByName = async (value) => {
    try {
      setShowWeather(false);
      const { data } = await http.get(`/name/${value}`);
      setCountries(data);
      if (data.length === 1) {
        const [countryInfo] = data;
        const { latlng } = countryInfo.capitalInfo;
        const [lat, lng] = latlng;
        fetchCountryWeather(lat, lng);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSearch = (event) => {
    clearTimeout(timeout);
    setSearch(event.target.value);
    if (!event.target.value) return fetchAllCountries();
    timeout = setTimeout(() => searchCountriesByName(event.target.value), 500);
  };

  const showCountryInfo = (countryName) => () => {
    setSearch(countryName);
    searchCountriesByName(countryName);
  };

  return (
    <div>
      <div>
        <label htmlFor="country">Find countries:</label>
        <input type="text" value={search} onChange={handleChangeSearch} />
      </div>

      <div>
        {countries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {countries.length > 1 &&
          countries.length <= 10 &&
          countries.map((country) => (
            <div key={country.name.common}>
              <span>{country.name.common}</span>
              <button
                type="button"
                onClick={showCountryInfo(country.name.common)}
              >
                show
              </button>
            </div>
          ))}
        {countries.length === 1 &&
          countries.map((country) => (
            <div key={country.name.common}>
              <h2>{country.name.common}</h2>
              <p>Capital: {country.capital[0]}</p>
              <p>Area: {country.area}</p>
              <h3>Languages:</h3>
              <ul>
                {Object.entries(country.languages).map((l) => (
                  <li key={l[0]}>{l[1]}</li>
                ))}
              </ul>
              <img
                src={country.flags.svg}
                alt=""
                style={{
                  width: "200px",
                  maxWidth: "100%",
                  display: "block",
                }}
              />
              <h3>Weather in {country.capital[0]}</h3>
              {showWeather && (
                <>
                  <p>temperature {weatherCondition.temp || "0"} Celsius</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherCondition.icon}.png`}
                    alt=""
                  />
                  <p>wind {weatherCondition.windSpeed || "0"} m/s</p>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
export default App;
