// src/DashboardPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import './DashboardPage.css';
import '../components/Chart/Chart.css';
import '../components/Metric/Metrics.css';
import { sendProcessedTimeSeriesData } from '../services/uploadTimeSeries';
import { MyChart } from '../components/Chart/Chart';
import { fetchTimeSeriesData, TimeSeriesEntry } from '../services/fetchTimeSeries';
import { DataImportPopup } from '../components/DataImportPopup/DataImportPopup';
import Metrics from "../components/Metric/Metrics";
import {fetchAllMeans} from "../services/fetchAllMeans";
import {extractFilenamesPerCategory} from "../services/extractFilenamesPerCategory";
import {fetchAllMedians} from "../services/fetchAllMedians";
import {fetchAllVariances} from "../services/fetchAllVariances";
import {fetchAllStdDevs} from "../services/fetchAllStdDevs";
import {fetchAllAutoCorrelations} from "../services/fetchAllAutoCorrelations";
import metrics from "../components/Metric/Metrics";

function DashboardPage() {
  const [chartData, setChartData] = useState<Record<string, TimeSeriesEntry[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meanValues, setMeanValues] = useState<Record<string, Record<string, number>>>({});
  const [medianValues, setMedianValues] = useState<Record<string, Record<string, number>>>({});
  const [varianceValues, setVarianceValues] = useState<Record<string, Record<string, number>>>({});
  const [stdDevsValues, setStdDevsValues] = useState<Record<string, Record<string, number>>>({});
  const [filenamesPerCategory, setFilenamesPerCategory] = useState<Record<string, string[]>>({});
  const [dataPreview, setDataPreview] = useState<Record<string, any> | null>(null);
  const [autoCorrelationValues, setAutoCorrelationValues] = useState<Record<string, Record<string, number>>>({});

  const handleFetchData = useCallback(async (showLoadingIndicator = true) => {
  if (showLoadingIndicator) setIsLoading(true);
  setError(null);
  try {
    const allSeries = await fetchTimeSeriesData();
    setChartData(allSeries);

    const names = extractFilenamesPerCategory(allSeries);
    setFilenamesPerCategory(names);

    const means = await fetchAllMeans(names);
    setMeanValues(means);

    const medians = await fetchAllMedians(names);
    setMedianValues(medians);

    const variances = await fetchAllVariances(names);
    setVarianceValues(variances);

    const stdDevs = await fetchAllStdDevs(names);
    setStdDevsValues(stdDevs);


    const autoCorrelations = await fetchAllAutoCorrelations(names);
    setAutoCorrelationValues(autoCorrelations);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
      setChartData({}); // Wyczyść dane w przypadku błędu
    } finally {
      if (showLoadingIndicator) setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const storedData = localStorage.getItem('chartData');
    const storedMeanValues = localStorage.getItem('meanValues');
    const storedMedianValues = localStorage.getItem('medianValues');
    const storedVarianceValues = localStorage.getItem('varianceValues');
    const storedStdDevsValues = localStorage.getItem('stdDevsValues');
    const storedAutoCorrelationsValues = localStorage.getItem('autoCorrelationValues');
    const storedFilenames = localStorage.getItem('filenamesPerCategory');
    if (storedData && storedMeanValues && storedMedianValues && storedVarianceValues && storedStdDevsValues && storedAutoCorrelationsValues && storedFilenames) {
      try {
        const parsedData = JSON.parse(storedData);
        const parsedMeanValues = JSON.parse(storedMeanValues);
        const parsedMedianValues = JSON.parse(storedMedianValues);
        const parsedVarianceValues = JSON.parse(storedVarianceValues);
        const parsedStdDevsValues = JSON.parse(storedStdDevsValues);
        const parsedAutoCorrelations = JSON.parse(storedAutoCorrelationsValues);
        const parsedFilenames = JSON.parse(storedFilenames);

        setChartData(parsedData);
        setMeanValues(parsedMeanValues);
        setMedianValues(parsedMedianValues);
        setVarianceValues(parsedVarianceValues);
        setStdDevsValues(parsedStdDevsValues);
        setAutoCorrelationValues(parsedAutoCorrelations)
        setFilenamesPerCategory(parsedFilenames);
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

  useEffect(() => {
        // Zapisujemy metryki, tylko jeśli nie są puste
    if (Object.keys(meanValues).length > 0) {
      localStorage.setItem('meanValues', JSON.stringify(meanValues));
    }
    if (Object.keys(medianValues).length > 0) {
      localStorage.setItem('medianValues', JSON.stringify(medianValues));
    }
    if (Object.keys(varianceValues).length > 0) {
      localStorage.setItem('varianceValues', JSON.stringify(varianceValues));
    }
    if (Object.keys(stdDevsValues).length > 0) {
      localStorage.setItem('stdDevsValues', JSON.stringify(stdDevsValues));
    }
    if (Object.keys(stdDevsValues).length > 0) {
      localStorage.setItem('autoCorrelationValues', JSON.stringify(autoCorrelationValues));
    }
    if (Object.keys(filenamesPerCategory).length > 0) {
      localStorage.setItem('filenamesPerCategory', JSON.stringify(filenamesPerCategory));
    }

  }, [meanValues, medianValues, varianceValues, stdDevsValues, autoCorrelationValues, filenamesPerCategory]);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setIsPopupOpen(true);
    }
    event.target.value = '';
  };

 const handlePopupComplete = async (groupedData: Record<string, any>) => {
  setIsPopupOpen(false); // Zamknij popup najpierw
  
  // Show preview of the first 3 entries
  const previewDates = Object.keys(groupedData).slice(0, 3);
  const preview: Record<string, any> = {};
  previewDates.forEach(date => {
    preview[date] = groupedData[date];
  });
  setDataPreview(preview);

  if (Object.keys(groupedData).length > 0) {
    setIsLoading(true);
    setError(null);
    await sendProcessedTimeSeriesData(groupedData, async (success) => {
      if (!success) {
        setError("Przetwarzanie danych lub wysyłanie na serwer nie powiodło się.");
      } else {
        await handleFetchData();
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
    setMeanValues({});
    setMedianValues({});
    setVarianceValues({});
    setStdDevsValues({});
    setAutoCorrelationValues({});
    setFilenamesPerCategory({}); // Wyczyść kategorie plików
    setDataPreview(null);
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


  const category = Object.keys(filenamesPerCategory).length > 0 ? Object.keys(filenamesPerCategory)[0] : 'No categories available';
  const meanMetricNames = Object.keys(meanValues[category] || {});
  const medianMetricNames = Object.keys(medianValues[category] || {});
    const varianceMetricNames = Object.keys(varianceValues[category] || {});
    const stdDevMetricNames = Object.keys(stdDevsValues[category] || {});
    const autoCorrelationMetricNames = Object.keys(autoCorrelationValues[category] || {});
  const allUniqueMetricNames = new Set([...meanMetricNames, ...medianMetricNames, ...varianceMetricNames, ...stdDevMetricNames, ...autoCorrelationMetricNames]);

  const combinedMetrics = Array.from(allUniqueMetricNames).map(metricName => {
    const mean = meanValues[category]?.[metricName];
    const median = medianValues[category]?.[metricName];
    const variance = varianceValues[category]?.[metricName];
    const stdDev = stdDevsValues[category]?.[metricName];
    const autoCorrelation = autoCorrelationValues[category]?.[metricName];

       return {
      id: metricName,
      name: metricName,
      mean: mean,
      median: median,
      variance: variance,
      stdDev: stdDev,
      autoCorrelation: autoCorrelation,
    };
  }).filter(metric => metric.mean !== undefined || metric.median !== undefined || metric.variance !== undefined || metric.stdDev !== undefined || metric.autoCorrelation !== undefined);


  return (
    <div className="App">
      <main className="App-main-content">
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

        {error && <p className="App-error" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

        {dataPreview && (
          <div className="data-preview">
            <h3>Data Preview (first 3 entries)</h3>
            <pre>{JSON.stringify(dataPreview, null, 2)}</pre>
          </div>
        )}

        <Metrics 
          group_name={category}
          metrics={combinedMetrics}
        />

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

          <Metrics group_name={category}
                   metrics={combinedMetrics}
                     />
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
        <button
              onClick={handleReset}
              className="custom-reset-button"
              disabled={isLoading}
            >
              Reset data
            </button>
      </main>
    </div>
  );
}

export default DashboardPage;