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

      const firstTableKey = Object.keys(allSeries)[0];
      if (firstTableKey) {
        setSelectedTable(firstTableKey);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedData = selectedTable ? chartData[selectedTable] : [];

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light">
      {error && <p className="text-danger text-center">Error: {error}</p>}

      <div className="row flex-grow-1" style={{ minHeight: 0 }}>

        {/* Lewa część - lista serii danych (tabel) */}
        <div className="col-3 d-flex flex-column overflow-auto p-3 bg-white border-end">
          <h3>Available Series</h3>
          {Object.keys(chartData).length === 0 && !error ? (
            <p className="text-center py-4">Loading data...</p>
          ) : (
            <div className="list-group">
              {Object.keys(chartData).map((name) => (
                <button
                  key={name}
                  // Nazwa serii jest teraz kluczem, np. "humidity.file_a"
                  onClick={() => setSelectedTable(name)}
                  className={`list-group-item list-group-item-action ${selectedTable === name ? 'list-group-item-primary' : ''}`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prawa część - DataTable dla wybranej serii */}
        <div className="col-9 d-flex flex-column p-3 bg-white" style={{ overflow: 'auto', minHeight: 0 }}>
          {selectedTable ? (
            // Przekazujemy dane dla wybranej serii, które są już w formacie TimeSeriesEntry[]
            <DataTable data={selectedData} title={selectedTable} />
          ) : (
            <p className="text-center py-4">No series selected.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DataPage;