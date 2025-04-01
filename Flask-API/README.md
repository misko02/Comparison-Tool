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
| main.py – main file of program
```
## Running Aplication
You can run backend of application by simply typing `python3 main.py` in the terminal.

## Endpoints
### GET:
    /timeseries - Get all avaible timeseries

### POST:
    /timeseries - Post new timeseries to list

## Authors
- Michał Bojara 
- Mikołaj Szulc
- Franciszka Jędraszak
- Karol Kowalczyk 
- Natalia Szymczak