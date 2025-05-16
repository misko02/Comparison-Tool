import React, { useState, useCallback, useEffect } from 'react';
import './DashboardPage.css';
import '../components/Chart/Chart.css'
import { uploadTimeSeries } from '../services/uploadTimeSeries';
import { MyChart } from '../components/Chart/Chart';
import { fetchTimeSeriesData, TimeSeriesEntry } from '../services/fetchTimeSeries';
import { DataTable } from '../components/DataTable/DataTable';


function DashboardPage() {
  const [chartData, setChartData] = useState<Record<string, TimeSeriesEntry[]>>({});
  const [error, setError] = useState<string | null>(null);


  // Funkcja do pobierania danych
  const handleFetchData = useCallback(async (showLoadingDuringFetch = true) => {
    setError(null);
    try {
      const allSeries = await fetchTimeSeriesData();
      setChartData(allSeries);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('chartData');
    if (storedData) {
      setChartData(JSON.parse(storedData));
    } else {
      handleFetchData(); // tylko jeśli nie mamy danych
    }
  }, [handleFetchData]);

  // Zapisuj dane do localStorage gdy się zmienią
  useEffect(() => {
    if (Object.keys(chartData).length > 0) {
      localStorage.setItem('chartData', JSON.stringify(chartData));
    }
  }, [chartData]);

  // Handler dla zmiany plików w inpucie
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    await uploadTimeSeries(event, (anySuccess: any) => {
      if (anySuccess) {
        console.log("Upload finished, refreshing chart data...");
        handleFetchData(false); // Odśwież dane na wykresie po udanym uploadzie
      } else {
        console.log("Upload finished, but no files were successfully processed or no files selected.");
      }
    });
  };


  return (
    <div className="App">
      <main className="App-main-content">
        <div className="App-title">
          <h1>Data Comparison Tool</h1>
        </div>
        <div className="App-controls">
          <label htmlFor="file-upload" className="custom-file-upload">
            {'Upload files'}
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        {error && <p className="App-error" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

        <div className="Chart-container">
          {Object.keys(chartData).length === 0 && (
            <p style={{ textAlign: 'center', padding: '30px' }}>Upload data to visualize</p>
          )}

          {Object.keys(chartData).length > 0 && (
            <>
              <div className="chart-wrapper">
                <MyChart data={chartData} title="Time Series Analysis" />
              </div>
              <div className="tables-wrapper">
                {Object.entries(chartData).map(([name, series]) => (
                  <DataTable key={name} data={series} title={`Table for ${name}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <a
          className="App-link"
          href="https://github.com/misko02/Comparison-Tool"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check repository
        </a>
      </main>
    </div>
  );
};

export default DashboardPage;