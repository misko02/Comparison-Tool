import React from 'react';
import './DataTable.css';
import { TimeSeriesEntry } from '@/services/fetchTimeSeries';

interface DataTableProps {
    data: TimeSeriesEntry[];
    title: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
    const rows = data.slice(0, 50); // tylko pierwsze 50 wierszy

    return (
        <div className="data-table-container">
            <h3>{title}</h3>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.x}</td>
                            <td>{entry.y}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
