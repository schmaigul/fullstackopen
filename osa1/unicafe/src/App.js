import { useState } from 'react'

const Header = (props) => (
  <div>
    <h1>{props.text}</h1>
  </div>
)

const Button = (props) => (
  <button onClick = {props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => (
  <tr>
    <td>{props.text}</td> 
    <td>{props.value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  if (good+neutral+bad == 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  console.log(good, neutral, bad)
  const sum = good + neutral + bad
  const average = (good + bad*(-1))/sum
  const positive = (100*(good/sum)) + "%"
  return (
      <table>
        <tbody>
          <StatisticLine text = "good" value =  {good}/>
          <StatisticLine text = "neutral" value =  {neutral}/>
          <StatisticLine text = "bad" value = {bad} />
          <StatisticLine text= "all" value={sum} />
          <StatisticLine text= "average" value={average} />
          <StatisticLine text = "positive" value = {positive}/>
        </tbody>
      </table>
  )
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  return (
    <div>
      <Header text = "give feedback"/>
      <Button handleClick={() => setGood(good + 1)} text = "good"/>
      <Button handleClick={() => setNeutral(neutral + 1)} text = "neutral"/>
      <Button handleClick={() => setBad(bad + 1)} text = "bad"/>
      <Header text = "statistics"/>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App