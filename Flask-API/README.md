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

**ATTENTION** <br>
Be sure you have *unittest* package installed.

## Endpoints

<h2 style = "color:green">GET:</h2>

<h3><span style= "color:green">/timeseries</span> </h3>
<b>Get all available timeseries</b>

<h3><span style= "color:green">/timeseries?category&filename</span></h3>
<b>Get values from specified category and file</b>

<h3><span style= "color:green">/timeseries/mean?category&filename</span></h3>
<b>Get mean values for specified category in the file</b>

<h3><span style= "color:green">/timeseries/median?category&filename</span></h3>
<b>Get median values for specified category in the file</b>

<h3><span style= "color:green">/timeseries/standard-deviation?category&filename</span></h3>
<b>Get standard deviation values for specified category in the file</b>

<h3><span style= "color:green">/timeseries/variance?category&filename</span></h3>
<b>Get variance values for specified category in the file</b>

<h3><span style= "color:green">/timeseries/autocorrelation?category&filename</span></h3>
<b>Get autocorrelation values for specified category in the file</b>

<h3><span style= "color:green">/timeseries/coefficient_of_variation?category&filename</span></h3>
<b>Get coefficient of variation values for specified category in the file</b>

<h3><span style= "color:green">/timeseries/iqr?category&filename</span></h3>
<b>Get interquartile range values for specified category in the file</b>

<h3><span style= "color:green">/timeseries/pearson_correlation?category&filename1&filename2</span></h3>
<b>Get Pearson correlation coefficient between two files for specified category</b>

<h2 style= "color:blue"> POST:</h2>
<h3><span style= "color:blue">/upload-timeseries</span></h3>
<b>Post new timeseries</b>

<h2 style= "color:red"> DELETE:</h2>
<h3><span style= "color:red">/clear-timeseries</span></h3>
<b>Clear list of timeseries</b>

## Authors

- Michał Bojara
- Mikołaj Szulc
- Franciszka Jędraszak
- Karol Kowalczyk
- Natalia Szymczak
