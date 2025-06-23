import { JSX } from "react";
import { Card, Alert } from "react-bootstrap";

export const HelpChartVisualization = (): JSX.Element => {
  return (
    <Card className="text-start">
      <Card.Header>
        <Card.Title as="h4" className="mb-0">Chart visualization</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>Interactive charts for exploring time series data with zoom, pan, range selection, dual Y-axes, and series toggling.</Card.Text>
        <Alert variant="success">
          <Alert.Heading>Chart Features:</Alert.Heading>
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
        </Alert>
      </Card.Body>
    </Card>
  );
};
