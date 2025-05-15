import {useState, useEffect} from "react";
import Plot from "react-plotly.js";
import {TimeSeriesEntry} from "@/services/fetchTimeSeries";

interface MyChartProps {
    data: Record<string, TimeSeriesEntry[]>;
    title?: string;
}

export const MyChart: React.FC<MyChartProps> = ({data, title}) => {
    const [xaxisRange, setXaxisRange] = useState<[string | null, string | null]>([null, null]);
    const [tickFormat, setTickFormat] = useState('%d.%m.%Y'); // przed zoomem tylko dzień
    const [showMarkers, setShowMarkers] = useState(false);
    const [customRange, setCustomRange] = useState(false);
    const [customYMin, setCustomYMin] = useState<string>('');
    const [customYMax, setCustomYMax] = useState<string>('');

    const handleRelayout = (event: any) => {
        if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
            const rangeStart = new Date(event['xaxis.range[0]']);
            const rangeEnd = new Date(event['xaxis.range[1]']);
            const diffMs = rangeEnd.getTime() - rangeStart.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 24 * 3) {
                setTickFormat('%d.%m %H:%M'); // zmiana formatu na dzień i godziny
                setShowMarkers(diffHours < 3); // jeżeli mniej niż 3h, to pokaż markery
            } else if (diffHours < 24 * 5) { // mniej niż 5 dni
                 setTickFormat('%d.%m.%Y %H:%M');
                 setShowMarkers(false);
            }
            else {
                setTickFormat('%d.%m.%Y');
                setShowMarkers(false);
            }
            setXaxisRange([event['xaxis.range[0]'], event['xaxis.range[1]']]);
        } else if (event['xaxis.autorange'] === true) {
            setXaxisRange([null, null]); // Resetowanie zakresu osi X
            setTickFormat('%d.%m.%Y'); // Przywrócenie domyślnego formatu
            setShowMarkers(false); // Przywrócenie domyślnych markerów
        }
    };

    const colors = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
        '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
        '#bcbd22', '#17becf'
    ];

    const traces = Object.entries(data).map(([name, series], index) => ({
        x: series.map(d => d.x),
        y: series.map(d => d.y),
        type: 'scattergl' as const,
        mode: showMarkers ? 'lines+markers' as const : 'lines' as const,
        name: name,
        line: {color: colors[index % colors.length]},
        marker: {size: 5, color: colors[index % colors.length]},
    }));

    return (
        <>


            <Plot
                data={traces}
                layout={{
                    title: title || 'Time Series Data',
                    xaxis: {
                        title: 'Time',
                        type: 'date',
                        tickformat: tickFormat, // Wyświetlanie daty i godziny
                        fixedrange: false,
                        showspikes: true,
                        spikemode: 'across',
                        spikesnap: "cursor",
                        spikedash: "solid",
                        spikethickness: 1,
                    },
                    height: 600,
                    legend: {orientation: "h"},
                    paper_bgcolor: '#f8f9fa',
                    plot_bgcolor: 'white',
                    dragmode: 'pan'
                }}
                style={{width: '80%'}}
                config={{responsive: true,
                scrollZoom: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['select2d', 'lasso2d']}}
                onRelayout={handleRelayout}
            />
                        <div style={{margin: '20px', textAlign: 'center'}}>
                <label>
                    Y Min:
                    <input
                        type="number"
                        value={customYMin}
                        onChange={(e) => setCustomYMin(e.target.value)}
                        style={{margin: '0 10px', width: '40px'}}
                    />
                </label>
                <label>
                    Y Max:
                    <input
                        type="number"
                        value={customYMax}
                        onChange={(e) => setCustomYMax(e.target.value)}
                        style={{margin: '0 10px', width: '40px'}}
                    />
                </label>
                <button
                    onClick={() => setCustomRange(true)}
                    style={{marginLeft: '10px'}}
                >
                    Apply
                </button>
                <button
                    onClick={() => {
                        setCustomYMin('');
                        setCustomYMax('');
                        setCustomRange(false);
                    }}
                    style={{marginLeft: '10px', marginTop: '20px'}}
                >
                    Reset
                </button>
            </div>
        </>
    );
};
