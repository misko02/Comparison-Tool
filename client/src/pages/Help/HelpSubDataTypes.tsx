import { JSX } from "react";
import { Card, Alert, Row, Col, Badge } from "react-bootstrap";

export const HelpDataTypes = (): JSX.Element => {
  return (
    <Card className="text-start">
      <Card.Header>
        <Card.Title as="h4" className="mb-0">Data types and formats</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>The application supports time series data in CSV and JSON formats. Your data should contain timestamp columns and numerical measurement values.</Card.Text>

        <Row className="mb-3">
          {/* CSV Format */}
          <Col md={6}>
            <Alert variant="light" className="h-100">
              <div className="d-flex align-items-center mb-3">
                <Alert.Heading className="mb-0 me-2">CSV Format</Alert.Heading>
                <Badge bg="success">Supported</Badge>
              </div>
              <p>CSV with headers, containing timestamp and numerical data columns in any order.</p>
            </Alert>
          </Col>

          {/* JSON Format */}
          <Col md={6}>
            <Alert variant="light" className="h-100">
              <div className="d-flex align-items-center mb-3">
                <Alert.Heading className="mb-0 me-2">JSON Format</Alert.Heading>
                <Badge bg="success">Supported</Badge>
              </div>
              <p>Flat JSON array of objects with timestamp and numerical value fields.</p>
            </Alert>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
