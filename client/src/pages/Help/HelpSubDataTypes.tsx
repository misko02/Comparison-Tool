import { JSX } from "react";

export const HelpDataTypes = (): JSX.Element => {
  return (
    <div className="card text-start">
      <div className="card-header">
        <strong className="fs-4">Data types and formats</strong>
      </div>
      <div className="card-body">
        <p className="card-text">The application supports time series data in CSV and JSON formats. Your data should contain timestamp columns and numerical measurement values.</p>

        <div className="row mb-3">
          {/* CSV Format */}
          <div className="col-md-6">
            <div className="alert alert-light p-3 h-100" role="alert">
              <div className="d-flex align-items-center mb-3">
                <h4 className="alert-heading mb-0 me-2">CSV Format</h4>
                <span className="badge bg-success">Supported</span>
              </div>
              <p>CSV with headers, containing timestamp and numerical data columns in any order.</p>
            </div>
          </div>

          {/* JSON Format */}
          <div className="col-md-6">
            <div className="alert alert-light p-3 h-100" role="alert">
              <div className="d-flex align-items-center mb-3">
                <h4 className="alert-heading mb-0 me-2">JSON Format</h4>
                <span className="badge bg-success">Supported</span>
              </div>
              <p>Flat JSON array of objects with timestamp and numerical value fields.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
