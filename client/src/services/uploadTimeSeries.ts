// src/services/uploadTimeSeries.ts

export const sendProcessedTimeSeriesData = async (
    processedData: Record<string, any[]>,
    onUploadsFinished?: (success: boolean) => void
) => {
    if (Object.keys(processedData).length === 0) {
        onUploadsFinished?.(false);
        return;
    }

    try {
        const resp = await fetch('/upload-timeseries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processedData),
        });
        if (!resp.ok) {
            const errorText = await resp.text();
            console.error("Upload failed on backend:", errorText);
            throw new Error(errorText);
        }
        onUploadsFinished?.(true);
    } catch (err) {
        console.error("Error sending processed time series data:", err);
        onUploadsFinished?.(false);
    }
};