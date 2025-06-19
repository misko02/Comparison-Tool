import React from 'react';
import { Accordion, Form } from 'react-bootstrap';
import './Dropdown.css';

type DropdownProps = {
  category: string;
  files: string[];
  onFileClick?: (filename: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ category, files, onFileClick }) => {
  return (
    <Accordion className="file-accordion" style={{ width: '100%' }}>
      <Accordion.Item eventKey="0" style={{ width: '100%' }}>
        <Accordion.Header className="accordion-header">
          {category}
        </Accordion.Header>
        <Accordion.Body className="accordion-content">
          <div className="accordion-layout">
            {files.map((file, index) => (
              <Form.Check
                key={index}
                type="switch"
                id={`custom-switch-${index}`}
                label={file}
                onChange={() => onFileClick?.(file)}
                className="switch"
              />
            ))}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Dropdown;