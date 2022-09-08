import { useState } from 'react';

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>;

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}:</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  console.log(good === 0 || neutral === 0 || bad === 0);
  if (all < 1) {
    return <p>No feedback given.</p>;
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="Average" value={average} />
        <StatisticLine text="Positive" value={`${positive} %`} />
      </tbody>
    </table>
  );
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = (good + (neutral * 0) + (bad * -1)) / all;
  const positive = (good / all) * 100;

  const handleGoodClick = () => setGood(prev => prev + 1);
  const handleNeutralClick = () => setNeutral(prev => prev + 1);
  const handleBadClick = () => setBad(prev => prev + 1);

  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <Button handleClick={handleGoodClick} text="good" />
        <Button handleClick={handleNeutralClick} text="neutral" />
        <Button handleClick={handleBadClick} text="bad" />
      </div>

      <h2>Statistics</h2>
      <Statistics
        average={average}
        bad={bad}
        neutral={neutral}
        good={good}
        positive={positive}
        all={all}
      />


    </div>
  );
}

export default App;
