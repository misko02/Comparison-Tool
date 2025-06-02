// src/components/DataImportPopup/DataImportPopup.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';

interface Props {
  show: boolean;
  files: File[];
  onHide: () => void;
  onComplete: (processedData: Record<string, any[]>) => void;
}

interface FileProcessingState {
  columnOptions: string[];
  logDateColumn: string;
  valueColumn: string;
}

export const DataImportPopup: React.FC<Props> = ({ show, files, onHide, onComplete }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [columnOptions, setColumnOptions] = useState<string[]>([]);
  const [logDateColumn, setLogDateColumn] = useState<string>('');
  const [valueColumn, setValueColumn] = useState<string>('');
  const [currentFileRawData, setCurrentFileRawData] = useState<any[] | null>(null);
  const [allProcessedData, setAllProcessedData] = useState<Record<string, any[]>>({});
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errorParsingFile, setErrorParsingFile] = useState<string | null>(null);

  const resetCurrentFileState = () => {
    setColumnOptions([]);
    setLogDateColumn('');
    setValueColumn('');
    setCurrentFileRawData(null);
    setErrorParsingFile(null);
  };

  const loadFileAndSetOptions = useCallback(async () => {
    if (!files || files.length === 0 || currentFileIndex >= files.length) {
      resetCurrentFileState();
      return;
    }
    setIsLoadingFile(true);
    setErrorParsingFile(null);
    const file = files[currentFileIndex];

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      const dataArray = Array.isArray(jsonData) ? jsonData : (typeof jsonData === 'object' && jsonData !== null ? [jsonData] : []);
      
      setCurrentFileRawData(dataArray);

      if (dataArray.length > 0) {
        const firstEntry = dataArray[0];
        if (typeof firstEntry === 'object' && firstEntry !== null) {
          const columns = Object.keys(firstEntry);
          setColumnOptions(columns);
          setLogDateColumn(columns.find(c => c.toLowerCase().includes('date') || c.toLowerCase().includes('time')) || columns[0] || '');
          setValueColumn(columns.find(c => c.toLowerCase().includes('value') || c.toLowerCase().includes('metric')) || (columns.length > 1 ? columns[1] : columns[0]) || '');
        } else {
          setErrorParsingFile(`Pierwszy wpis w pliku ${file.name} nie jest obiektem.`);
          resetCurrentFileState();
        }
      } else {
        setErrorParsingFile(`Plik ${file.name} jest pusty lub nie zawiera tablicy obiektów.`);
        resetCurrentFileState();
        setCurrentFileRawData([]);
      }
    } catch (e: any) {
      console.error(`Error reading or parsing file ${file.name}:`, e);
      setErrorParsingFile(`Błąd parsowania pliku ${file.name}: ${e.message}`);
      resetCurrentFileState();
    } finally {
      setIsLoadingFile(false);
    }
  }, [currentFileIndex, files]);

  useEffect(() => {
    if (show && files.length > 0) {
      setAllProcessedData({});
      setCurrentFileIndex(0); // Zawsze zaczynaj od pierwszego pliku
      loadFileAndSetOptions();
    } else if (!show) {
        // Reset stanu przy zamykaniu
        setCurrentFileIndex(0);
        setAllProcessedData({});
        resetCurrentFileState();
    }
  }, [show, files]);

  useEffect(() => {
    if (show && files.length > 0) {
        loadFileAndSetOptions();
    }
  }, [currentFileIndex, loadFileAndSetOptions, show, files.length]);


  const handleNext = () => {
    if (!currentFileRawData || !logDateColumn || !valueColumn || errorParsingFile) {
      alert("Proszę wybrać poprawne kolumny lub naprawić błędy w pliku.");
      return;
    }

    const file = files[currentFileIndex];
    const fileKey = file.name.replace(/\.json$/i, '');

    const transformedFileEntries = currentFileRawData
      .map(originalEntry => {
        if (typeof originalEntry !== 'object' || originalEntry === null) {
          console.warn("Pominięto wpis, który nie jest obiektem:", originalEntry);
          return null;
        }
        if (!(logDateColumn in originalEntry)) {
          console.warn(`Wybrana kolumna daty "${logDateColumn}" nie znaleziona w wpisie. Pomijanie wpisu.`);
          return null;
        }
        if (!(valueColumn in originalEntry)) {
          console.warn(`Wybrana kolumna wartości "${valueColumn}" nie znaleziona w wpisie. Pomijanie wpisu.`);
          return null;
          }

        const processedEntry: any = {};

        // Kopiuj wszystkie oryginalne pola, które nie są mapowanymi kolumnami
        for (const key in originalEntry) {
          if (key !== logDateColumn && key !== valueColumn) {
            processedEntry[key] = originalEntry[key];
          }
        }
        
        // Dodaj zmapowane pola
        processedEntry.log_date = originalEntry[logDateColumn];
        const rawVal = originalEntry[valueColumn];
        processedEntry.values = Array.isArray(rawVal) ? rawVal : [rawVal];


        return processedEntry;
      })
      .filter(entry => entry !== null);

    const updatedProcessedData = { ...allProcessedData, [fileKey]: transformedFileEntries };
    setAllProcessedData(updatedProcessedData);

    const isLast = currentFileIndex === files.length - 1;
    if (isLast) {
      onComplete(updatedProcessedData);
    } else {
      setCurrentFileIndex(currentFileIndex + 1);
      // useEffect [currentFileIndex] załaduje następny plik
    }
  };

  const handleBack = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const currentFile = files[currentFileIndex];

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="ms-2 d-flex align-items-center">
          Import data ({currentFile?.name || 'Brak pliku'})
          <Button
            variant="light"
            size="sm"
            onClick={() => { /* TODO: Implement rename logic if needed */ }}
            className="ms-2 d-flex align-items-center justify-content-center p-1"
            title="Zmień nazwę klucza (niezaimplementowane)"
          >
            <PencilSquare size={16} />
          </Button>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoadingFile && <p>Ładowanie pliku...</p>}
        {errorParsingFile && <p style={{ color: 'red' }}>Błąd: {errorParsingFile}</p>}
        {!isLoadingFile && !errorParsingFile && currentFileRawData && (
          <>
            <p>File: <strong>{currentFile?.name}</strong> ({currentFileIndex + 1} z {files.length})</p>
            <p>Choose columns to import:</p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date axis</Form.Label>
                <Form.Select value={logDateColumn} onChange={(e) => setLogDateColumn(e.target.value)} disabled={columnOptions.length === 0}>
                  <option value="" disabled>Choose column</option>
                  {columnOptions.map((col) => (
                    <option key={`date-${col}`} value={col}>
                      {col}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Value column</Form.Label>
                <Form.Select value={valueColumn} onChange={(e) => setValueColumn(e.target.value)} disabled={columnOptions.length === 0}>
                  <option value="" disabled>Choose column</option>
                  {columnOptions.map((col) => (
                    <option key={`value-${col}`} value={col}>
                      {col}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
            {currentFileRawData && currentFileRawData.length > 0 && typeof currentFileRawData[0] === 'object' && (
              <details className="mt-3">
                <summary>Preview</summary>
                <pre style={{ maxHeight: '200px', overflow: 'auto', background: '#f5f5f5', padding: '10px' }}>
                  {JSON.stringify(currentFileRawData[0], null, 2)}
                </pre>
              </details>
            )}
          </>
        )}
        {!isLoadingFile && !currentFileRawData && !errorParsingFile && files.length > 0 && (
            <p>Data can't be loaded or file is incorrect</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        {currentFileIndex > 0 && (
          <Button variant="secondary" onClick={handleBack}>
            Previous
          </Button>
        )}
        <Button 
            variant="primary" 
            onClick={handleNext} 
            disabled={isLoadingFile || !!errorParsingFile || !logDateColumn || !valueColumn || !currentFileRawData}
        >
          {currentFileIndex < files.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};