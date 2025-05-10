import {useState} from "react";
import Plot from "react-plotly.js";
import {TimeSeriesEntry} from "@/services/fetchTimeSeries";

interface MyChartProps {
    data: TimeSeriesEntry[];
    title?: string;
}

export const MyChart: React.FC<MyChartProps> = ({data, title}) => {
    const [xaxisRange, setXaxisRange] = useState<[string | null, string | null]>([null, null]);
    const [tickFormat, setTickFormat] = useState('%d.%m.%Y'); // przed zoomem tylko dzień
    const [showMarkers, setShowMarkers] = useState(false);

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
        }
        else if (event['xaxis.autorange'] === true) {
            setXaxisRange([null, null]); // Resetowanie zakresu osi X
            setTickFormat('%d.%m.%Y'); // Przywrócenie domyślnego formatu
            setShowMarkers(false); // Przywrócenie domyślnych markerów
        }
    };


    return (
            <Plot
                data={[
                    {
                        x: data.map(d => d.x),
                        y: data.map(d => d.y),
                        type: 'scattergl',
                        mode: showMarkers ? 'lines+markers' : 'lines',
                        name: title || 'Time Series',
                        line: {color: '#007bff'},
                        marker: { size: 5, color: '#8884d8' },
                    },
                ]}
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
                        rangeselector: {buttons: [{count: 1, label: "1d", step: "day", stepmode: "backward"}, {count: 7, label: "1w", step: "day", stepmode: "backward"}, {count: 1, label: "1m", step: "month", stepmode: "backward"}, {step: "all"}]},
                        range: xaxisRange[0] && xaxisRange[1] ? xaxisRange : undefined,
                    },

                    yaxis: {
                        title: 'Value',
                        range: [0, 100],
                        fixedrange: true,
                        showspikes: true,
                        spikemode: 'across',
                        spikedash: "solid",
                        spikethickness: 1
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
        );
};
