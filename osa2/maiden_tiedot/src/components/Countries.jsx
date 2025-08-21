import axios from 'axios'
import Country from './Country'
import { useState, useEffect } from 'react'
import CountryList from './CountryList'

const Countries = ({filteredData}) => {
    const [countryData, setCountryData] = useState(null)

    useEffect(() => {
        if (filteredData.length === 1) {
            axios
                .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filteredData[0]}`)
                .then(response => {
                    setCountryData(response.data)
                })
        } else {
            setCountryData(null)
        }
    }, [filteredData])

    const handleShow = (country) => {
        axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
            .then(response => {
                setCountryData(response.data)
            })
    }

    if (countryData) {
        // jos tasan 1 match, hypätään maakohtaiselle sivulle suoraan
        console.log("going to a country specific page: ", countryData)
        return <Country data={countryData} />
    }

    if (filteredData.length > 10) {
        // skippaa jos yli 10
        return <p>Too many matches, specify another filter</p>
    } else if (filteredData.length > 1) {
        // 1-10 välillä näytä maiden nimet + show napit
        return <CountryList countries={filteredData} handleShow={handleShow} />
    } else if (filteredData.length === 1) {
        return <p>Loading...</p>
    } else { // 0 matchia
        return <p>No countries found</p>
    }
}

export default Countries