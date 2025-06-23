import sys
from services.time_series_manager import TimeSeriesManager
import services.metric_service as metric_service

from flask import Flask, jsonify, request

sys.stdout.reconfigure(line_buffering=True)


timeseries_manager = TimeSeriesManager()
app = Flask(__name__)
logger = app.logger
logger.setLevel("DEBUG")

@app.route("/timeseries", methods=["GET"])
def get_timeseries():

    """
    Get timeseries data for a specific filename and category.

    Returns:
        JSON response with timeseries data or error message.
    """

    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename, category)
    except (KeyError, ValueError) as e:
        logger.error("Error fetching timeseries for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if data is None:
        logger.warning("Timeseries not found for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "Timeseries not found"}), 404
    logger.info("Successfully fetched timeseries for filename '%s' and category '%s'", filename, category)
    return jsonify(data), 200

@app.route("/timeseries/mean", methods=["GET"])
def get_mean():
    """
    Get the mean value of the timeseries for a specific filename and category.

    Returns:
        JSON response with the mean value or error message.
    """
    
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        mean = metric_service.calculate_basic_statistics(serie)['mean']
    except (KeyError, ValueError) as e:
        logger.error("Error calculating mean for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if mean is None:
        logger.warning("No valid timeseries data provided for mean calculation for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated mean for provided timeseries data for filename '%s' and category '%s'", filename, category)

    return jsonify({"mean": mean}), 200

@app.route("/timeseries/median", methods=["GET"])
def get_median():
    """
    Get the median value of the timeseries for a specific filename and category.

    Returns:
        JSON response with the median value or error message.
    """
    
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        median = metric_service.calculate_basic_statistics(serie)['median']
        logger.debug("Calculated median: %s for filename '%s' and category '%s'", median, filename, category)
    except (KeyError, ValueError) as e:
        logger.error("Error calculating median for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if median is None:
        logger.warning("No valid timeseries data provided for median calculation for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated median for provided timeseries data for filename '%s' and category '%s'", filename, category)

    return jsonify({"median": median}), 200
@app.route("/timeseries/variance", methods=["GET"])
def get_variance():
    """
    Get the variance of the timeseries for a specific filename and category.

    Returns:
        JSON response with the variance value or error message.
    """

    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        variance = metric_service.calculate_basic_statistics(serie)["variance"]
    except (KeyError, ValueError) as e:
        logger.error("Error calculating variance for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if variance is None:
        logger.warning("No valid timeseries data provided for variance calculation for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated variance for provided timeseries data for filename '%s' and category '%s'", filename, category)

    return jsonify({"variance": variance}), 200
@app.route("/timeseries/standard_deviation", methods=["GET"])
def get_standard_deviation():
    """
    Get the standard deviation of the timeseries for a specific filename and category.

    Returns:
        JSON response with the standard deviation value or error message.
    """
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        std_dev = metric_service.calculate_basic_statistics(serie)["std_dev"]
    except (KeyError, ValueError) as e:
        logger.error("Error calculating standard deviation for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if std_dev is None:
        logger.warning("No valid timeseries data provided for standard deviation calculation for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated standard deviation for provided timeseries data for filename '%s' and category '%s'", filename, category)

    return jsonify({"standard_deviation": std_dev}), 200


@app.route("/timeseries/autocorrelation", methods=["GET"])
def get_autocorrelation():
    """
    Get the autocorrelation of the timeseries for a specific filename and category.
    Returns:
        JSON response with the autocorrelation value or error message.
    """
    if not request.args.get("filename") or not request.args.get("category"):
        logger.error("Missing required parameters: 'filename' and 'category'")
        return jsonify({"error": "Missing required parameters: 'filename' and 'category'"}), 400
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        acf_value = metric_service.calculate_autocorrelation(serie)
    except (KeyError, ValueError) as e:
        logger.error("Error calculating autocorrelation for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if acf_value is None:
        logger.warning("No valid timeseries data provided for autocorrelation calculation for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated autocorrelation for provided timeseries data for filename '%s' and category '%s'", filename, category)

    return jsonify({"autocorrelation": acf_value}), 200

@app.route("/timeseries/coefficient_of_variation", methods=["GET"])
def get_coefficient_of_variation():
    """
    Get the coefficient of variation of the timeseries for a specific filename and category.

    Returns:
        JSON response with the coefficient of variation value or error message.
    """
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        cv = metric_service.calculate_coefficient_of_variation(serie)
    except (KeyError, ValueError) as e:
        logger.error("Error calculating coefficient of variation for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if cv is None:
        logger.warning("No valid timeseries data provided for coefficient of variation calculation for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated coefficient of variation for provided timeseries data for filename '%s' and category '%s'", filename, category)

    return jsonify({"coefficient_of_variation": cv}), 200

@app.route("/timeseries/iqr", methods=["GET"])
def get_iqr():
    """
    Get the interquartile range (IQR) of the timeseries for a specific filename and category.

    Returns:
        JSON response with the IQR value or error message.
    """
    
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        iqr = metric_service.calculate_iqr(serie)
    except (KeyError, ValueError) as e:
        logger.error("Error calculating IQR for filename '%s' and category '%s': %s", filename, category, e)
        return jsonify({"error": str(e)}), 400
    if iqr is None:
        logger.warning("No valid timeseries data provided for IQR calculation for filename '%s' and category '%s'", filename, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated IQR for provided timeseries data for filename '%s' and category '%s'", filename, category)

    return jsonify({"iqr": iqr}), 200

@app.route("/timeseries/pearson_correlation", methods=["GET"])
def get_pearson_correlation():
    """
    Get the Pearson correlation between two timeseries for specific filenames and category.

    Returns:
        JSON response with the Pearson correlation value or error message.
    """
    filename1 = request.args.get("filename1")
    filename2 = request.args.get("filename2")
    category = request.args.get("category")
    try:
        data1 = timeseries_manager.get_timeseries(filename=filename1, category=category)
        serie1 = metric_service.extract_series_from_dict(data1, category, filename1)
        data2 = timeseries_manager.get_timeseries(filename=filename2, category=category)
        serie2 = metric_service.extract_series_from_dict(data2, category, filename2)
        correlation = metric_service.calculate_pearson_correlation(serie1, serie2)
    except (KeyError, ValueError) as e:
        logger.error("Error calculating Pearson correlation for filenames '%s' and '%s' in category '%s': %s", filename1, filename2, category, e)
        return jsonify({"error": str(e)}), 400
    if correlation is None:
        logger.warning("No valid timeseries data provided for Pearson correlation calculation for filenames '%s' and '%s' in category '%s'", filename1, filename2, category)
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info("Successfully calculated Pearson correlation for provided timeseries data for filenames '%s' and '%s' in category '%s'", filename1, filename2, category)
    return jsonify({"pearson_correlation": correlation}), 200

@app.route("/upload-timeseries", methods=["POST"])
def add_timeseries():
    """
    Upload new timeseries data.

    Returns:
        JSON response indicating success or failure.
    """
    data = request.get_json()
    if not isinstance(data, dict):
        logger.error("Invalid data format: Expected a JSON object with keys as identifiers")
        return jsonify({"error": "Expected a JSON object with keys as identifiers"}), 400
    current_timeseries = timeseries_manager.timeseries.copy()
    for time, values in data.items():
        if not isinstance(values, dict):
            logger.error("Invalid data format for time '%s': Expected a dictionary", time)
            return jsonify({f"error": "Invalid data format for time '{time}': Expected a dictionary"}), 400
        try:
            timeseries_manager.add_timeseries(time, values)
            current_timeseries[time] = values
        except ValueError as e:
            logger.error("Error adding timeseries for time '%s': %s", time, e)
            timeseries_manager.timeseries = current_timeseries  # Restore previous state
            return jsonify({"error": str(e)}), 400
    logger.info("All timeseries data uploaded successfully")
    return jsonify({"status": "Data uploaded"}), 201

@app.route("/clear-timeseries", methods=["DELETE"])
def clear_timeseries():
    """
    Clear all timeseries data.

    Returns:
        JSON response indicating success or failure.
    """
    try:
        timeseries_manager.clear_timeseries()
    except Exception as e:
        logger.error("Error clearing timeseries: %s", e)
        return jsonify({"error": str(e)}), 400
    return jsonify({"status": "All timeseries cleared"}), 200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
