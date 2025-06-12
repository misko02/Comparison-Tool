import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import { DataTable } from '../DataTable/DataTable';

interface Props {
  show: boolean;
  files: File[];
  onHide: () => void;
  // Zmieniamy typ, aby odzwierciedlał, że otrzymujemy jeden obiekt
  onComplete: (processedData: Record<string, any>) => void;
}

// Interfejs dla konfiguracji pojedynczego pliku
interface FileConfig {
  logDateColumn: string;
  valueColumn: string;
  valueKey: string; // Np. 'humidity_a', 'value_b'
  rawData: any[];
}

export const DataImportPopup: React.FC<Props> = ({ show, files, onHide, onComplete }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [metricName, setMetricName] = useState('humidity'); // Główny klucz metryki

  const [fileConfigs, setFileConfigs] = useState<Record<number, Partial<FileConfig>>>({});

  const [columnOptions, setColumnOptions] = useState<string[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errorParsingFile, setErrorParsingFile] = useState<string | null>(null);

  const resetWizardState = () => {
    setCurrentFileIndex(0);
    setMetricName('humidity');
    setFileConfigs({});
    setColumnOptions([]);
    setErrorParsingFile(null);
  };

  const loadFileForConfiguration = useCallback(async (fileIndex: number) => {
    if (!files || files.length === 0 || fileIndex >= files.length) return;

    setIsLoadingFile(true);
    setErrorParsingFile(null);
    const file = files[fileIndex];

    if (fileConfigs[fileIndex]?.rawData) {
        const firstEntry = fileConfigs[fileIndex]!.rawData![0];
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

          const newConfig: Partial<FileConfig> = {
            logDateColumn: columns.find(c => c.toLowerCase().includes('date') || c.toLowerCase().includes('time')) || columns[0] || '',
            valueColumn: columns.find(c => c.toLowerCase().includes('value') || c.toLowerCase().includes('metric')) || (columns.length > 1 ? columns[1] : columns[0]) || '',
            valueKey: file.name.replace(/\.json$/i, ''),
            rawData: dataArray,
          };
          setFileConfigs(prev => ({ ...prev, [fileIndex]: { ...prev[fileIndex], ...newConfig }}));

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
      resetWizardState();
    }
  }, [show, files]);

  useEffect(() => {
    if (show && files.length > 0) {
      loadFileForConfiguration(currentFileIndex);
    }
  }, [show, files.length, currentFileIndex, loadFileForConfiguration]);

  const updateCurrentConfig = (update: Partial<FileConfig>) => {
    setFileConfigs(prev => ({
        ...prev,
        [currentFileIndex]: { ...prev[currentFileIndex], ...update }
    }));
  };

  // *** ZMODYFIKOWANA FUNKCJA DO TWORZENIA FINALNEGO OBIEKTU ***
  const mergeAllFiles = () => {
    const finalMergedObject: Record<string, any> = {};

    for (const index in fileConfigs) {
        const config = fileConfigs[index] as FileConfig;
        if (!config.logDateColumn || !config.valueColumn || !config.valueKey || !config.rawData) {
            console.warn(`Skipping file index ${index} due to incomplete configuration.`);
            continue;
        }

        config.rawData.forEach(row => {
            const dateValue = row[config.logDateColumn];
            if (dateValue === undefined) return;

            // Normalizuj datę do formatu ISO, aby użyć jej jako unikalnego klucza
            const dateKey = new Date(dateValue).toISOString();

            // Zainicjuj obiekt dla tego klucza-daty, jeśli jeszcze nie istnieje
            if (!finalMergedObject[dateKey]) {
                finalMergedObject[dateKey] = {};
            }

            // Zainicjuj zagnieżdżony obiekt dla metryki (np. "humidity"), jeśli nie istnieje
            if (!finalMergedObject[dateKey][metricName]) {
                finalMergedObject[dateKey][metricName] = {};
            }

            // Przypisz wartość z bieżącego pliku do odpowiedniego klucza wartości
            finalMergedObject[dateKey][metricName][config.valueKey] = row[config.valueColumn];
        });
    }

    // Zwróć bezpośrednio obiekt zgrupowany po datach
    return finalMergedObject;
  }

  const handleNext = () => {
    const isLast = currentFileIndex === files.length - 1;
    if (isLast) {
      // Wywołaj funkcję scalającą
      const finalData = mergeAllFiles();
      // Przekaż wynikowy obiekt bezpośrednio
      onComplete(finalData);
    } else {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const currentFile = files[currentFileIndex];
  const currentConfig = fileConfigs[currentFileIndex] || {};

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="ms-2 d-flex align-items-center">
          Import and Merge Data
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-4">
            <Form.Label className="fw-bold">1. Define Metric Group Name (e.g., humidity, temperature)</Form.Label>
            <Form.Control
                type="text"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                placeholder="This will be the key for the nested values"
            />
        </Form.Group>
        <hr />

        <h5 className="mb-3">2. Configure Files ({currentFileIndex + 1} of {files.length})</h5>

        {isLoadingFile && <p>Loading file...</p>}
        {errorParsingFile && <p style={{ color: 'red' }}>Error: {errorParsingFile}</p>}

        {!isLoadingFile && !errorParsingFile && currentConfig.rawData && (
          <>
            <p>File: <strong>{currentFile?.name}</strong></p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date/Time Column</Form.Label>
                <Form.Select value={currentConfig.logDateColumn || ''} onChange={(e) => updateCurrentConfig({ logDateColumn: e.target.value })} disabled={columnOptions.length === 0}>
                  <option value="" disabled>Choose column</option>
                  {columnOptions.map((col) => <option key={`date-${col}`} value={col}>{col}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Value Column</Form.Label>
                <Form.Select value={currentConfig.valueColumn || ''} onChange={(e) => updateCurrentConfig({ valueColumn: e.target.value })} disabled={columnOptions.length === 0}>
                  <option value="" disabled>Choose column</option>
                  {columnOptions.map((col) => <option key={`value-${col}`} value={col}>{col}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Value Key Name (in final merged data)</Form.Label>
                <Form.Control
                    type="text"
                    value={currentConfig.valueKey || ''}
                    onChange={(e) => updateCurrentConfig({ valueKey: e.target.value })}
                />
                 <Form.Text>This will be the column name for this file's values (e.g., `value_a`, `sensor_1`).</Form.Text>
              </Form.Group>
            </Form>

            {currentConfig.rawData && currentConfig.rawData.length > 0 && (
              <div className="mt-4">
                <p className="fw-bold">File Preview</p>
                <DataTable data={currentConfig.rawData} title="" />
              </div>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {currentFileIndex > 0 && (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        <Button
            variant="primary"
            onClick={handleNext}
            disabled={isLoadingFile || !!errorParsingFile || !currentConfig.logDateColumn || !currentConfig.valueColumn || !currentConfig.valueKey}
        >
          {currentFileIndex < files.length - 1 ? 'Next File' : 'Finish & Merge'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};