from flask import app
from models.DTOs.timeserie_DTO import TimeserieDTO


class TimeSeriesManager:
    def __init__(self):
        self.timeseries = {}

    def add_timeseries(self, key, data):
        if isinstance(data, list):
            self.timeseries[key] = data
            for timeserie in data:
                if not isinstance(timeserie, dict):
                    raise ValueError(f"Invalid timeserie value: {timeserie}")
                if not all(k in timeserie for k in ("log_date", "value", "id")):
                    raise ValueError(f"Missing keys in timeserie: {timeserie}")
                try:
                    timeserie_model = TimeserieDTO.from_dict(timeserie)
                except ValueError as e:
                    raise ValueError(f"Invalid timeserie data: {timeserie}") from e
            return True
        return False

    def get_timeseries(self, key=None):
        if key:
            return self.timeseries.get(key)
        return self.timeseries

    def clear_timeseries(self):
        self.timeseries.clear()
