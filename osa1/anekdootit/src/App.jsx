import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
const Header = ({text}) => <h2>{text}</h2>
const Anecdote = ({a}) => <p>{a}</p>
const Votes = ({count}) => <p>has {count} votes</p>

const PopularAnecdote = ({anecdotes, votes}) => {
  const maxVotes = Math.max(...votes)
  const mostVotedIndex = votes.indexOf(maxVotes)
  return (
    <>
    <p>{anecdotes[mostVotedIndex]}</p>
    <p>has {maxVotes} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleNext = () => {
    const newIndex = Math.floor(Math.random() * anecdotes.length)
    console.log('New selected anecdote index:', newIndex)
    setSelected(newIndex)
  }

  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
    console.log('Updated votes:', newVotes)
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Anecdote a={anecdotes[selected]} />
      <Votes count={votes[selected]} />
      <Button onClick={handleVote} text="Vote" />
      <Button onClick={handleNext} text="Next Anecdote" />
      <Header text="Anecdote with most votes" />
      <PopularAnecdote anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App