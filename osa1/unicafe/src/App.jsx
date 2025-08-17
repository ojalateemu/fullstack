import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const Header = (props) => <h2>{props.text}</h2>

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({g, n, b}) => {
  if (g + n + b === 0) {
    return <p>No feedback given</p>
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={g} />
        <StatisticLine text="neutral" value={n} />
        <StatisticLine text="bad" value={b} />
        <StatisticLine text="all" value={g + n + b} />
        <StatisticLine text="average" value={(g - b) / (g + n + b)} />
        <StatisticLine text="positive" value={(g / (g + n + b)) * 100 + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <Header text="Give feedback" />
      <div>
        <Button onClick={() => setGood(good + 1)} text="good" />
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button onClick={() => setBad(bad + 1)} text="bad" />
      </div>
      <Header text="Statistics" />
      <Statistics g={good} n={neutral} b={bad} />
    </>
  )
}

export default App