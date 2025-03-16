import { useEffect, useState } from 'react';
import './App.css';


function App() {

  const [data, setData] = useState([{}])

useEffect(() =>{
  fetch("/timeseries").then(
    res => res.json()
  ).then(
    data => {
      setData(data.timeseries)
      console.log(data.timeseries)
    }
  )
}, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1> Template for Comparison Tool</h1> 
 
        <a
          className="App-link"
          href="https://github.com/misko02/Comparison-Tool"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check repository
        </a>
        <p>
          {data.map((item, index) => (
            <div key={index}>
              <p>{String(item)}</p>
            </div>
          ))}
        </p>
      </header>
    </div>
  );
}

export default App;