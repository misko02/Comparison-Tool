export type TimeSeriesEntry = {
        x: string;
        y: number;
    };

interface ApiTimeSeriesResponse {
    timeseries1: Array <{ log_date: string; value: number }>;
}

export const fetchTimeSeriesData = async (): Promise<TimeSeriesEntry[]> => {
    try {
        const response = await fetch("/timeseries");
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${errorBody}`);
        }
        const jsonData: ApiTimeSeriesResponse = await response.json();

        // Upewnij się, że 'timeseries1' istnieje i jest tablicą
        if (!jsonData.timeseries1 || !Array.isArray(jsonData.timeseries1)) {
            console.error("Invalid data structure received from /timeseries:", jsonData);
            throw new Error("Invalid data structure for timeseries1.");
        }

        // Mapowanie danych do formatu TimeSeriesEntry
        const formattedData: TimeSeriesEntry[] = jsonData.timeseries1.map((item) => {
            if (typeof item.log_date !== 'string' || typeof item.value !== 'number') {
                console.warn("Skipping invalid item in timeseries1:", item);
                return null;
            }
            return {
                x: item.log_date,
                y: item.value
            };
        }).filter(item => item !== null) as TimeSeriesEntry[];

        console.log("Fetched and formatted data:", formattedData);
        return formattedData;
    } catch (error) {
        console.error("Failed to fetch time series data:", error);
        throw error;
    }
};