
//================================ for IoT simulator ====================================================
// Constants
const SIMULATION_INTERVAL = 5000; // 5sec
const FABCAR_API_URL = 'http://localhost:4000/channels/mychannel/chaincodes/fabcar';
let args=[];

// Simulation variables
let isSimulationRunning = false;
let intervalId;
let patientIdSim;
let patientNameSim;
let patientTokenSim;

// Declare sensor values array
let initialSensorValues = {
  temperature: [36.5, 37.0, 36.8, 37.2, 36.6, 98, 99, 100],
  heartRate: [70, 72, 68, 75, 71, 71, 72, 73],
  bloodPressure: ["120/80", "130/85", "118/76", "125/82", "122/78", "122/78", "122/78", "118/76"],
  spo2: [98, 97, 99, 96, 98, 87, 89, 80],
};

// Simulation values
let sensorValues;

// Start simulation
function startSimulation() {
  patientIdSim = document.getElementById('patientIdSim').value;
  patientNameSim = document.getElementById('patientNameSim').value;
  patientTokenSim = document.getElementById('patientTokenSim').value;

  if (!patientIdSim || !patientNameSim || !patientTokenSim) {
    alert('Please enter patient ID, patient name, and authorization token');
    return;
  }

  // Clone initial sensor values
  sensorValues = cloneSensorValues(initialSensorValues);

  isSimulationRunning = true;
  simulateSensors();
  intervalId = setInterval(simulateSensors, SIMULATION_INTERVAL);
}

// Stop simulation
function stopSimulation() {
  isSimulationRunning = false;
  clearInterval(intervalId);
}

// Send sensor data
async function sendSensorData() {
  if (!isSimulationRunning) {
    return;
  }

  if (sensorValues.temperature.length === 0) {
    // Reset sensor values
    sensorValues = cloneSensorValues(initialSensorValues);
    displaySensorValues(sensorValues.temperature[0], sensorValues.heartRate[0], sensorValues.bloodPressure[0], sensorValues.spo2[0]);
  }

  let temperature = sensorValues.temperature.shift();
  let heartRate = sensorValues.heartRate.shift();
  let bloodPressure = sensorValues.bloodPressure.shift();
  let spo2 = sensorValues.spo2.shift();

  sensorValues.temperature.push(temperature);
  sensorValues.heartRate.push(heartRate);
  sensorValues.bloodPressure.push(bloodPressure);
  sensorValues.spo2.push(spo2);

  // displaySensorValues(temperature, heartRate, bloodPressure, spo2);
  
  // let datatr = getLatestSensorData();
  // if(!datatr){
  //   const args = [patientIdSim, temperature.toString(), heartRate.toString(), bloodPressure, spo2.toString(), patientNameSim];
  // } else{
  //   const args = [patientIdSim, datatr.temperature.toString(), datatr.heartRate.toString(), bloodPressure, spo2.toString(), patientNameSim];
  // }
  args = [patientIdSim, temperature.toString(), heartRate.toString(), bloodPressure, spo2.toString(), patientNameSim];
  interfaceforgettingData(args);
  // updateTransaction(args);
}

// Simulate sensors
function simulateSensors() {
  sendSensorData();
}

// Display sensor values
function displaySensorValues(temperature, heartRate, bloodPressure, spo2) {
  document.getElementById('temperature-value').innerText = `Temperature: ${temperature} °F`;
  document.getElementById('heartRate-value').innerText = `Heart Rate: ${heartRate} BPM`;
  document.getElementById('bloodPressure-value').innerText = `Blood Pressure: ${bloodPressure}`;
  document.getElementById('spo2-value').innerText = `SPO2: ${spo2}%`;
}

// Display logs
function displayLogs(log) {
  const logsContainer = document.getElementById('logs-container');
  const logElement = document.createElement('div');
  logElement.classList.add('log-row');
  logElement.textContent = log;
  logsContainer.appendChild(logElement);

  logsContainer.scrollTop = logsContainer.scrollHeight;
}

//#############################################################################################################################
//#############################################################################################################################

// Update transaction
async function updateTransaction(args) {
  if (parseFloat(args[1]) > 98 || parseFloat(args[4]) < 90) {

    addPendingApproval(args);

  } else {
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
      const response = await fetch(FABCAR_API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      const logMessage = `Sent: PatientId=${args[0]}, Pname=${args[5]}, Temp=${args[1]}, Heartrate=${args[2]}, BP=${args[3]}, Spo=${args[4]}, TX_ID=${result.result.tx_id}`;
      displayLogs(logMessage);

    } catch (error) {
      console.error(`Error sending data: ${error}`);
    }
  }
}

