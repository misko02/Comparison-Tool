from flask import Flask
import datetime
app = Flask(__name__)

@app.route("/timeseries")
def timeseries():
    return {"timeseries": [ datetime.datetime(1932, 5, 20).strftime('%Y-%m-%d %H:%M:%S'), datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')]}

if __name__ == "__main__":
    app.run(debug="run")