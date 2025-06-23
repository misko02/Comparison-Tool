import React from 'react';
import { Accordion } from 'react-bootstrap';
import './Dropdown.css';

type DropdownProps = {
  category: string;
  files: string[];
  onFileClick?: (filename: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ category, files, onFileClick }) => {
  return (
    <Accordion className="file-accordion">
      <Accordion.Item eventKey="0" >
        <Accordion.Header className="accordion-header">
           <div className="accordion-header-content"> 
            {category}
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-content" >
          <div className="accordion-layout" >
            {files.map((file, index) => (
              <div 
                key={index}
                className="file-label"
                onClick={() => onFileClick?.(file)}

              >
                {file}
              </div>
            ))}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Dropdown;