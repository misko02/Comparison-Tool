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

    def add_timeseries(self, time, data):
        
        """
        Add a timeseries to the manager.

        Args:
            key (str): Identifier for the timeseries
            data (list[dict]): List of timeseries data, each item should be a dictionary with keys "log_date", "values", and "id"

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
    

        # if isinstance(data, list):
        #     self.timeseries[key] = data
        #     for timeserie in data:
        #         if not isinstance(timeserie, dict):
        #             raise ValueError(f"Invalid timeserie value: {timeserie}")
        #         if not all(k in timeserie for k in ("log_date", "values", "id")):
        #             raise ValueError(f"Missing keys in timeserie: {timeserie}")
        #         try:
        #             timeserie_model = TimeserieDTO.from_dict(timeserie)
        #         except ValueError as e:
        #             raise ValueError(f"Invalid timeserie data: {timeserie}") from e
        #     return True
        # return False

    def get_timeseries(self, filename:str = None, category:str = None):
        """
        Retrieve timeseries data.

        Args:
            filename (str, optional): The filename to filter timeseries by
            category (str, optional): The category to filter timeseries by
        Returns:
            dict: Timeseries data for the specified time or all timeseries if no key is provided
        """

        if filename and category:
            timeserie = {}
            if not self.timeseries:
                raise ValueError("No timeseries data available")
                
            for time, timeseries in self.timeseries.items():
                if not isinstance(timeseries, dict):
                    raise ValueError(f"Invalid timeseries data for time '{time}': {timeseries}")
                if not category in timeseries:
                    raise ValueError(f"Category '{category}' not found in timeseries for time '{time}'")
                if filename not in timeseries[category]:
                    raise ValueError(f"Filename '{filename}' not found in category '{category}' for time '{time}'")
                if not isinstance(timeseries[category][filename], (float, int)):
                    raise ValueError(f"Invalid data for filename '{filename}' in category '{category}' for time '{time}': {timeseries[category][filename]}")
                timeserie[time] = timeseries[category][filename]
            return timeserie
        return self.timeseries

    def clear_timeseries(self):
        
        """
        Clear all timeseries data.
        """
        
        self.timeseries.clear()
