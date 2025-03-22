import { useState } from 'react';
import './App.css';
import { FaChartLine, FaHome} from "react-icons/fa";
function App() {

  const [data, setData] = useState([{}])

const fetchTimeSeries = async () =>{
  fetch("/timeseries").then(
    res => res.json()
  ).then(
    data => {
      setData(data.timeseries)
      console.log(data.timeseries)
    }
  )
}


  return (
    <div className="App">
      <header className="App-header">

      <nav className='App-nav'>
        <ul>
          <li>
            <a href="/"><FaHome /></a>
          </li>
          <li>
            <a href="/comparison"><FaChartLine /></a>
          </li>
          <li>
            {/*change it later, for now I had problem with icon libraries*/}
            <a href="/settings">⚙</a>
          </li>
        </ul>
      </nav>
        <h1> Template for Comparison Tool</h1> 
 
        <a
          className="App-link"
          href="https://github.com/misko02/Comparison-Tool"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check repository
        </a>
          <button type = "button" onClick={fetchTimeSeries}>Download data</button>
        <p>
        {data.length > 1 && <table>
          <tr>
            <th> index </th>
            <th> date </th>  
          </tr>  
          {data.map((item, index) => (
            <tr>
              <td> {index} </td>
              <td> {String(item)} </td>
            </tr>
          ))}
        </table>
      } 
        </p>
      </header>
    </div>
  );
}

export default App;