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
To run unittests you have to type in commandline while being in API folder `python -m unittest -v ./tests/*.py`. 

**ATTENTION**<br> 
Be sure you have *unittest* package installed. 

## Endpoints
### GET:
    /timeseries
        Get all available timeseries

    /timeseries?category&filename
        Get values from specified category and file
    
    /timeseries/mean?category&filename
        Get mean values for specified category in the file

    /timeseries/median?category&filename
        Get median values for specified category in the file

    /timeseries/standard-deviation?category&filename
        Get standard deviation values for specified category in the file

    /timeseries/variance?category&filename
        Get variance values for specified category in the file

    /timeseries/autocorrelation?category&filename
        Get autocorrelation values for specified category in the file

    /timeseries/coefficient_of_varation?category&filename
        Get coefficient of variation values for specified category in the file
    
    /timeseries/iqr?category&filename
        Get interquartile range values for specified category in the file
    
    /timeseries/pearson_correlation?category&filename1&filename2
        Get Pearson correlation coefficient between two files for specified category

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