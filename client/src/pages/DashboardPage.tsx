// src/DashboardPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import './DashboardPage.css';
import '../components/Chart/Chart.css';
import { sendProcessedTimeSeriesData } from '../services/uploadTimeSeries';
import { MyChart } from '../components/Chart/Chart';
import { fetchTimeSeriesData, TimeSeriesEntry } from '../services/fetchTimeSeries';
import { DataImportPopup } from '../components/DataImportPopup/DataImportPopup';


function DashboardPage() {
  const [chartData, setChartData] = useState<Record<string, TimeSeriesEntry[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchData = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoading(true);
    setError(null);
    try {
      const allSeries = await fetchTimeSeriesData();
      setChartData(allSeries);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
      setChartData({}); // Wyczyść dane w przypadku błędu
    } finally {
      if (showLoadingIndicator) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('chartData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setChartData(parsedData);
      } catch (e) {
        localStorage.removeItem('chartData');
        handleFetchData();
      }
    } else {
      handleFetchData();
    }
  }, [handleFetchData]);

  useEffect(() => {
    if (Object.keys(chartData).length > 0) {
      localStorage.setItem('chartData', JSON.stringify(chartData));
    }
  }, [chartData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setIsPopupOpen(true);
    }
    event.target.value = '';
  };

  const handlePopupComplete = async (processedData: Record<string, any[]>) => {
    setIsPopupOpen(false); // Zamknij popup najpierw

    if (Object.keys(processedData).length > 0) {
      setIsLoading(true);
      setError(null);
      await sendProcessedTimeSeriesData(processedData, (success) => {
        if (!success) {
          setError("Przetwarzanie danych lub wysyłanie na serwer nie powiodło się.");
        }
        setIsLoading(false);
      });
    } else {
        console.log("Nie przetworzono żadnych danych z plików.");
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedFiles([]);
  };

    const handleReset = async () => {
    setIsLoading(true); // Pokaż wskaźnik ładowania podczas resetowania
    setError(null);
    setChartData({}); // Wyczyść dane na wykresie
      localStorage.removeItem('chartData');

    try {
      const resp = await fetch('/clear-timeseries', { method: 'DELETE' });
      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Failed to clear timeseries on backend:", errorText);
        setError(`Nie udało się wyczyścić danych na serwerze: ${errorText}. Dane na wykresie zostały zresetowane.`);
      } else {
        console.log("Timeseries data cleared on backend.");
      }
    } catch (err: any) {
      console.error("Error clearing timeseries on backend:", err);
      setError(`Błąd podczas czyszczenia danych na serwerze: ${err.message}. Dane na wykresie zostały zresetowane.`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="App">
      <main className="App-main-content">
        <div className="App-title">
          <h1>Data Comparison Tool</h1>
        </div>

        <div className="App-controls">
          <label htmlFor="file-upload" className={`custom-file-upload ${isLoading ? 'disabled' : ''}`}>
            {isLoading ? 'Loading...' : 'Upload files'}
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            disabled={isLoading}
          />
        </div>
           <button
              onClick={handleReset}
              className="custom-reset-button"
              disabled={isLoading}
            >
              Reset data
            </button>
        {error && <p className="App-error" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

        <div className="Chart-container">
          {isLoading && Object.keys(chartData).length === 0 && <p style={{ textAlign: 'center', padding: '30px' }}>Loading chart...</p>}
          {!isLoading && Object.keys(chartData).length === 0 && !error && (
            <p style={{ textAlign: 'center', padding: '30px' }}>Load data to visualize</p>
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

        <DataImportPopup
            show={isPopupOpen}
            onHide={handlePopupClose}
            files={selectedFiles}
            onComplete={handlePopupComplete}
        />
      </main>
    </div>
  );
}

export default DashboardPage;