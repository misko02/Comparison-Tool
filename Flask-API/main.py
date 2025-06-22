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
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename, category)
    except Exception as e:
        logger.error(f"Error fetching timeseries for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if data is None:
        logger.warning(f"Timeseries not found for filename '{filename}' and category '{category}'")
        return jsonify({"error": "Timeseries not found"}), 404
    logger.info(f"Successfully fetched timeseries for filename '{filename}' and category '{category}'")
    return jsonify(data), 200

@app.route("/timeseries/mean", methods=["GET"])
def get_mean():
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        mean = metric_service.calculate_basic_statistics(serie)['mean']
    except Exception as e:
        logger.error(f"Error calculating mean for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if mean is None:
        logger.warning(f"No valid timeseries data provided for mean calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated mean for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"mean": mean}), 200

@app.route("/timeseries/median", methods=["GET"])
def get_median():
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        median = metric_service.calculate_basic_statistics(serie)['median']
        logger.debug(f"Calculated median: {median} for filename '{filename}' and category '{category}'")
    except Exception as e:
        logger.error(f"Error calculating median for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if median is None:
        logger.warning(f"No valid timeseries data provided for median calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated median for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"median": median}), 200
@app.route("/timeseries/variance", methods=["GET"])
def get_variance():
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        variance = metric_service.calculate_basic_statistics(serie)["variance"]
    except Exception as e:
        logger.error(f"Error calculating variance for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if variance is None:
        logger.warning(f"No valid timeseries data provided for variance calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated variance for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"variance": variance}), 200
@app.route("/timeseries/standard_deviation", methods=["GET"])
def get_standard_deviation():
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        std_dev = metric_service.calculate_basic_statistics(serie)["std_dev"]
    except Exception as e:
        logger.error(f"Error calculating standard deviation for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if std_dev is None:
        logger.warning(f"No valid timeseries data provided for standard deviation calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated standard deviation for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"standard_deviation": std_dev}), 200


@app.route("/timeseries/autocorrelation", methods=["GET"])
def get_autocorrelation():
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        acf_value = metric_service.calculate_autocorrelation(serie)
    except Exception as e:
        logger.error(f"Error calculating autocorrelation for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if acf_value is None:
        logger.warning(f"No valid timeseries data provided for autocorrelation calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated autocorrelation for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"autocorrelation": acf_value}), 200

@app.route("/timeseries/coefficient_of_variation", methods=["GET"])
def get_coefficient_of_variation():
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        cv = metric_service.calculate_coefficient_of_variation(serie)
    except Exception as e:
        logger.error(f"Error calculating coefficient of variation for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if cv is None:
        logger.warning(f"No valid timeseries data provided for coefficient of variation calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated coefficient of variation for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"coefficient_of_variation": cv}), 200

@app.route("/timeseries/iqr", methods=["GET"])
def get_iqr():
    filename = request.args.get("filename")
    category = request.args.get("category")
    try:
        data = timeseries_manager.get_timeseries(filename=filename, category=category)
        serie = metric_service.extract_series_from_dict(data, category, filename)
        iqr = metric_service.calculate_iqr(serie)
    except Exception as e:
        logger.error(f"Error calculating IQR for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if iqr is None:
        logger.warning(f"No valid timeseries data provided for IQR calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated IQR for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"iqr": iqr}), 200

@app.route("/timeseries/pearson_correlation", methods=["GET"])
def get_pearson_correlation():
    filename1 = request.args.get("filename1")
    filename2 = request.args.get("filename2")
    category = request.args.get("category")
    try:
        data1 = timeseries_manager.get_timeseries(filename=filename1, category=category)
        serie1 = metric_service.extract_series_from_dict(data1, category, filename1)
        data2 = timeseries_manager.get_timeseries(filename=filename2, category=category)
        serie2 = metric_service.extract_series_from_dict(data2, category, filename2)
        correlation = metric_service.calculate_pearson_correlation(serie1, serie2)
    except Exception as e:
        logger.error(f"Error calculating Pearson correlation for filenames '{filename1}' and '{filename2}' in category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if correlation is None:
        logger.warning(f"No valid timeseries data provided for Pearson correlation calculation for filenames '{filename1}' and '{filename2}' in category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated Pearson correlation for provided timeseries data for filenames '{filename1}' and '{filename2}' in category '{category}'")
    return jsonify({"pearson_correlation": correlation}), 200

@app.route("/upload-timeseries", methods=["POST"])
def add_timeseries():
    data = request.get_json()
    if not isinstance(data, dict):
        logger.error("Invalid data format: Expected a JSON object with keys as identifiers")
        return jsonify({"error": "Expected a JSON object with keys as identifiers"}), 400

    current_timeseries = timeseries_manager.timeseries
    timeseries_manager.clear_timeseries()
    for time, values in data.items():
        if not isinstance(values, dict):
            logger.error(f"Invalid data format for time '{time}': Expected a dictionary")
            return jsonify({"error": f"Invalid data format for time '{time}': Expected a dictionary"}), 400
        try:
            timeseries_manager.add_timeseries(time, values)
        except ValueError as e:
            logger.error(f"Error adding timeseries for time '{time}': {e}")
            timeseries_manager.timeseries = current_timeseries  # Restore previous state
            return jsonify({"error": str(e)}), 400
    logger.info("All timeseries data uploaded successfully")
    return jsonify({"status": "Data uploaded"}), 201

@app.route("/clear-timeseries", methods=["DELETE"])
def clear_timeseries():
    try:
        timeseries_manager.clear_timeseries()
    except Exception as e:
        logger.error(f"Error clearing timeseries: {e}")
        return jsonify({"error": str(e)}), 400
    return jsonify({"status": "All timeseries cleared"}), 200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
