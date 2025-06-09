import React, { useEffect, useState, useCallback } from 'react';
import { fetchRawTimeSeriesData } from '../services/fetchTimeSeries';
import { DataTable } from '../components/DataTable/DataTable';

const DataPage: React.FC = () => {
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const allSeries = await fetchRawTimeSeriesData(); // użycie nowej funkcji
      setChartData(allSeries);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App-main-content">
      <h1>Data Page</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

      {Object.keys(chartData).length === 0 ? (
        <p style={{ textAlign: 'center', padding: '30px' }}>No data available.</p>
      ) : (
        Object.entries(chartData).map(([name, series]) => (
          <DataTable key={name} data={series} title={name} />
        ))
      )}
    </div>
  );
};

export default DataPage;