import React, { useState, useCallback, useEffect } from 'react';
import './DashboardPage.css';
import '../components/Chart/Chart.css';
import { uploadTimeSeries } from '../services/uploadTimeSeries';
import { MyChart } from '../components/Chart/Chart';
import { fetchTimeSeriesData, TimeSeriesEntry } from '../services/fetchTimeSeries';
import { DataImportPopup } from '../components/DataImportPopup/DataImportPopup';

function DashboardPage() {
  const [chartData, setChartData] = useState<Record<string, TimeSeriesEntry[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State controlling popup visibility
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State storing selected files for popup
  const [isLoading, setIsLoading] = useState(false); // State indicating chart loading
  const [isDataLoaded, setIsDataLoaded] = useState(false); // State tracking if data is loaded (hides load button)

  // Funkcja do pobierania danych
  const handleFetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const allSeries = await fetchTimeSeriesData();
      setChartData(allSeries);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      if (showLoading) setIsLoading(false); // Resets isLoading after completion
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
    const files = Array.from(event.target.files || []); // Gets selected files
    if (files.length > 0) {
      setSelectedFiles(files); // Stores files in state
      setIsPopupOpen(true); // Opens popup
      await uploadTimeSeries(event, () => {});
    }
  };

  // Function handling popup import completion
  const handlePopupComplete = (results: any[]) => {
    if (results.length > 0) {
      setIsLoading(true);
      handleFetchData(false).then(() => { // Fetches data without showing loading
        setIsLoading(false); // Resets loading
        setIsDataLoaded(true); // Hides load button
      });
    }
    setIsPopupOpen(false); // Closes popup
    setSelectedFiles([]); // Clears selected files list
  };

  // Function handling popup cancellation
  const handlePopupClose = () => {
    setIsPopupOpen(false); // Closes popup
    setSelectedFiles([]); // Clears selected files list
  };

  return (
    <div className="App">
      <main className="App-main-content">
        <div className="App-title">
          <h1>Data Comparison Tool</h1>
        </div>
        {/* Load button is hidden after data is loaded */}
        {!isDataLoaded && (
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
        )}

        {error && <p className="App-error" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

        <div className="Chart-container">
          {/* Chart loading indicator */}
          {isLoading && <p style={{ textAlign: 'center', padding: '30px' }}>Loading chart...</p>}
          {!isLoading && Object.keys(chartData).length === 0 && (
            <p style={{ textAlign: 'center', padding: '30px' }}>Upload data to visualize</p>
          )}
          {!isLoading && Object.keys(chartData).length > 0 && (
            <div className="chart-wrapper">
              <MyChart data={chartData} title="Time Series Analysis" />
            </div>
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

        <DataImportPopup show={isPopupOpen} onHide={handlePopupClose} files={selectedFiles} onComplete={handlePopupComplete} />
      </main>
    </div>
  );
}

export default DashboardPage;