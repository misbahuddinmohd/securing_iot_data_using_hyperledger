//================================ for IoT simulator  ====================================================
let isSimulationRunning = false;
let intervalId;
let patientIdSim;
let patientNameSim;
let patientTokenSim;

// Updated arrays for simulation values
let temperatureValues = [36.5, 37.0, 36.8, 37.2, 36.6];
let heartRateValues = [70, 72, 68, 75, 71];
let bloodPressureValues = ["120/80", "130/85", "118/76", "125/82", "122/78"];
let spo2Values = [98, 97, 99, 96, 98];

function startSimulation() {
  patientIdSim = document.getElementById('patientIdSim').value;
  patientNameSim = document.getElementById('patientNameSim').value;
  patientTokenSim = document.getElementById('patientTokenSim').value;

  if (!patientIdSim || !patientNameSim || !patientTokenSim) {
    alert('Please enter patient ID, patient name, and authorization token');
    return;
  }

  isSimulationRunning = true;
  simulateSensors();
  intervalId = setInterval(() => {
    simulateSensors();
  }, 3000); // Send values every 3 seconds
}

function stopSimulation() {
  isSimulationRunning = false;
  clearInterval(intervalId);
}

async function sendSensorData() {
  if (!isSimulationRunning) {
    return;
  }

  // Use pre-defined arrays for sensor values
  let temperature = temperatureValues.shift();
  let heartRate = heartRateValues.shift();
  let bloodPressure = bloodPressureValues.shift();
  let spo2 = spo2Values.shift();

  // Store values in arrays
  temperatureValues.push(temperature);
  heartRateValues.push(heartRate);
  bloodPressureValues.push(bloodPressure);
  spo2Values.push(spo2);

  displaySensorValues(temperature, heartRate, bloodPressure, spo2);

  const url = 'http://localhost:4000/channels/mychannel/chaincodes/fabcar';
  const args = [patientIdSim, temperature.toString(), heartRate.toString(), bloodPressure, spo2.toString(), patientNameSim];

  const requestBody = {
    fcn: 'changeCarOwner',
    peers: ['peer0.org1.example.com', 'peer0.org2.example.com'],
    chaincodeName: 'fabcar',
    channelName: 'mychannel',
    args: args
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${patientTokenSim}`
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    // Log the sent data and transaction ID without waiting for the response
    const logMessage = `Sent: PatientId=${patientIdSim}, Pname=${patientNameSim}, Temp=${temperature}, Heartrate=${heartRate}, BP=${bloodPressure}, Spo=${spo2}, TX_ID=${result.result.tx_id}`;
    displayLogs(logMessage);

  } catch (error) {
    console.error(`Error sending data: ${error}`);
  }
}

function simulateSensors() {
  sendSensorData();
}

function displaySensorValues(temperature, heartRate, bloodPressure, spo2) {
  document.getElementById('temperature-value').innerText = `Temperature: ${temperature} °C`;
  document.getElementById('heartRate-value').innerText = `Heart Rate: ${heartRate} BPM`;
  document.getElementById('bloodPressure-value').innerText = `Blood Pressure: ${bloodPressure}`;
  document.getElementById('spo2-value').innerText = `SPO2: ${spo2}%`;
}

function displayLogs(log) {
  const logsContainer = document.getElementById('logs-container');
  const logElement = document.createElement('div');
  logElement.classList.add('log-row'); // Add a class for styling
  logElement.textContent = log;
  logsContainer.appendChild(logElement);

  // Scroll logs to the bottom on update
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

//========================================================================================================
