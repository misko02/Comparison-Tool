// src/components/DataImportPopup/DataImportPopup.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DataTable } from '../DataTable/DataTable';

interface FileConfig {
  logDateColumn: string;
  valueColumn: string;
  rawData: any[];
}

interface Group {
  id: string;
  name: string;
  fileMappings: Record<string, string>; // { [fileKey]: columnName }
}

interface Props {
  show: boolean;
  files: File[];
  onHide: () => void;
   // Zmieniamy typ, aby odzwierciedlał, że otrzymujemy jeden obiekt
  onComplete: (groupedData: Record<string, any>) => void;
}

export const DataImportPopup: React.FC<Props> = ({ show, files, onHide, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'file-preview' | 'column-config'>('file-preview');
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [fileConfigs, setFileConfigs] = useState<Record<string, FileConfig>>({});
  const [columnOptions, setColumnOptions] = useState<string[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errorParsingFile, setErrorParsingFile] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [mainGroupName, setMainGroupName] = useState('measurements');

  const resetState = () => {
    setCurrentStep('file-preview');
    setCurrentFileIndex(0);
    setFileConfigs({});
    setColumnOptions([]);
    setErrorParsingFile(null);
    setGroups([]);
  };

  const loadFileForConfiguration = useCallback(async (fileIndex: number) => {
    if (!files || files.length === 0 || fileIndex >= files.length) return;

    setIsLoadingFile(true);
    setErrorParsingFile(null);
    const file = files[fileIndex];
    const fileKey = file.name.replace(/\.json$/i, '');

    if (fileConfigs[fileKey]?.rawData) {
      const firstEntry = fileConfigs[fileKey].rawData[0];
      if (typeof firstEntry === 'object' && firstEntry !== null) {
        setColumnOptions(Object.keys(firstEntry));
      }
      setIsLoadingFile(false);
      return;
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      const dataArray = Array.isArray(jsonData) ? jsonData : (typeof jsonData === 'object' && jsonData !== null ? [jsonData] : []);

      if (dataArray.length > 0) {
        const firstEntry = dataArray[0];
        if (typeof firstEntry === 'object' && firstEntry !== null) {
          const columns = Object.keys(firstEntry);
          setColumnOptions(columns);

          const newConfig: FileConfig = {
            logDateColumn: columns.find(c => c.toLowerCase().includes('date') || c.toLowerCase().includes('time')) || columns[0] || '',
            valueColumn: columns.find(c => c.toLowerCase().includes('value') || c.toLowerCase().includes('metric')) || (columns.length > 1 ? columns[1] : columns[0]) || '',
            rawData: dataArray,
          };
          setFileConfigs(prev => ({ ...prev, [fileKey]: newConfig }));
        } else {
          throw new Error(`First entry in file ${file.name} is not an object.`);
        }
      } else {
        throw new Error(`File ${file.name} is empty or not an array of objects.`);
      }
    } catch (e: any) {
      console.error(`Error processing file ${file.name}:`, e);
      setErrorParsingFile(`Error parsing file ${file.name}: ${e.message}`);
    } finally {
      setIsLoadingFile(false);
    }
  }, [files, fileConfigs]);

  useEffect(() => {
    if (show && files.length > 0) {
      resetState();
      loadFileForConfiguration(0);
    }
  }, [show, files]);

  useEffect(() => {
    if (show && files.length > 0 && currentStep === 'file-preview') {
      loadFileForConfiguration(currentFileIndex);
    }
  }, [show, files.length, currentFileIndex, currentStep, loadFileForConfiguration]);

  const handleNextFilePreview = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    } else {
      setCurrentStep('column-config');
      // Initialize groups when moving to column config
      const fileKeys = Object.keys(fileConfigs);
      if (fileKeys.length > 0) {
        const firstFileKey = fileKeys[0];
        const columns = Object.keys(fileConfigs[firstFileKey].rawData[0]);
        
        // Create default groups for date and value
        setGroups([
          {
            id: 'date',
            name: 'Date',
            fileMappings: Object.fromEntries(fileKeys.map(key => [key, fileConfigs[key].logDateColumn]))
          },
          {
            id: 'value',
            name: 'Value',
            fileMappings: Object.fromEntries(fileKeys.map(key => [key, fileConfigs[key].valueColumn]))
          }
        ]);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'column-config') {
      setCurrentStep('file-preview');
    } else if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const addNewGroup = () => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: '',
      fileMappings: Object.fromEntries(Object.keys(fileConfigs).map(key => [key, ''])),
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroupMapping = (groupId: string, fileKey: string, column: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, fileMappings: { ...group.fileMappings, [fileKey]: column } } 
        : group
    ));
  };

  const updateGroupName = (groupId: string, name: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, name } : group
    ));
  };

  const groupAndTransformData = () => {
    const result: Record<string, any> = {};

    // Find date group
    const dateGroup = groups.find(g => g.id === 'date');
    if (!dateGroup) return result;

    Object.entries(fileConfigs).forEach(([fileKey, config]) => {
      const dateColumn = dateGroup.fileMappings[fileKey];
      if (!dateColumn) return;

      config.rawData.forEach(row => {
        const dateValue = row[dateColumn];
        if (dateValue === undefined) return;

        // Create Date object first
        const dateObj = new Date(dateValue);
        if (isNaN(dateObj.getTime())) return; // Skip invalid dates

        // Format date as ISO string for the chart
        const isoDateString = dateObj.toISOString();

        // Initialize entry for this date if not exists
        if (!result[isoDateString]) {
          result[isoDateString] = {};
        }

        // Add values from all groups except date group
        groups.forEach(group => {
          if (group.id === 'date') return;

          const column = group.fileMappings[fileKey];
          if (!column || row[column] === undefined) return;

          // Use group name as the main category
          if (!result[isoDateString][group.name]) {
            result[isoDateString][group.name] = {};
          }

          // Add value for this file
          result[isoDateString][group.name][fileKey] = row[column];
        });
      });
    });

    return result;
  };

  const handleFinish = () => {
    const groupedData = groupAndTransformData();
    onComplete(groupedData);
    onHide();
  };

  const currentFile = files[currentFileIndex];
  const currentFileKey = currentFile?.name.replace(/\.json$/i, '');
  const currentConfig = currentFileKey ? fileConfigs[currentFileKey] : null;

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="ms-2 d-flex align-items-center">
          {currentStep === 'file-preview' 
            ? `File Preview (${currentFileIndex + 1}/${files.length})` 
            : 'Configure Columns'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {currentStep === 'file-preview' ? (
          <>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">File: {currentFile?.name}</Form.Label>
            </Form.Group>

            {isLoadingFile && <p>Loading file...</p>}
            {errorParsingFile && <p style={{ color: 'red' }}>Error: {errorParsingFile}</p>}

            {!isLoadingFile && !errorParsingFile && currentConfig?.rawData && (
              <div className="mt-4">
                <DataTable data={currentConfig.rawData.slice(0, 5)} title="File Preview" />
              </div>
            )}
          </>
        ) : (
          <>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Main Group Name</Form.Label>
              <Form.Control
                type="text"
                value={mainGroupName}
                onChange={(e) => setMainGroupName(e.target.value)}
                placeholder="e.g. measurements, sensors"
              />
            </Form.Group>

            <h5>Data Groups</h5>
            {groups.map((group) => (
              <div key={group.id} className="mb-4 p-3 border rounded">
                <Form.Group className="mb-3">
                  <Form.Label>Group Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={group.name}
                    onChange={(e) => updateGroupName(group.id, e.target.value)}
                    disabled={group.id === 'date' || group.id === 'value'}
                  />
                </Form.Group>

                <h6>File Mappings</h6>
                {Object.keys(fileConfigs).map((fileKey) => {
                  const fileColumns = fileConfigs[fileKey].rawData.length > 0 
                    ? Object.keys(fileConfigs[fileKey].rawData[0])
                    : [];
                  
                  return (
                    <Form.Group key={`${group.id}-${fileKey}`} className="mb-2">
                      <Form.Label>{fileKey}</Form.Label>
                      <Form.Select
                        value={group.fileMappings[fileKey] || ''}
                        onChange={(e) => updateGroupMapping(group.id, fileKey, e.target.value)}
                      >
                        <option value="" disabled>Select column</option>
                        {fileColumns.map((col) => (
                          <option key={`${group.id}-${fileKey}-${col}`} value={col}>{col}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  );
                })}
              </div>
            ))}

            <Button variant="outline-primary" onClick={addNewGroup}>
              + Add New Group
            </Button>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={currentStep === 'file-preview' ? handleNextFilePreview : handleFinish}
          disabled={
            currentStep === 'file-preview' 
              ? isLoadingFile || !!errorParsingFile
              : false
          }
        >
          {currentStep === 'file-preview' 
            ? currentFileIndex < files.length - 1 ? 'Next File' : 'Configure Columns'
            : 'Finish & Process Data'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};