// Add pending approval
async function addPendingApproval(args) {
  try {
    // Check if the document with the specified _id already exists
    const response = await fetch(`http://localhost:5984/patientsalerts/${args[0]}`);
    
    if (response.ok) {
      // Document exists, update the existing document with additional health parameters
      const existingDocument = await response.json();
      existingDocument.params.push({
        // timestamp: Date.now(),
        temperature: parseFloat(args[1]),
        heart_rate: parseFloat(args[2]),
        blood_pressure: args[3],
        spo2: parseFloat(args[4]),
      });

      // Save the updated document
      await fetch(`http://localhost:5984/patientsalerts/${args[0]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(existingDocument),
      });
    } else {
      // Document does not exist, create a new one
      const newDocument = {
        _id: args[0],
        patient_name: args[5],
        params: [
          {
            // timestamp: Date.now(),
            temperature: parseFloat(args[1]),
            heart_rate: parseFloat(args[2]),
            blood_pressure: args[3],
            spo2: parseFloat(args[4]),
          },
        ],
      };

      // Create a new document
      await fetch('http://localhost:5984/patientsalerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocument),
      });
    }
  } catch (error) {
    console.error('Error in addPendingApproval:', error);
    // Handle the error as needed
  }
}


// Helper function to clone sensor values
function cloneSensorValues(values) {
  return {
    temperature: [...values.temperature],
    heartRate: [...values.heartRate],
    bloodPressure: [...values.bloodPressure],
    spo2: [...values.spo2],
  };
}

async function interfaceforgettingData(args){
  try {
    const datatr = await getLatestSensorData();

    if (datatr) {
      args[1] = datatr.temperature.toString();
      args[2] = datatr.heartRate.toString()
    }
    console.log("#########");
    console.log(datatr);
    console.log("#########");
    displaySensorValues(args[1], args[2], args[3], args[4]);
    updateTransaction(args);
  } catch (error) {
    console.error('Error in someFunction:', error.message);
  }
}

async function getLatestSensorData() {
  try {
      const response = await fetch('http://127.0.0.1:7000/get_latest_sensor_data');
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Latest Sensor Data:', data);
      // let temp = data.temperature;
      // document.getElementById('getd').innerHTML = temp;
      
      return data;
  } catch (error) {
      console.error('Error fetching latest sensor data:', error.message);
  }
}


//########################################################################################################################################
//########################################################################################################################################


// //================================ for old IoT simulator  ====================================================
// let isSimulationRunning = false;
// let intervalId;
// let patientIdSim;
// let patientNameSim;
// let patientTokenSim;

// // Updated arrays for simulation values
// let temperatureValues = [36.5, 37.0, 36.8, 37.2, 36.6];
// let heartRateValues = [70, 72, 68, 75, 71];
// let bloodPressureValues = ["120/80", "130/85", "118/76", "125/82", "122/78"];
// let spo2Values = [98, 97, 99, 96, 98];

// function startSimulation() {
//   patientIdSim = document.getElementById('patientIdSim').value;
//   patientNameSim = document.getElementById('patientNameSim').value;
//   patientTokenSim = document.getElementById('patientTokenSim').value;

//   if (!patientIdSim || !patientNameSim || !patientTokenSim) {
//     alert('Please enter patient ID, patient name, and authorization token');
//     return;
//   }

//   isSimulationRunning = true;
//   simulateSensors();
//   intervalId = setInterval(() => {
//     simulateSensors();
//   }, 5000); // Send values every 5 seconds
// }

// function stopSimulation() {
//   isSimulationRunning = false;
//   clearInterval(intervalId);
// }

// async function sendSensorData() {
//   if (!isSimulationRunning) {
//     return;
//   }

//   // Use pre-defined arrays for sensor values
//   let temperature = temperatureValues.shift();
//   let heartRate = heartRateValues.shift();
//   let bloodPressure = bloodPressureValues.shift();
//   let spo2 = spo2Values.shift();

//   // Store values in arrays
//   temperatureValues.push(temperature);
//   heartRateValues.push(heartRate);
//   bloodPressureValues.push(bloodPressure);
//   spo2Values.push(spo2);

//   displaySensorValues(temperature, heartRate, bloodPressure, spo2);

//   const url = 'http://localhost:4000/channels/mychannel/chaincodes/fabcar';
//   const args = [patientIdSim, temperature.toString(), heartRate.toString(), bloodPressure, spo2.toString(), patientNameSim];

//   const requestBody = {
//     fcn: 'changeCarOwner',
//     peers: ['peer0.org1.example.com', 'peer0.org2.example.com'],
//     chaincodeName: 'fabcar',
//     channelName: 'mychannel',
//     args: args
//   };

//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${patientTokenSim}`
//   };

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(requestBody)
//     });

//     const result = await response.json();

//     // Log the sent data and transaction ID without waiting for the response
//     const logMessage = `Sent: PatientId=${patientIdSim}, Pname=${patientNameSim}, Temp=${temperature}, Heartrate=${heartRate}, BP=${bloodPressure}, Spo=${spo2}, TX_ID=${result.result.tx_id}`;
//     displayLogs(logMessage);

//   } catch (error) {
//     console.error(`Error sending data: ${error}`);
//   }
// }

// function simulateSensors() {
//   sendSensorData();
// }

// function displaySensorValues(temperature, heartRate, bloodPressure, spo2) {
//   document.getElementById('temperature-value').innerText = `Temperature: ${temperature} °C`;
//   document.getElementById('heartRate-value').innerText = `Heart Rate: ${heartRate} BPM`;
//   document.getElementById('bloodPressure-value').innerText = `Blood Pressure: ${bloodPressure}`;
//   document.getElementById('spo2-value').innerText = `SPO2: ${spo2}%`;
// }

// function displayLogs(log) {
//   const logsContainer = document.getElementById('logs-container');
//   const logElement = document.createElement('div');
//   logElement.classList.add('log-row'); // Add a class for styling
//   logElement.textContent = log;
//   logsContainer.appendChild(logElement);

//   // Scroll logs to the bottom on update
//   logsContainer.scrollTop = logsContainer.scrollHeight;
// }

// //========================================================================================================
