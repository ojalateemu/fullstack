const CountryList = ({countries, handleShow}) => {
    return (
        countries.map(c => 
            <p key={c}>
                {c} <button onClick={() => handleShow(c.toLowerCase())}>Show</button>
            </p>
        )
    )
}

export default CountryList