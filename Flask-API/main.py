import csv
import json
import sys

from flask import Flask, jsonify, request
import datetime

sys.stdout.reconfigure(line_buffering=True)

app = Flask(__name__)

timeseries = []



# timeseries = [datetime.datetime(2020, 5, 20).strftime('%Y-%m-%d %H:%M:%S'), datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')]
# with open('data_model2.json', 'r') as timeseries:
#     timeseries = json.load(timeseries)
#
# with open('data.json', 'r') as timeseries2:
#     timeseries2 = json.load(timeseries2)


@app.route("/timeseries", methods=["GET"])
def get_timeseries():
    data = timeseries.copy()
    timeseries.clear()
    return jsonify({"timeseries1": data}), 201

# , "timeseries2": timeseries2

@app.route("/upload-timeseries", methods=["POST"])
def add_timeseries():
    global timeseries
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400


    if isinstance(data, list):
        timeseries.extend(data)
    return jsonify(data), 201
    # else:
    #     return jsonify({
    #         "error": "Invalid data format",
    #         "expected": "Array of entries or object with 'log_date' field"
    #     }), 400



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)