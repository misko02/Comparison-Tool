// src/pages/DataPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { fetchTimeSeriesData, TimeSeriesResponse } from '../services/fetchTimeSeries';
import { DataTable } from '../components/DataTable/DataTable';

const DataPage: React.FC = () => {
  const [chartData, setChartData] = useState<TimeSeriesResponse>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const allSeries = await fetchTimeSeriesData();
      setChartData(allSeries);

      // Automatycznie wybierz pierwszy plik
      const firstFile = Object.keys(allSeries)
        .map(name => name.split('.')[1])
        .filter((value, index, self) => value && self.indexOf(value) === index)[0];

      if (firstFile) {
        setSelectedTable(firstFile);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    }
  }, []);

  type TransformedEntry = {
    x: string;
    [groupName: string]: string | number;
  };

  const transformDataForTable = (
    chartData: TimeSeriesResponse,
    file: string
  ): TransformedEntry[] => {
    const merged: Record<string, TransformedEntry> = {};

    Object.entries(chartData).forEach(([seriesKey, entries]) => {
      const [group, seriesFile] = seriesKey.split('.');

      if (seriesFile !== file) return;

      entries.forEach(entry => {
        if (!merged[entry.x]) {
          merged[entry.x] = { x: entry.x };
        }
        merged[entry.x][group] = entry.y;
      });
    });

    return Object.values(merged).sort(
      (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()
    );
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedData = selectedTable
    ? transformDataForTable(chartData, selectedTable)
    : [];

  // Wyciągnij unikalne nazwy plików
  const uniqueFiles = Array.from(
    new Set(
      Object.keys(chartData).map(name => name.split('.')[1])
    )
  ).filter(Boolean);

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light">
      {error && <p className="text-danger text-center">Error: {error}</p>}

      <div className="row flex-grow-1" style={{ minHeight: 0 }}>
        {/* Lewa część - lista plików */}
        <div className="col-3 d-flex flex-column overflow-auto p-3 bg-white border-end">
          <h3>Available Files</h3>
          {uniqueFiles.length === 0 && !error ? (
            <p className="text-center py-4">Loading data...</p>
          ) : (
            <div className="list-group">
              {uniqueFiles.map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedTable(file)}
                  className={`list-group-item list-group-item-action ${selectedTable === file ? 'list-group-item-light' : ''}`}
                >
                  {file}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prawa część - DataTable */}
        <div className="col-9 d-flex flex-column p-3 bg-white" style={{ overflow: 'auto', minHeight: 0 }}>
          {selectedTable ? (
            <DataTable data={selectedData} title={selectedTable} />
          ) : (
            <p className="text-center py-4">No file selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPage;
