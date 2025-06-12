import unittest
import pandas as pd
from services.metric_service import *

class TestMetrics(unittest.TestCase):
    '''Test the metrics module'''
    
    def test_mean(self):
        #arrange 
        timeserie = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        expected_mean = 3.0
        
        #act
        statistics = calculate_basic_statistics(timeserie)
        mean = statistics['mean']

        #assert
        self.assertIsInstance(mean, float, "Mean should be a float")
        self.assertFalse(pd.isna(mean), "Mean should not be NaN")
        self.assertEqual(mean, expected_mean, "Mean should be equal to expected value")
        
    def test_median(self):
        #arrange 
        timeserie = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        expected_median = 3.0
        
        #act
        statistics = calculate_basic_statistics(timeserie)
        median = statistics['median']
        
        #assert
        self.assertIsInstance(median, float, "Median should be a float")
        self.assertFalse(pd.isna(median), "Median should not be NaN")
        self.assertEqual(median, expected_median, "Median should be equal to expected value")

    def test_variance(self):
        #arrange 
        timeserie = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        expected_variance = 2.0
        
        #act
        statistics = calculate_basic_statistics(timeserie)
        variance = statistics['variance']
        #assert
        self.assertIsInstance(variance, float, "Variance should be a float")
        self.assertFalse(pd.isna(variance), "Variance should not be NaN")
        self.assertEqual(variance, expected_variance, "Variance should be equal to expected value")

    def test_std_dev(self):
        #arrange 
        timeserie = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        
        expected_std_dev = 1.4142135623730951

        #act
        statistics = calculate_basic_statistics(timeserie)
        std_dev = statistics['std_dev']

        #assert
        self.assertIsInstance(std_dev, float, "Standard deviation should be a float")
        self.assertFalse(pd.isna(std_dev), "Standard deviation should not be NaN")
        self.assertAlmostEqual(std_dev, expected_std_dev, places=6, msg="Standard deviation should be almost equal to expected value")
        
    # def test_autocorrelation(self):
    #     #arrange 
    #     timeserie = pd.Series([1, 2, 3, 4, 5], index=pd.date_range('2023-01-01', periods=5, freq='D'))
    #     expected_acf = [1.0, 0.8, 0.6, 0.4, 0.2]
    #     #act
    #     acf_values = calculate_autocorrelation(timeserie, nlags=4)
    #     #assert
    #     self.assertIsInstance(acf_values, np.ndarray, "ACF values should be a numpy array")
    #     self.assertEqual(len(acf_values), 5, "ACF values should have length equal to nlags + 1")
    #     self.assertTrue(np.allclose(acf_values[:5], expected_acf, rtol=1e-05, atol=1e-08), "ACF values should match expected values")
        
    def test_coefficient_of_variation(self):
        #arrange 
        timeserie = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        expected_cv = 0.4714045207910317

        #act
        cv = calculate_coefficient_of_variation(timeserie)
        
        #assert
        self.assertIsInstance(cv, float, "Coefficient of variation should be a float")
        self.assertFalse(pd.isna(cv), "Coefficient of variation should not be NaN")
        self.assertAlmostEqual(cv, expected_cv, places=6, msg="Coefficient of variation should be almost equal to expected value")
        
    def test_iqr(self):
        #arrange 
        timeserie = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        expected_iqr = 2.0

        #act
        iqr = calculate_iqr(timeserie)
        
        #assert
        self.assertIsInstance(iqr, float, "IQR should be a float")
        self.assertFalse(pd.isna(iqr), "IQR should not be NaN")
        self.assertEqual(iqr, expected_iqr, "IQR should be equal to expected value")
        
    def test_pearson_correlation(self):
        #arrange 
        series1 = {
            "2023-01-01": 1,
            "2023-01-02": 2,
            "2023-01-03": 3,
            "2023-01-04": 4,
            "2023-01-05": 5
        }
        series2 = {
            "2023-01-01": 5,
            "2023-01-02": 4,
            "2023-01-03": 3,
            "2023-01-04": 2,
            "2023-01-05": 1
        }
        expected_corr = -1.0

        #act
        corr = calculate_pearson_correlation(series1, series2)
        
        #assert
        self.assertIsInstance(corr, float, "Pearson correlation should be a float")
        self.assertAlmostEqual(corr, expected_corr, places=6, msg="Pearson correlation should be almost equal to expected value")
        