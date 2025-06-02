from dataclasses import dataclass
import dateutil
from dateutil.parser import parse
from datetime import datetime
@dataclass 
class TimeserieDTO:
    
    """
    Data Transfer Object for Timeserie
    """
    
    log_date: datetime
    values: list[float]

    @classmethod
    def from_dict(cls, data):
        
        """
        Create a TimeserieDTO instance from a dictionary
        """
        
        return cls(
            log_date=dateutil.parser.parse(data['log_date']),
            values=data["values"],
        )
    