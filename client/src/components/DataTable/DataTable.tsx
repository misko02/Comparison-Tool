// src/components/DataTable/DataTable.tsx
import React from 'react';

export interface DataTableProps {
  data: Record<string, any>[];
  title: string;
}


export const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
  const rows = data?.slice(0, 20) || [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const columnHeaderNames: Record<string, string> = {
    x: 'Date',
    y: 'Value'
  };

  const renderCellContent = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted">null</span>;
    }
    // Jeśli to obiekt (ale nie null), pokaż placeholder
    if (typeof value === 'object') {
      return Array.isArray(value) ? <span className="text-danger">[Array]</span> : <span className="text-danger">[Object]</span>;
    }
    // Jeśli wartość jest booleanem, przekonwertuj na string
    if (typeof value === 'boolean') {
        return value.toString();
    }
    // W przeciwnym razie zwróć wartość jako string
    return value;
  };


  return (
    <div className="w-100">
      <h3 className="mb-3">{title}</h3>
      {rows.length === 0 ? (
        <div>No data to display</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle">
            <thead className="table-light">
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
                      {renderCellContent((entry as any)[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};