// src/components/DataTable/DataTable.tsx
import React from 'react';
import { TimeSeriesEntry } from '@/services/fetchTimeSeries';

interface DataTableProps {
  data: TimeSeriesEntry[];
  title: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
  const rows = data.slice(0, 20);
  const columns = Object.keys(rows[0]);

  const columnHeaderNames: Record<string, string> = {
      x: 'Date',
      y: 'Value'
  };

  return (
    <div className="w-100">
      <h3 className="mb-3">{title}</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col">
                  {columnHeaderNames[col] || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>
                    {col === 'x'
                      ? new Date((entry as any)[col]).toLocaleString()
                      : (entry as any)[col]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};