import {useState} from 'react';
import './App.css';
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush, Legend} from "recharts";
import Plot from 'react-plotly.js';


function App() {

    type TimeSeriesEntry = {
        x: string;
        y1: number;
        y2: number;
    };
    const uploadTimeSeries = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const jsonData = JSON.parse(content);

                const response = await fetch("/upload-timeseries", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(jsonData)
                });

                if (!response.ok) {
                    throw new Error("Failed to upload timeseries");
                }
                const result = await response.json();
                console.log("Upload successful:", result);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
            };
        reader.readAsText(file);
        };

    const [data, setData] = useState<TimeSeriesEntry[]>([]);
    const fetchTimeSeries = async () => {

            }
            const data = await response.json();

            const formattedData = data.timeseries1.map((item: { log_date: string; value: number }, index: number) => ({
                x: new Date(item.log_date).toLocaleTimeString(),
                y1: item.value
                // y2: data.timeseries2[index] ? data.timeseries2[index].value : null
            }));

            setData(formattedData);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
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
                <button type="button" onClick={fetchTimeSeries}>Visualize data</button>
                <input type="file" accept=".json"  onChange={uploadTimeSeries} />

                {data.length > 0 && (
                    <Plot
                        data={[
                            {
                                x: data.map(d => d.x),
                                y: data.map(d => d.y1),
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Timeseries 1',
                                line: {color: '#8884d8'},
                                customdata: data.map(d => d.y2),
                                hovertemplate: '%{x|%Y-%m-%d %H:%M:%S}<br>Value: %{y}</br>Timeseries 2: %{customdata}<extra></extra>'
                            },
                            {
                                x: data.map(d => d.x),
                                y: data.map(d => d.y2),
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Timeseries 2',
                                line: {color: '#82ca9d'},
                                hovertemplate: '%{x|%Y-%m-%d %H:%M:%S}<br>Value: %{y}<extra></extra>'
                            }
                        ]}
                        layout={{
                            title: 'Time Series Comparison',
                            xaxis: {title: 'Time', type: 'date', tickformat: '%d.%m.%Y', dtick: "d1", fixedrange: false, showspikes: true, spikemode: 'across', spikesnap: "cursor", spikedash: "solid", spikethickness: 1},
                            yaxis: {title: 'Value', range: [0, 100], fixedrange: true, showspikes: true, spikemode: 'across', spikedash: "solid", spikethickness: 1},
                            height: 600,
                            autosize: true,
                            legend: {orientation: "h"},
                            paper_bgcolor: 'white',
                            plot_bgcolor: 'white'
                        }}

                        useResizeHandler={true}
                        style={{width: '80%', height: '100%', backgroundColor : 'red'}}
                        config={{responsive: true}}
                    />
                )}
                {/*{data.length > 0 && (*/}
                {/*    <ResponsiveContainer width="90%" height={300}>*/}
                {/*        <LineChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 10}}>*/}
                {/*            <XAxis dataKey="x"/>*/}
                {/*            <XAxis scale="utc"/>*/}
                {/*            <YAxis domain={[0, 100]}/>*/}
                {/*            <Tooltip/>*/}
                {/*            <Legend />*/}
                {/*            <Line type="monotone" dataKey="y1" stroke="#8884d8" dot={false} name="Timeseries 1"/>*/}
                {/*            <Line type="monotone" dataKey="y2" stroke="#82ca9d" dot={false} name="Timeseries 2"/>*/}
                {/*            <Brush dataKey="x" height={30} stroke="#8884d8"/>*/}
                {/*        </LineChart>*/}
                {/*    </ResponsiveContainer>*/}
                {/*)}*/}
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