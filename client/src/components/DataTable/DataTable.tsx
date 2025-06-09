import React from 'react';
import './DataTable.css';
import { TimeSeriesEntry } from '@/services/fetchTimeSeries';

interface DataTableProps {
    data: TimeSeriesEntry[];
    title: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
    const rows = data.slice(0, 20);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return (
        <div className="data-table-container">
            <h3>{title}</h3>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((entry, index) => (
                        <tr key={index}>
                            {columns.map((col) => (
                                <td key={col}>{(entry as any)[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};