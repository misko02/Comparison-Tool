import { JSX } from "react";

export const HelpChartVisualization = (): JSX.Element => {
  return (
    <div className="card text-start">
      <div className="card-header">
        <strong className="fs-4">Chart visualization</strong>
      </div>
      <div className="card-body">
        <p className="card-text">Interactive charts for exploring time series data with zoom, pan, range selection, dual Y-axes, and series toggling.</p>
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Chart Features:</h4>
          <ol>
            <li>Zoom and pan using mouse or touch input.</li>
            <li>Range selector for 1 day, 1 week, 1 month, or full data range.</li>
            <li>Time range slider for dynamic X-axis filtering.</li>
            <li>Custom Y-axis range with manual min/max input and apply/reset controls.</li>
            <li>Dual Y-axes for primary and secondary data series.</li>
            <li>Toggle data series visibility via legend clicks.</li>
            <li>Dynamic date format based on zoom level (day, day+hour, or full date-time).</li>
            <li>Toggleable markers for data points (visible for ranges under 3 hours).</li>
            <li>Hover spikes for precise X and Y value inspection.</li>
            <li>Multiple data series with distinct colors and horizontal legend.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
