import React, { useEffect, useState, useCallback } from 'react';
import { fetchRawTimeSeriesData } from '../services/fetchTimeSeries';
import { DataTable } from '../components/DataTable/DataTable';

const DataPage: React.FC = () => {
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const allSeries = await fetchRawTimeSeriesData();
      setChartData(allSeries);
      const firstTable = Object.keys(allSeries)[0];
      if (firstTable) {
        setSelectedTable(firstTable);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light">
      {error && <p className="text-danger text-center">Error: {error}</p>}

      <div className="row flex-grow-1" style={{ minHeight: 0 }}>

        {/* Lewa część - lista tabel */}
        <div className="col-3 d-flex flex-column overflow-auto p-3 bg-white border-end">
          <h3>Available Tables</h3>
          {Object.keys(chartData).length === 0 ? (
            <p className="text-center py-4">No data available.</p>
          ) : (
            <div className="list-group">
              {Object.keys(chartData).map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedTable(name)}
                  className={`list-group-item list-group-item-action ${selectedTable === name ? 'list-group-item-primary' : ''}`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prawa część - tabelka */}
        <div className="col-9 d-flex flex-column p-3 bg-white" style={{ overflow: 'auto', minHeight: 0 }}>
          {selectedTable ? (
            <DataTable data={chartData[selectedTable]} title={selectedTable} />
          ) : (
            <p className="text-center py-4">No table selected.</p>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default DataPage;
