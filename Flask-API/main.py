import sys
from services.time_series_manager import TimeSeriesManager
import services.metric_service as metric_service 

from flask import Flask, jsonify, request

sys.stdout.reconfigure(line_buffering=True)


timeseries_manager = TimeSeriesManager()
app = Flask(__name__)
logger = app.logger


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
        data = timeseries_manager.get_timeseries(filename, category)
        mean = metric_service.calculate_basic_statistics(data)["mean"]
    except Exception as e:
        logger.error(f"Error calculating mean for filename '{filename}' and category '{category}': {e}")
        return jsonify({"error": str(e)}), 400
    if mean is None:
        logger.warning(f"No valid timeseries data provided for mean calculation for filename '{filename}' and category '{category}'")
        return jsonify({"error": "No valid timeseries data provided"}), 400
    logger.info(f"Successfully calculated mean for provided timeseries data for filename '{filename}' and category '{category}'")

    return jsonify({"mean": mean}), 200


# # args: filename, category 
# @app.route("/timeseries/get_mean/", methods=["GET"])
# def get_mean():
#     filename = request.args.get("filename")
#     category = request.args.get("category")
#     try:
#         timeseries = timeseries_manager.get_timeseries(filename, category)
#     except Exception as e:
#         logger.error(f"Error calculating mean for filename '{filename}' and category '{category}': {e}")
#         return jsonify({"error": str(e)}), 400
#     if not mean:
#         logger.warning(f"No valid timeseries data provided for mean calculation for filename '{filename}' and category '{category}'")
#         return jsonify({"error": "No valid timeseries data provided"}), 400
#     logger.info(f"Successfully calculated mean for provided timeseries data for filename '{filename}' and category '{category}'")

#     return jsonify({"mean": mean}), 200

@app.route("/upload-timeseries", methods=["POST"])
def add_timeseries():
    data = request.get_json()
    if not isinstance(data, dict):
        logger.error("Invalid data format: Expected a JSON object with keys as identifiers")
        return jsonify({"error": "Expected a JSON object with keys as identifiers"}), 400

    timeseries_manager.clear_timeseries()

    for time, values in data.items():
        if not isinstance(values, dict):
            logger.error(f"Invalid data format for time '{time}': Expected a dictionary")
            timeseries_manager.clear_timeseries()
            return jsonify({"error": f"Invalid data format for time '{time}': Expected a dictionary"}), 400
        try:
            logger.info(f"Adding timeseries for time '{time}' with values: {values}")
            timeseries_manager.add_timeseries(time, values)
        except ValueError as e:
            logger.error(f"Error adding timeseries for time '{time}': {e}")
            timeseries_manager.clear_timeseries()
            return jsonify({"error": str(e)}), 400
        
    # for key, timeseries_list in data.items():
    #     if not isinstance(timeseries_list, list):
    #         logger.error(f"Invalid data format for key '{key}': Expected a list")
    #         timeseries_manager.clear_timeseries()
    #         return jsonify({"error": f"Invalid data format for key '{key}': Expected a list"}), 400
    #     try:
    #         timeseries_manager.add_timeseries(key, timeseries_list)
    #     except Exception as e:
    #         logger.error(f"Error adding timeseries for key '{key}': {e}")
    #         timeseries_manager.clear_timeseries()
    #         return jsonify({"error": str(e)}), 400
    
    return jsonify({"status": "Data uploaded" }), 201

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
