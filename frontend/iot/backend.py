from flask import Flask, render_template, request, jsonify
import serial
import json
import time
from flask_cors import CORS  # Import the CORS module

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Serial port configuration
serial_port = serial.Serial('/dev/ttyACM0', 9600, timeout=1)  # Replace 'COM3' with your Arduino serial port
latest_sensor_data = {'heartRate': 0, 'temperature': 0}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_sensor_data')
def get_sensor_data():
    data = []
    start_time = time.time()

    while time.time() - start_time < 10:
        raw_data = serial_port.readline().decode().strip()
        if raw_data:
            data.append(json.loads(raw_data))
            time.sleep(1)  # Delay for 1 second between readings

    print(data)

    if data:
        # Calculate average values
        heart_rate_avg = round(sum(d['heartRate'] for d in data) / len(data), 2)
        temperature_avg = round(sum(d['temperature'] for d in data) / len(data), 2)

        # Update latest_sensor_data
        latest_sensor_data['heartRate'] = heart_rate_avg
        latest_sensor_data['temperature'] = temperature_avg

        print("#########")
        print(latest_sensor_data)
        print("#########")

        return json.dumps({'heartRate': heart_rate_avg, 'temperature': temperature_avg})

    return json.dumps({'heartRate': 0, 'temperature': 0})

@app.route('/get_latest_sensor_data')
def get_latest_sensor_data():
    return jsonify(latest_sensor_data)

if __name__ == '__main__':
    # Specify the desired port, for example, port 5001
    app.run(debug=True, port=7000)
