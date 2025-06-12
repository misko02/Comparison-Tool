# This is documentation of Flask API for Comparison Tool Aplication

## File Structure 
```
|- interfaces – interfaces for application
|- services – utility classes used as services in application
|- tests – Unit tests
| Dockerfile – Dockerfile to containerize APi
| README.md – Documentation of API
| requirments.txt - list of python packages needed to run application
| main.py – main file of program
```
## Running Aplication
You can run backend of application by simply typing `python3 main.py` in the terminal or run the whole application using `docker compose up --build`

## Testing application
To run unittests you have to type in commandline while being in API folder `python -m unittest -v ./tests/*.py`

## Endpoints
### GET:
    /timeseries
        Get all available timeseries

    /timeseries?category&filename
        Get values from specified category and file
    
    /timeseries/mean?category&filename
        Get mean values for specified category in the file

### POST:
    /upload-timeseries 
        Post new timeseries

### DELETE 
    /clear-timeseries
        Clear list of timeseries

## Authors
- Michał Bojara 
- Mikołaj Szulc
- Franciszka Jędraszak
- Karol Kowalczyk 
- Natalia Szymczak