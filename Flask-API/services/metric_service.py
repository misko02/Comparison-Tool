import numpy as np
import pandas as pd
from scipy.stats import pearsonr, spearmanr, kendalltau
from statsmodels.tsa.stattools import acf, ccf
from dtw import dtw  


# --- Metryki dla pojedynczego szeregu czasowego ---
def calculate_basic_statistics(series: dict):
    """ 
    Calulates basic descriptive statistics for a time series.
    :param series: Timeseries (pd.Series).
    :return: dictionary with four statistics: mean, median, variance, std_dev.
    """
    if not series or not isinstance(series, dict):
        return {"mean": np.nan, "median": np.nan, "variance": np.nan, "std_dev": np.nan}
    try:
        # Convert the dictionary to a pandas Series
        series: pd.Series = pd.Series(series)
    except Exception as e:
        return "could not convert series to pd.Series: " + str(e)
    return {
        "mean": series.mean(),
        "median": series.median(),
        "variance": series.var(ddof=0),  # ddof=0 for population variance
        "std_dev": series.std(ddof=0)   # ddof=0 for population standard deviation
    }

def calculate_autocorrelation(series: dict, nlags: int = 20):
    """
    Calculates the autocorrelation function (ACF) for a time series.
    :param series: Time series (pd.Series).
    :param nlags: Maximum lag to compute ACF.
    :return: Array of ACF values.
    """
    if not series or not isinstance(series, dict):
        return np.array([])
    try:
        series: pd.Series = pd.Series(series)
    except Exception as e:
        return "could not convert series to pd.Series: " + str(e)
    # acf from statsmodels returns the autocorrelation values for lags 0 to nlags
    return acf(series, nlags=nlags, fft=True)

#JESZCZE POTRZEBNY JEST ZAKRES MIN MAX SZEREGU

def calculate_coefficient_of_variation(series: dict):
    """
    Calculates the coefficient of variation (CV).
    :param series: Time series (pd.Series).
    :return: Coefficient of variation.
    """
    if not series or not isinstance(series, dict):
        return np.nan
    try:
        series: pd.Series = pd.Series(series)
    except Exception as e:
        return "could not convert series to pd.Series: " + str(e)
    if series.mean() == 0:
        return np.nan  # Avoid division by zero
    return series.std(ddof=0) / series.mean()

def calculate_iqr(series: dict):
    """
    Calculates the interquartile range (IQR).
    :param series: Time series (pd.Series).
    :return: IQR value.
    """
    if not series or not isinstance(series, dict):
        return np.nan
    try:
        series: pd.Series = pd.Series(series)
    except Exception as e:
        return np.nan
    return series.quantile(0.75) - series.quantile(0.25)


# --- Metryki dla porównywania wielu szeregów ---
def calculate_pearson_correlation(series1: dict, series2: dict):
    """
    Calculates the Pearson correlation coefficient between two series.
    :param series1: First time series (pd.Series).
    :param series2: Second time series (pd.Series).
    :return: Pearson correlation coefficient.
    """
    if not series1 or not series2 or len(series1) != len(series2):
        return np.nan
    try:
        series1: pd.Series = pd.Series(series1)
        series2: pd.Series = pd.Series(series2)
    except Exception as e:
        return "could not convert series to pd.Series: " + str(e)
    corr, _ = pearsonr(series1, series2)
    return corr


#POTRZEBA JESZCZE ŚREDNIE WARTOŚCI DLA WSZYSTKICH SZEREGÓW TYCH FUNKCJI def calculate_coefficient_of_variation(series: pd.Series):