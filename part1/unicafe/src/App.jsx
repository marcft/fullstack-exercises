import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total <= 0) {
    return <p>No feedback given</p>
  }

  return (
    <>
      <h2>Statistics</h2>
      <div>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>
      </div>
      <div>
        <p>all {total}</p>
        <p>average {(good - bad) / total}</p>
        <p>positive {(good / total) * 100} % </p>
      </div>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>Give feedback</h1>
      <div>
        <button onClick={() => setGood(good + 1)}>good</button>
        <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
        <button onClick={() => setBad(bad + 1)}>bad</button>
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App
