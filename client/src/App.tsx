import {useState} from 'react';
import './App.css';
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush} from "recharts";

function App() {

    type TimeSeriesEntry = {
        date: string;
        value: number;
    };

    const [data, setData] = useState<TimeSeriesEntry[]>([]);
    const fetchTimeSeries = async () => {
        fetch("/timeseries").then(
            res => res.json()
        ).then(
            data => {
                const formattedData = data.map((item: { log_date: string; value: number; }) => ({
                    x: new Date(item.log_date).toLocaleTimeString(),
                    y: item.value // Keeping value in case it's useful later
                }));
                setData(formattedData);
                console.log(data)
            }
        )
    }


    return (
        <div className="App">
            <header className="App-header">
                <nav className='App-nav'>
                    <ul>
                        <li>
                            <a href="/">test </a>
                        </li>
                        <li>
                            <a href="/comparison">test</a>
                        </li>
                        <li>
                            {/*change it later, for now I had problem with icon libraries*/}
                            <a href="/settings">⚙</a>
                        </li>
                    </ul>
                </nav>
                <div className="App-title">

                    <h1> Template for Comparison Tool</h1>
                </div>
                <a
                    className="App-link"
                    href="https://github.com/misko02/Comparison-Tool"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Check repository
                </a>
                <button type="button" onClick={fetchTimeSeries}>Download data</button>
                {data.length > 0 && (
                    <ResponsiveContainer width="90%" height={300}>
                        <LineChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 10}}>
                            <XAxis dataKey="x"/>
                            <YAxis domain={[0, 100]}/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="y" dot={false}/>
                            <Brush dataKey="x" height={30} stroke="#8884d8"/>
                        </LineChart>
                    </ResponsiveContainer>
                )}

            </header>
        </div>
    );
}

export default App;