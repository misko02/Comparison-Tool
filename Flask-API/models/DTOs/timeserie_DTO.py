from dataclasses import dataclass
from datetime import datetime


@dataclass 
class TimeserieDTO:
    """
    Data Transfer Object for Timeserie
    """
    log_date: datetime
    value: float
    id: int
    
    @classmethod
    def from_dict(cls, data):
        """
        Create a TimeserieDTO instance from a dictionary
        """
        return cls(
            log_date=datetime.strptime(data["log_date"], "%Y-%m-%d %H:%M:%S.%f"),
            value=data["value"],
            id=data["id"]
        )
    