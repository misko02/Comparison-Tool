import { JSX } from "react";
import { Github } from "react-bootstrap-icons";

export const HelpAbout = (): JSX.Element => {
  return (
    <div className="card text-start">
      <div className="card-header">
        <strong className="fs-4">About</strong>
      </div>
      <div className="card-body">
        <h5 className="card-title">Time Series Analysis Application</h5>

        <p className="card-text">
          This application was developed as a university project in collaboration with Rockwool, a leading manufacturer of stone wool insulation products. It enables engineers and data analysts to
          compare and analyze time series data from multiple sensors and predictive models.
        </p>

        {/* GitHub Repository */}
        {/* target="_blank" - Opens the link in a new tab to keep the app open */}
        {/* rel="noopener"  - Prevents the new tab from accessing the original tab for security */}
        {/* rel="noreferrer"- Hides the referrer URL to protect user privacy */}
        <a href="https://github.com/misko02/Comparison-Tool" target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm mb-3 d-inline-flex align-items-center">
          <Github className="me-2 align-middle" size={16} />
          View on GitHub
        </a>

        <div className="row mb-3">
          {/* Project Goals */}
          <div className="col-md-6">
            <div className="alert alert-light p-3 h-100">
              <h4 className="alert-heading">Project Goals</h4>
              <ul>
                <li>Enable easy comparison of multiple time series datasets</li>
                <li>Provide intuitive visualization tools for complex data</li>
                <li>Support extensible plugins for custom metrics</li>
                <li>Offer useful anomaly detection</li>
                <li>Generate comprehensive analysis reports</li>
              </ul>
            </div>
          </div>

          {/* Key Features */}
          <div className="col-md-6">
            <div className="alert alert-light p-3 h-100">
              <h4 className="alert-heading">Key Features</h4>
              <ul>
                <li>
                  <strong>Data Handling:</strong> Import data in CSV or flat JSON formats
                </li>
                <li>
                  <strong>Visualization:</strong> Interactive charts with primary and secondary axes
                </li>
                <li>
                  <strong>Analysis:</strong> Advanced metrics and anomaly detection algorithms
                </li>
                <li>
                  <strong>Extensibility:</strong> Support for custom plugins to define user-specified metrics
                </li>
                <li>
                  <strong>Reporting:</strong> Generate PDF reports for analysis results
                </li>
                <li>
                  <strong>Usability:</strong> Responsive web interface with real-time data processing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Development Details */}
        <div className="alert alert-light p-3">
          <h4 className="alert-heading">Development Details</h4>
          <p>Developed by computer science students as part of their software engineering coursework.</p>
          <p className="mb-1">
            <strong>Frontend: </strong> <span className="badge bg-primary ms-1">React</span> <span className="badge bg-primary ms-1">TypeScript</span>
          </p>
          <p className="mb-1">
            <strong>Backend: </strong> <span className="badge bg-success ms-1">Python</span> <span className="badge bg-success ms-1">Flask</span>
          </p>
          <p>
            <strong>Additional Technologies: </strong> <span className="badge bg-secondary ms-1">Bootstrap</span> <span className="badge bg-secondary ms-1">Docker</span>
          </p>
        </div>

        {/* Acknowledgments */}
        <div className="alert alert-info mb-3">
          <h4 className="alert-heading">Acknowledgments</h4>
          Special thanks to Rockwool for providing real-world use cases and to our university supervisor for guidance throughout the development process.
        </div>
      </div>
    </div>
  );
};
