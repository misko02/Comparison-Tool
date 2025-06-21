import unittest
import pandas as pd
import numpy as np
from services.metric_service import calculate_basic_statistics

# Python

class TestCalculateBasicStatistics(unittest.TestCase):
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
        stats = calculate_basic_statistics(series)
        
        #assert
        self.assertAlmostEqual(stats["mean"], 3.0)
        self.assertAlmostEqual(stats["median"], 3.0)
        self.assertAlmostEqual(stats["variance"], 2.0)
        self.assertAlmostEqual(stats["std_dev"], 1.4142135623730951)

    def test_empty_series(self):
        
        #arrange
        series = {}
        
        #act
        stats = calculate_basic_statistics(series)
        
        #assert
        self.assertTrue(np.isnan(stats["mean"]))
        self.assertTrue(np.isnan(stats["median"]))
        self.assertTrue(np.isnan(stats["variance"]))
        self.assertTrue(np.isnan(stats["std_dev"]))

    def test_non_dict_input(self):
        
        #arrange
        series = [1, 2, 3]
        
        #act
        stats = calculate_basic_statistics(series)
        
        #assert
        self.assertTrue(np.isnan(stats["mean"]))
        self.assertTrue(np.isnan(stats["median"]))
        self.assertTrue(np.isnan(stats["variance"]))
        self.assertTrue(np.isnan(stats["std_dev"]))

    def test_nan_values(self):

        #arrange
        series = {
            "2023-01-01": np.nan,
            "2023-01-02": 2,
            "2023-01-03": 3
        }
        
        #act
        stats = calculate_basic_statistics(series)
        
        #assert
        self.assertFalse(pd.isna(stats["mean"]))
        self.assertFalse(pd.isna(stats["median"]))
        self.assertFalse(pd.isna(stats["variance"]))
        self.assertFalse(pd.isna(stats["std_dev"]))

    def test_string_values(self):

        #arrange
        series = {
            "2023-01-01": "a",
            "2023-01-02": "b"
        }
        
        #act        
        result = calculate_basic_statistics(series)

        #assert
        self.assertTrue(isinstance(result, str) or all(np.isnan(result[k]) for k in result))

if __name__ == "__main__":
    unittest.main()