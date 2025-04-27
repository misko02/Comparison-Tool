import csv
import json
import sys

from flask import Flask, jsonify, request
import datetime


class TimeSeriesManager:
    def __init__(self):
        self.timeseries = []

    def add_timeseries(self, data):
        if isinstance(data, list):
            self.timeseries.extend(data)
            return data
        return None

    def get_timeseries(self):
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
    timeseries_data = timeseries_manager.get_timeseries()
    return jsonify({"timeseries1": timeseries_data}), 201

# , "timeseries2": timeseries2

@app.route("/upload-timeseries", methods=["POST"])
def add_timeseries():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    timeseries_manager.clear_timeseries()
    added_data = timeseries_manager.add_timeseries(data)


    if isinstance(data, list):
        added_data.extend(data)
    return jsonify(added_data), 201
    #
    #     return jsonify({
    #         "error": "Invalid data format",
    #         "expected": "Array of entries or object with 'log_date' field"
    #     }), 400



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)