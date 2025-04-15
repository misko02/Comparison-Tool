import csv
import json

from flask import Flask, jsonify, request
import datetime


app = Flask(__name__)


# timeseries = [datetime.datetime(2020, 5, 20).strftime('%Y-%m-%d %H:%M:%S'), datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')]
with open('data_extended.json', 'r') as timeseries:
    timeseries = json.load(timeseries)

with open('data_minus_5.json', 'r') as timeseries2:
    timeseries2 = json.load(timeseries2)

@app.route("/timeseries", methods=["GET"])
def get_timeseries():
    return jsonify({"timeseries1": timeseries, "timeseries2": timeseries2})

@app.route("/timeseries", methods=["POST"])
def add_timeserie():
    data = request.get_json()
    if not data or "timestamp" not in data:
        return jsonify({"error": "Invalid request"}), 400

    timeseries.append(data["timestamp"])
    return jsonify(timeseries), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)