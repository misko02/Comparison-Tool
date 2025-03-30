from flask import Flask, jsonify, request
import datetime
app = Flask(__name__)

timeseries = [datetime.datetime(2020, 5, 20).strftime('%Y-%m-%d %H:%M:%S'), datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')]

@app.route("/timeseries", methods=["GET"])
def get_timeseries():
    return jsonify(timeseries)

@app.route("/timeseries", methods=["POST"])
def add_timeserie():
    timeseries.append(request.get_data().decode("utf-8"))
    return jsonify(timeseries)

if __name__ == "__main__":
    app.run(debug="run", host="0.0.0.0", port=5000)