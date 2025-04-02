import {useState} from 'react';
import './App.css';
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush} from "recharts";

function App() {

    type TimeSeriesEntry = {
        x: string;
        y1: number;
        y2: number;
    };

    const [data, setData] = useState<TimeSeriesEntry[]>([]);
    const fetchTimeSeries = async () => {
        fetch("/timeseries").then(
            res => res.json()
        ).then(
            data => {
                const formattedData = data.timeseries1.map((item: {
                    log_date: string;
                    value: number
                }, index: number) => ({
                    x: new Date(item.log_date).toLocaleTimeString(),
                    y1: item.value, // Pierwszy szereg
                    y2: data.timeseries2[index] ? data.timeseries2[index].value : null // Drugi szereg (jeśli istnieje)
                }));
                setData(formattedData);
                console.log(data)
            }
        )
    }

    const calculateAverageDifference = () => {
        const diffs = data.map(d => Math.abs(d.y1 - d.y2));
        return Math.round(diffs.reduce((sum, val) => sum + val, 0) / diffs.length);
    };
    const calculateMaxDifference = () => {
        const diffs = data.map(d => Math.abs(d.y1 - d.y2));
        return Math.round(Math.max(...diffs));
    };
    const calculateMinDifference = () => {
        const diffs = data.map(d => Math.abs(d.y1 - d.y2));
        return Math.round(Math.min(...diffs));
    };

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
                    <h1> Data Comparison Tool</h1>
                </div>
                <div className="App-measure">
                    <p>Average difference: {calculateAverageDifference()}</p>
                    <p>Max difference: {calculateMaxDifference()}</p>
                    <p>Min difference: {calculateMinDifference()}</p>
                </div>
                <button type="button" onClick={fetchTimeSeries}>Download data</button>
                {data.length > 0 && (
                    <ResponsiveContainer width="90%" height={300}>
                        <LineChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 10}}>
                            <XAxis dataKey="x"/>
                            <YAxis domain={[0, 100]}/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="y1" stroke="#8884d8" dot={false} name="Timeseries 1"/>
                            <Line type="monotone" dataKey="y2" stroke="#82ca9d" dot={false} name="Timeseries 2"/>
                            <Brush dataKey="x" height={30} stroke="#8884d8"/>
                        </LineChart>
                    </ResponsiveContainer>
                )}
                <a
                    className="App-link"
                    href="https://github.com/misko02/Comparison-Tool"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Check repository
                </a>
            </header>

        </div>

    );
}

export default App;