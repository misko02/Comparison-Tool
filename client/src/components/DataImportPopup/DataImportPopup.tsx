import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';

interface Props {
  show: boolean; // Controls popup visibility
  files: File[]; // Array of uploaded files (binary data, name, metadata)
  onHide: () => void; // Function to close the modal
  onComplete: (results: any[]) => void; // Function called when import is complete
}

export const DataImportPopup: React.FC<Props> = ({ show, files, onHide, onComplete }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handleBack = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    } else {
      onComplete(files.map(f => f.name)); // Pass file names as results
      onHide();
    }
  };

  const handleEditName = () => {
    console.log('Editing file name:', files[currentFileIndex]?.name);
  };

  return (
    // backdrop="static" - Prevent closing popup while clicking on background
    // keyboard={false} - Disable closing popup with Esc key
    // size="xl" - Set modal size to extra-large
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="ms-2 d-flex align-items-center">
          Import Data ({files[currentFileIndex]?.name || 'No file'})
          <Button variant="light" size="sm" onClick={handleEditName} className="ms-2 d-flex align-items-center justify-content-center p-1">
            <PencilSquare size={16} />
          </Button>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Processing file: {files[currentFileIndex]?.name || 'No file'}</p>
        {/* Add table here */}
      </Modal.Body>

      <Modal.Footer>
        {/* 'Previous' button, visible for pages > 0 */}
        {currentFileIndex > 0 && (
          <Button variant="secondary" onClick={handleBack}>
            Previous
          </Button>
        )}

        <Button variant="primary" onClick={handleNext}>
          {currentFileIndex < files.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </Modal.Footer>

    </Modal>
  );
};