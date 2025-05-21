import sys
from services.time_series_manager import TimeSeriesManager

from flask import Flask, jsonify, request

sys.stdout.reconfigure(line_buffering=True)


timeseries_manager = TimeSeriesManager()
app = Flask(__name__)



@app.route("/timeseries", methods=["GET"])
def get_timeseries():
    key = request.args.get("key")
    data = timeseries_manager.get_timeseries(key)
    if data is None:
        return jsonify({"error": "Key not found"}), 404
    return jsonify(data), 200

@app.route("/upload-timeseries", methods=["POST"])
def add_timeseries():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Expected a JSON object with keys as identifiers"}), 400

    timeseries_manager.clear_timeseries()

    for key, timeseries_list in data.items():
        if not isinstance(timeseries_list, list):
            return jsonify({"error": f"Invalid data format for key '{key}'"}), 400
        timeseries_manager.add_timeseries(key, timeseries_list)

    return jsonify({"status": "Data uploaded", "files": list(data.keys())}), 201



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
