import unittest
import pandas as pd
import numpy as np
import services.metric_service as metric_service
from services.metric_service import *

# Python

class TestCalculateBasicStatistics(unittest.TestCase):
    def test_typical_series(self):
        series = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        stats = calculate_basic_statistics(series)
        self.assertAlmostEqual(stats["mean"], 3.0)
        self.assertAlmostEqual(stats["median"], 3.0)
        self.assertAlmostEqual(stats["variance"], 2.0)
        self.assertAlmostEqual(stats["std_dev"], 1.4142135623730951)

    def test_empty_series(self):
        stats = calculate_basic_statistics({})
        self.assertTrue(np.isnan(stats["mean"]))
        self.assertTrue(np.isnan(stats["median"]))
        self.assertTrue(np.isnan(stats["variance"]))
        self.assertTrue(np.isnan(stats["std_dev"]))

    def test_non_dict_input(self):
        stats = calculate_basic_statistics([1, 2, 3])
        self.assertTrue(np.isnan(stats["mean"]))
        self.assertTrue(np.isnan(stats["median"]))
        self.assertTrue(np.isnan(stats["variance"]))
        self.assertTrue(np.isnan(stats["std_dev"]))

    def test_nan_values(self):
        series = {
            "2023-01-01": np.nan,
            "2023-01-02": 2,
            "2023-01-03": 3
        }
        stats = calculate_basic_statistics(series)
        self.assertFalse(pd.isna(stats["mean"]))
        self.assertFalse(pd.isna(stats["median"]))
        self.assertFalse(pd.isna(stats["variance"]))
        self.assertFalse(pd.isna(stats["std_dev"]))

    def test_string_values(self):
        series = {
            "2023-01-01": "a",
            "2023-01-02": "b"
        }
        result = calculate_basic_statistics(series)
        self.assertTrue(isinstance(result, str) or all(np.isnan(result[k]) for k in result))

class TestCalculateAutocorrelation(unittest.TestCase):
    def test_typical_series(self):
        
        #arrange
        series = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }

        #act 
        acf_value = calculate_autocorrelation(series)

        #assert
        self.assertAlmostEqual(acf_value, 0.4, places=1)  # Example expected value

    def test_empty_series(self):
        #arrange
        series = {}
        
        #act
        acf_value = calculate_autocorrelation(series)
        
        #assert
        self.assertEqual(acf_value, np.array([]))

    def test_non_dict_input(self):
        #arrange
        series = [1, 2, 3]

        #act
        acf_value = calculate_autocorrelation(series)

        #assert
        self.assertEqual(acf_value, np.array([]))

    def test_nan_values(self):
        
        #arrange
        series = {
            "2023-01-01": np.nan,
            "2023-01-02": 2,
            "2023-01-03": 3
        }
        
        #act
        acf_value = calculate_autocorrelation(series)
        print(acf_value)

        
        #assert
        self.assertTrue(np.isnan(acf_value))

if __name__ == "__main__":
    unittest.main()