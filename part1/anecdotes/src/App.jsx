import { useState } from 'react'

const BestAnecdote = ({ anecdotes, points }) => {
  let bestAnecdote
  let maxVote = 0
  for (let i = 0; i < points.length; i++) {
    if (points[i] > maxVote) {
      maxVote = points[i]
      bestAnecdote = anecdotes[i]
    }
  }

  // Any anecdote have votes
  if (!bestAnecdote) {
    return <p>No votes have been done yet</p>
  }

  return <p>{bestAnecdote}</p>
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(8).fill(0))

  const handleNext = () => {
    let random = Math.trunc(Math.random() * anecdotes.length)

    setSelected(random)
  }

  const handleVotes = () => {
    const copy = [...points]
    copy[selected]++
    setPoints(copy)
  }

  return (
    <>
      <section>
        <h2>Anecdote of the day</h2>
        <p>{anecdotes[selected]}</p>
        <p>has {points[selected]} votes</p>
        <button onClick={handleVotes}>vote</button>
        <button onClick={handleNext}>next anecdote</button>
      </section>
      <section>
        <h2>Anecdote with most votes</h2>
        <BestAnecdote anecdotes={anecdotes} points={points} />
      </section>
    </>
  )
}

export default App
