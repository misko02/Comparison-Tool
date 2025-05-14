import React from 'react';

export const uploadTimeSeries = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onUploadsFinished?: (success: boolean) => void
) => {
    const files = event.target.files;
  if (!files || files.length === 0) {
    onUploadsFinished?.(false);
    event.target.value = '';
    return;
  }
    let atLeastOneSuccess = false;

  const parsed: Record<string, any[]> = {};
  await Promise.all(Array.from(files).map(file =>
    new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target?.result as string);
          // klucz na backendzie = nazwa pliku bez rozszerzenia
          const key = file.name.replace(/\.json$/i, '');
          if (Array.isArray(data)) parsed[key] = data;
        } catch {
          console.warn(`Nieprawidłowy JSON w ${file.name}`);
        }
        resolve();
      };
      reader.onerror = () => resolve();
      reader.readAsText(file);
    })
  ));

      try {
    const resp = await fetch('/upload-timeseries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    if (!resp.ok) throw new Error(await resp.text());
    onUploadsFinished?.(true);
  } catch (err) {
    console.error(err);
    onUploadsFinished?.(false);
  } finally {
    event.target.value = '';
  }
};
