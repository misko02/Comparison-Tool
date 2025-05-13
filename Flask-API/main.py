import csv
import json
import sys

from flask import Flask, jsonify, request
import datetime


class TimeSeriesManager:
    def __init__(self):
        self.timeseries = {}

    def add_timeseries(self, key, data):
        if isinstance(data, list):
            self.timeseries[key] = data
            return True
        return False

    def get_timeseries(self, key=None):
        if key:
            return self.timeseries.get(key)
        return self.timeseries

    def clear_timeseries(self):
        self.timeseries.clear()

sys.stdout.reconfigure(line_buffering=True)

timeseries_manager = TimeSeriesManager()
app = Flask(__name__)




# timeseries = [datetime.datetime(2020, 5, 20).strftime('%Y-%m-%d %H:%M:%S'), datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')]
# with open('data_model2.json', 'r') as timeseries:
#     timeseries = json.load(timeseries)
#
# with open('data.json', 'r') as timeseries2:
#     timeseries2 = json.load(timeseries2)

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
