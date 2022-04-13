import axios from 'axios'
import { useState, useEffect } from 'react'

const Weather = ({ capital }) => {

  const [weather, setWeather] = useState([])
  const [icon, setIcon] = useState("")
  const api_key = process.env.REACT_APP_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
  const weatherHook = () => {
    console.log("weather tingz")
    axios.get(url)
      .then(response => {
        setWeather(response.data)
        setIcon(`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
      })
  }
  useEffect(weatherHook, [])

  return (
    <div>
      <div>temperature {(weather?.main?.temp-272)} Celsius</div>
      <div><img alt="icon" src={icon} /></div>
      <div>wind {weather?.wind?.speed} m/s</div>
    </div>
  )

}

const DetailedCountry = ({ country }) => {
  return (
    <div>
      <h1>{country.name.official}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <div>
        <h2>languages:</h2>
        <ul>
          {Object.keys(country.languages).map((key, index) =>
            <li key={index}>{country.languages[key]}</li>
          )}
        </ul>
        <div><img src={country.flags.png} alt="Country flag" width = "180px" height = "110px" ></img></div>
      </div>
      <div>
        <h2>Weather in {country.capital}</h2>
        <Weather capital={country.capital} />
      </div>
    </div>

  )
}

const Countries = ({ countries, handleShowCountry, filter }) => {
  if (filter === "") {
    return (
      <div></div>
    )
  }
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  if (countries.length === 1) {
    return (
      <DetailedCountry country={countries[0]} />
    )
  }
  else {
    return (
      <ShowNations countries={countries} handleShowCountry={handleShowCountry} />
    )
  }
}
const ShowNations = ({ countries, handleShowCountry }) => {
  return (
    <div>
      {countries.map((country, i) =>
        <div key={i}>
          {country.name.official}
          <button type="button" value={country.name.official} onClick={handleShowCountry}> show </button>
        </div>
      )}
    </div>
  )
}


function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleShowCountry = (event) => {
    event.preventDefault()
    setFilter(event.target.value)
  }

  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all').then(response => {
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  const filterCountries = countries.filter(country => country.name.official.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <form>
        find countries<input value={filter} onChange={handleFilter} />
      </form>
      <Countries countries={filterCountries} handleShowCountry={handleShowCountry} filter ={filter} />
    </div>
  );
}

export default App;
