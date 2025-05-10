import React from 'react';

export const uploadTimeSeries = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onUploadsFinished?: (success: boolean) => void
) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
        console.log("No files selected");
        if (onUploadsFinished) {
            onUploadsFinished(false);
        }
        if (event.target) {
            event.target.value = '';
        }
        return;
    }
    let atLeastOneSuccess = false;

    const uploadPromises = Array.from(files).map(file => {
        return new Promise<boolean>(async (resolve) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const content = e.target?.result as string;
                    if (!content) {
                        console.error(`File ${file.name} is empty or could not be read.`);
                        resolve(false);
                        return;
                    }
                    let jsonData;
                    try {
                        jsonData = JSON.parse(content);
                    } catch (error) {
                        console.error(`File ${file.name} is not a valid JSON.`);
                        resolve(false);
                        return;
                    }
                    console.log('Uploading file:', file.name);

                    const response = await fetch('/upload-timeseries', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(jsonData),
                        }
                    );
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Failed to upload timeseries for ${file.name}: ${response.status} ${response.statusText}. Server: ${errorText}`);
                    }
                    const result = await response.json();
                    console.log(`Upload successful for ${file.name}:`, result);
                    resolve(true);
                } catch (error) {
                    console.error(`Error uploading ${file.name}:`, error);
                    resolve(false);
                }
            };

            reader.onerror = (error) => {
                console.error(`Error reading file ${file.name}:`, error);
                resolve(false);
            };

            reader.readAsText(file);
        });
    });

    try {
        const results = await Promise.allSettled(uploadPromises);
        console.log("All file processed");

        results.forEach((result, index) => {
            const fileName = files[index].name;
            if (result.status === 'fulfilled') {
                console.log(`File ${fileName} processed successfully.`);
                if (result.value === true) {
                    atLeastOneSuccess = true;
                }
            } else {
                console.error(`File ${fileName} failed:`, result.reason);
            }
        });

        if (event.target) {
            event.target.value = '';
        }
        if (onUploadsFinished) {
            onUploadsFinished(atLeastOneSuccess);
        }
    } catch (error) {
        console.error("Error processing files:", error);
    if (onUploadsFinished) {
        onUploadsFinished(false);
    }
}
    };
