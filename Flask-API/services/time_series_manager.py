from unittest import result
import numpy as np


class TimeSeriesManager:

    """
    Service class to manage time series data.

    Raises:
        ValueError: If the data format is invalid
        ValueError: If required keys are missing in the timeserie
        ValueError: If the timeserie data is invalid

    Returns:
        bool: True if added successfully, False otherwise
    """
    
    def __init__(self):
        self.timeseries = {}

    def add_timeseries(self, time: str, data: dict):

        """
        Add a timeseries to the manager.

        Args:
            key (str): Identifier for the timeseries
            data (list[dict]): List of timeseries data, each item should be a dictionary with keys "log_date", "values"

        Raises:
            ValueError: If the data format is invalid
            ValueError: If required keys are missing in the timeserie
            ValueError: If the timeserie data is invalid

        Returns:
            bool: True if added successfully, False otherwise
        """
        if isinstance(data, dict):
            self.timeseries[time] = data
            for time, categories in data.items():
                if not isinstance(categories, dict):
                    raise ValueError(f"Invalid category '{time}': {categories}")
                for category, files in categories.items():
                    if not isinstance(files, (float, int)):
                        raise ValueError(f"Invalid file data for category '{category}': {files}")
            return True
        return False

    def get_timeseries(self, time:str = None, filename:str = None, category:str = None):
        """
        Retrieve timeseries data.

        Args:
            time (str, optional): The time to filter timeseries by
            filename (str, optional): The filename to filter timeseries by
            category (str, optional): The category to filter timeseries by
        Returns:
            dict: Timeseries data for the specified time or all timeseries if no key is provided
        """
        
        result = {}
        if not self.timeseries:
            return result
        if time and not isinstance(time, str):
            raise ValueError(f"Invalid time format: {time}. Expected a string.")
        
        if filename and not isinstance(filename, str):
            raise ValueError(f"Invalid filename format: {filename}. Expected a string.")
        
        if category and not isinstance(category, str):
            raise ValueError(f"Invalid category format: {category}. Expected a string.")
        
        for timeseries, categories in self.timeseries.items():
            if time and timeseries != time:
                continue

            for timeseries_category, timeseries_filenames in categories.items():
                if category and timeseries_category != category:
                    continue

                for file, value in timeseries_filenames.items():
                    if filename and file != filename:
                        continue

                    result.setdefault(timeseries, {}).setdefault(timeseries_category, {})[file] = value

        return result
    def clear_timeseries(self):
        
        """
        Clear all timeseries data.
        """
        
        self.timeseries.clear()
