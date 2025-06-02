from models.DTOs.timeserie_DTO import TimeserieDTO


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

    def add_timeseries(self, key, data):
        
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
        
        if isinstance(data, list):
            self.timeseries[key] = data
            for timeserie in data:
                if not isinstance(timeserie, dict):
                    raise ValueError(f"Invalid timeserie value: {timeserie}")
                if not all(k in timeserie for k in ("log_date", "values")):
                    raise ValueError(f"Missing keys in timeserie: {timeserie}")
                try:
                    timeserie_model = TimeserieDTO.from_dict(timeserie)
                except ValueError as e:
                    raise ValueError(f"Invalid timeserie data: {timeserie}") from e
            return True
        return False

    def get_timeseries(self, key=None):
        
        """
        Retrieve timeseries data.

        Args:
            key (str, optional): Identifier for the timeseries. Defaults to None.

        Returns:
            dict: Timeseries data for the specified key or all timeseries if no key is provided
        """
        
        if key:
            return self.timeseries.get(key)
        return self.timeseries

    def clear_timeseries(self):
        
        """
        Clear all timeseries data.
        """
        
        self.timeseries.clear()
