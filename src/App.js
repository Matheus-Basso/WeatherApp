import React, { useState, useEffect } from "react";

import "./App.css";

function App() {
  const api = {
    key: "f24cf78be7a65457790d9c68d64016ee",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  var now = new Date();
  var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  const hourDiff = weather.timezone / 3600;

  function adjustTimezone() {
    if (hourDiff > 0) {
      const localTime = utc.setHours(utc.getHours() + hourDiff);
      return localTime;
    } else {
      const localTime = utc.setHours(utc.getHours() - hourDiff * -1);
      return localTime;
    }
  }

  let timezoneMs = adjustTimezone(weather.timezone);
  const startTime = new Date(timezoneMs);

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
          setQuery("");
          console.log(result);
        });
    }
  };

  const dateBuilder = () => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const hourDiff = weather.timezone / 3600;

    if (hourDiff > 0) {
      const localTime = utc.setHours(utc.getHours() + hourDiff);
      const d = new Date(localTime);
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    } else {
      const localTime = utc.setHours(utc.getHours() - hourDiff * -1);
      const d = new Date(localTime);
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    }
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function Clock({ timezone, utc }) {
    // var now = new Date();
    // var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const [clockState, setClockState] = useState();

    const hourDiff = timezone / 3600;

    function adjustTimezone() {
      if (hourDiff > 0) {
        const localTime = utc.setHours(utc.getHours() + hourDiff);
        return localTime;
      } else {
        const localTime = utc.setHours(utc.getHours() - hourDiff * -1);
        return localTime;
      }
    }

    let timezoneMs = adjustTimezone(timezone);

    useEffect(() => {
      timezoneMs = timezoneMs + 1000;
      let time = new Date(timezoneMs);
      setClockState(time.toLocaleTimeString());
      const interval = setInterval(() => {
        timezoneMs = timezoneMs + 1000;
        let time = new Date(timezoneMs);
        setClockState(time.toLocaleTimeString());
      }, 1000);
      return function () {
        clearInterval(interval);
      };
    }, [timezone, clockState]);

    if (hourDiff > 0) {
      return (
        <div>
          {clockState} (GMT+{hourDiff})
        </div>
      );
    } else if (hourDiff < 0) {
      return (
        <div>
          {clockState} (GMT{hourDiff})
        </div>
      );
    } else if (hourDiff === 0) {
      return <div>{clockState} (GMT)</div>;
    }

    return <div>{clockState}</div>;
  }

  function background() {
    if (Object.keys(weather).length !== 0) {
      console.log(startTime.getHours());
      if (startTime.getHours() < 19 && startTime.getHours() > 6) {
        if (weather.weather[0].main === "Clear") {
          return "day-clear";
        } else if (weather.weather[0].main === "Clouds") {
          return "day-cloudy";
        } else if (weather.weather[0].main === "Snow") {
          return "day-snow";
        } else if (
          weather.weather[0].main === "Rain" ||
          weather.weather[0].main === "Drizzle" ||
          weather.weather[0].main === "Tornado"
        ) {
          return "day-rain";
        } else if (
          weather.weather[0].main === "Haze" ||
          weather.weather[0].main === "Mist" ||
          weather.weather[0].main === "Smoke" ||
          weather.weather[0].main === "Dust" ||
          weather.weather[0].main === "Fog" ||
          weather.weather[0].main === "Sand" ||
          weather.weather[0].main === "Ash" ||
          weather.weather[0].main === "Squall"
        ) {
          return "day-fog";
        }
        return "day-clear";
      } else if (startTime.getHours() >= 19 || startTime.getHours() < 6) {
        if (weather.weather[0].main === "Clear") {
          return "night-clear";
        } else if (weather.weather[0].main === "Clouds") {
          return "night-cloudy";
        } else if (weather.weather[0].main === "Snow") {
          return "night-snow";
        } else if (
          weather.weather[0].main === "Rain" ||
          weather.weather[0].main === "Drizzle" ||
          weather.weather[0].main === "Tornado"
        ) {
          return "night-rain";
        } else if (
          weather.weather[0].main === "Haze" ||
          weather.weather[0].main === "Mist" ||
          weather.weather[0].main === "Smoke" ||
          weather.weather[0].main === "Dust" ||
          weather.weather[0].main === "Fog" ||
          weather.weather[0].main === "Sand" ||
          weather.weather[0].main === "Ash" ||
          weather.weather[0].main === "Squall"
        ) {
          return "night-fog";
        }
        return "night-clear";
      }
    }
    return "blank";
  }

  return (
    <>
      <div id="back-color">
        <div id="container" className={background()}>
          <main>
            <div className="search-box">
              <input
                type="text"
                className="search-bar"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                onKeyPress={search}
              />
            </div>
            {typeof weather.main != "undefined" ? (
              <div>
                <div className="location-box">
                  <div className="location">
                    {weather.name}, {weather.sys.country}
                  </div>
                  <div className="date">
                    <p>{dateBuilder()}</p>
                  </div>
                  <div className="clock">
                    <Clock timezone={weather.timezone} utc={utc} />
                  </div>
                </div>
                <div className="weather-box">
                  <div className="temp">{Math.round(weather.main.temp)}°c</div>
                  <div className="weather">
                    {toTitleCase(weather.weather[0].main)}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
