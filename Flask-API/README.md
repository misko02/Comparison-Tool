# This is documentation of Flask API for Comparison Tool Aplication

## File Structure 
```
|- interfaces – interfaces for application
|- models – model classes for aplication
    |- DTOs – records used for objects sent by and to API
|- services – utility classes used as services in application
|- tests – Unit tests
| Dockerfile – Dockerfile to containerize APi
| README.md – Documentation of API
| requirments.txt - list of python packages needed to run application
| main.py – main file of program
```
## Running Aplication
You can run backend of application by simply typing `python3 main.py` in the terminal or run the whole application using `docker compose up --build`

## Endpoints
### GET:
    /timeseries - Get all avaible timeseries
    /timeseries/{key} - Get specified timeserie

### POST:
    /upload-timeseries - Post new timeseries to list

### DELETE 
    /clear-timeseries - Clear list of timeseries

## Authors
- Michał Bojara 
- Mikołaj Szulc
- Franciszka Jędraszak
- Karol Kowalczyk 
- Natalia Szymczak