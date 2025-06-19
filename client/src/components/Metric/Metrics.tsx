import React from "react";
import './Metrics.css';

export type CombinedMetric = {
  id: string;
  name: string;
  mean?: number;
  median?: number;
  variance?: number;
  stdDev?: number;
  autoCorrelation?: number;
};

interface MetricsProps {
  group_name?: string;
  metrics: CombinedMetric[];
}

export const Metrics: React.FC<MetricsProps> = ({ group_name, metrics }) => {
    if (metrics.length === 0) {
        return (
            <div>
                <p style={{ textAlign: 'center', padding: '10px' }}>No metrics available.</p>
            </div>
        );
    }

return (
        <div className="Metrics-container">
            <div className="Metrics-header">
                <h3>{group_name} Metrics</h3>
            </div>
            <div className="Metric-wrapper">
                {metrics.map((metric) => (
                    <div className="single-metric" key={metric.id}>
                        <p className="single-metric-title">{metric.name}</p>
                        {metric.mean !== undefined && (
                        <p>
                            Mean: <strong>{metric.mean.toFixed(2)}</strong>
                        </p>
                        )}
                        {metric.median !== undefined && (
                           <p>
                               Median: <strong>{metric.median.toFixed(2)}</strong>
                           </p>
                        )}
                        {metric.variance !== undefined && (
                           <p>
                               Variance: <strong>{metric.variance.toFixed(2)}</strong>
                           </p>
                        )}
                        {metric.stdDev !== undefined && (
                           <p>
                               Standard deviation: <strong>{metric.stdDev.toFixed(2)}</strong>
                           </p>
                        )}
                        {metric.autoCorrelation !== undefined && (
                           <p>
                               Autocorrelation: <strong>{metric.autoCorrelation.toFixed(2)}</strong>
                           </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Metrics;