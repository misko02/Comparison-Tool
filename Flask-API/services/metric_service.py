import numpy as np
import pandas as pd
from scipy.stats import pearsonr, spearmanr, kendalltau
from statsmodels.tsa.stattools import acf, ccf
from dtw import dtw  


# --- Metrics for single time series ---
def calculate_basic_statistics(series: dict):
    """ 
    Calculates basic descriptive statistics for a time series.
    Args:
        series (dict): Timeseries
    Returns:
        dict: Dictionary with four statistics: mean, median, variance, std_dev.
    """
    if not series or not isinstance(series, dict):
        return {"mean": np.nan, "median": np.nan, "variance": np.nan, "std_dev": np.nan}
    if not all(isinstance(v, (int, float)) for v in series.values()):
        return "series values must be numeric"
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

def calculate_autocorrelation(series: dict):
    """
    Calculates the autocorrelation function (ACF) for a time series.
    Args:
        series (dict): Timeseries.
    Returns:
        np.ndarray: Array of ACF values.
    """
    if not series or not isinstance(series, dict):
        return np.array([])
    if any(not isinstance(v, (int, float))  for v in series.values() ):
        return np.nan
    try:
        series: pd.Series = pd.Series(series)
        data = pd.to_numeric(series, errors='coerce').dropna().values
    except Exception as e:
        return "could not convert series to pd.Series: " + str(e)
    # acf from statsmodels returns the autocorrelation values for lags 0 to nlags
    # we use nlags=1 to get the first lag autocorrelation
    acf_values = acf(data, nlags=1, fft=True)
    return float(acf_values[1])


def calculate_coefficient_of_variation(series: dict):
    """
    Calculates the coefficient of variation (CV).
    Args:
        series (dict): Timeseries.
    Returns:
        float: Coefficient of variation.
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
    Args:
        series (dict): Timeseries.
    Returns:
        float: IQR value.
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
    Args:
        series1 (dict): First time series.
        series2 (dict): Second time series.
    Returns:
        float: Pearson correlation coefficient.
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

