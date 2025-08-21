import axios from 'axios'
import { useState, useEffect } from 'react'


const Country = ({data}) => {
    // weather data fetching
    const [weatherData, setWeatherData] = useState(null)
    const api_key = import.meta.env.VITE_SOME_KEY // api key
    
    if (!data) {
        return <p>Loading...</p>
    }
    console.log("Country data: ", data)

    if (api_key) { // only use api key if it is defined
        useEffect(() => {
            if (!data || !data.capital) return;
                axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${data.capital}&units=metric&appid=${api_key}`)
                    .then(response => {
                        setWeatherData(response.data)
                    })
        }, [data]);
    }
    

    return (
    <>
        <h2>{data.name.common}</h2>
        <p>Capital: {data.capital}</p>
        <p>Area: {data.area}</p>
        <h3>Languages</h3>
        <ul>
            {Object.values(data.languages).map((lang, index) => (
                <li key={index}>{lang}</li>
            ))}
        </ul>
        <img src={data.flags.png} alt={`Flag of ${data.name.common}`} />
        
        {weatherData && (
            <>
                <h3>Weather in {data.capital}</h3>
                <p>Temperature: {weatherData.main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt="Weather icon" />
                <p>Wind: {weatherData.wind.speed} m/s</p>
            </>
        )}
    </>
    )
}

export default Country
