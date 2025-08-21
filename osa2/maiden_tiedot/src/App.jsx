import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [country, setCountry] = useState('')
  const [show, setShow] = useState([])
  const [empty, setEmpty] = useState(true)

  const urlAll = 'https://studies.cs.helsinki.fi/restcountries/api/all'

  useEffect(() => {
    console.log('effect run, country is: ', country)
    // skip if keyword in country filter === ''
    if (country.length > 0) {
      setEmpty(false)
      console.log('fetching all countries data...')
      axios
        .get(urlAll)
        .then(response => {
          console.log("inside useEffect after axios request. Fetching every country: ", response.data)
          handleResults(response.data)
        })
    } else { 
      setEmpty(true)
    }
  }, [country])

  const handleChange = (event) => {
    setCountry(event.target.value)
  }

  const handleResults = (data) => {
    // filteröi tulokset keywordin 'country' mukaan
    const keyword = country
    // transform the object into an array taking only the country names
    const firstFiltering = data
      .filter(country => country.name.common.toLowerCase().includes(keyword.toLowerCase()))
    const filteredData = firstFiltering.length > 0 ? firstFiltering.map(country => country.name.common) : firstFiltering
    console.log("filtered results in handleResults: ", filteredData)
    setShow(filteredData)
  }

  return (
    <div>
      <form>
        find countries: <input value={country} onChange={handleChange} />
      </form>
      { (!empty) ? <Countries filteredData={show} /> : <p>Type a country name to search</p> }
    </div>
  )
}

export default App