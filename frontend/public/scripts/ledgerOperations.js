// scriptToRegisterUser.js

function registerUser() {
    const username = document.getElementById('username').value;
    const roleinp = document.getElementById('role').value;
    const userID = document.getElementById('userID').value;

    // Mock API call
    fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            orgName: 'Org1',
            role: roleinp,
        }),
    })
    .then(response => response.json())
    .then(data => {
        displayToken(data.message, data.token);
        if (roleinp == 'patient') {
            // Save patient data to CouchDB
            savePatientData(userID, username, data.token);
        }
    })
    .catch(error => console.error('Error:', error));
}

function displayToken(message, token) {
    document.getElementById('message').innerText = message;
    document.getElementById('token').innerText = 'Token: ' + token;
    document.getElementById('token-display').style.display = 'block';
}

function copyToken() {
    const tokenElement = document.getElementById('token');
    const tokenValue = tokenElement.innerText.replace('Token: ', ''); // Remove the "Token: " prefix
    const textarea = document.createElement('textarea');
    textarea.value = tokenValue;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Token copied to clipboard!');
}

function savePatientData(patientIdDis, patientNameDis, patientTokenDis) {
    const data = {
        _id: patientIdDis,
        patient_name: patientNameDis,
        patient_token: patientTokenDis,
    };
  
    // Make a request to store patient data in CouchDB
    fetch('http://localhost:5984/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(savedData => {
            console.log('Patient data stored successfully:', savedData);
        })
        .catch(error => {
            console.error('Error storing patient data:', error);
        });
}

//=============================================================================================================================================




async function createTransaction() {
    const patientId = document.getElementById('patient-id').value;
    const temperature = document.getElementById('temperature').value;
    const heartRate = document.getElementById('heart-rate').value;
    const bloodPressure = document.getElementById('blood-pressure').value;
    const spo2 = document.getElementById('spo2').value;
    const patientName = document.getElementById('patient-name').value;
    const authToken = document.getElementById('authorization-token').value;

    const data = {
        fcn: 'createCar', // Replace with the correct chaincode function for patient
        peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
        chaincodeName: 'fabcar',
        channelName: 'mychannel',
        args: [patientId, temperature, heartRate, bloodPressure, spo2, patientName]
    };

    try {
        const response = await fetch('http://localhost:4000/channels/mychannel/chaincodes/fabcar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.result && result.result.tx_id) {
            document.getElementById('tx-id').innerText = 'Transaction ID: ' + result.result.tx_id;
            document.getElementById('error').innerText = 'Error: ' + (result.error ? result.error : 'None');
            document.getElementById('error-data').innerText = 'Error Data: ' + (result.errorData ? result.errorData : 'None');
            document.getElementById('result-display').style.display = 'block';
        } else {
            console.error('Error during patient transaction:', result.errorData);
            document.getElementById('result-display').innerHTML = '<p>Error during patient transaction</p>';
        }
    } catch (error) {
        console.error('Error during patient transaction:', error);
        document.getElementById('result-display').innerHTML = '<p>Error during patient transaction</p>';
    }
}

function copyTxId() {
    const txIdElement = document.getElementById('tx-id');
    const txIdValue = txIdElement.innerText.replace('Transaction ID: ', ''); // Remove the "Transaction ID: " prefix
    const textarea = document.createElement('textarea');
    textarea.value = txIdValue;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Transaction ID copied to clipboard!');
}

//=============================================================================================================================================

async function queryTransaction() {
    const patientId = document.getElementById('patient-id').value;
    const authToken = document.getElementById('authorization-token').value;

    const apiUrl = `http://localhost:4000/channels/mychannel/chaincodes/fabcar?args=["${patientId}"]&peer=peer0.org1.example.com&fcn=queryCar`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
        });

        const result = await response.json();

        if (result) {
            document.getElementById('patient-name').innerText = `Patient Name: ${result.patient}`;
            document.getElementById('temperature').innerText = `Temperature: ${result.temperature}`;
            document.getElementById('heart-rate').innerText = `Heart Rate: ${result.heartrate}`;
            document.getElementById('blood-pressure').innerText = `Blood Pressure: ${result.bp}`;
            document.getElementById('spo2').innerText = `SPO2: ${result.spo2}`;
            document.getElementById('query-result').style.display = 'block';
        } else {
            console.error('Error during query transaction:', result.errorData);
            document.getElementById('query-result').innerHTML = '<p>Error during query transaction</p>';
        }
    } catch (error) {
        console.error('Error during query transaction:', error);
        document.getElementById('query-result').innerHTML = '<p>Error during query transaction</p>';
    }
}

//=============================================================================================================================================

// scriptUpdateTransaction.js

async function updateTransaction() {
    const patientId = document.getElementById('patient-id').value;
    const temperature = document.getElementById('temperature').value;
    const heartRate = document.getElementById('heart-rate').value;
    const bloodPressure = document.getElementById('blood-pressure').value;
    const spo2 = document.getElementById('spo2').value;
    const patientName = document.getElementById('patient-name').value;
    const authToken = document.getElementById('authorization-token').value;

    const data = {
        fcn: 'changeCarOwner',
        peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
        chaincodeName: 'fabcar',
        channelName: 'mychannel',
        args: [patientId, temperature, heartRate, bloodPressure, spo2, patientName]
    };

    try {
        const response = await fetch('http://localhost:4000/channels/mychannel/chaincodes/fabcar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.result && result.result.tx_id) {
            document.getElementById('tx-id').innerText = `Transaction ID: ${result.result.tx_id}`;
            document.getElementById('error').innerText = `Error: ${result.error ? result.error : 'None'}`;
            document.getElementById('error-data').innerText = `Error Data: ${result.errorData ? result.errorData : 'None'}`;
            document.getElementById('update-result').style.display = 'block';
        } else {
            console.error('Error during update transaction:', result.errorData);
            document.getElementById('update-result').innerHTML = '<p>Error during update transaction</p>';
        }
    } catch (error) {
        console.error('Error during update transaction:', error);
        document.getElementById('update-result').innerHTML = '<p>Error during update transaction</p>';
    }
}

// function copyTxId() {
//     const txIdElement = document.getElementById('tx-id');
//     const txIdValue = txIdElement.innerText.replace('Transaction ID: ', ''); // Remove the "Transaction ID: " prefix
//     const textarea = document.createElement('textarea');
//     textarea.value = txIdValue;
//     document.body.appendChild(textarea);
//     textarea.select();
//     document.execCommand('copy');
//     document.body.removeChild(textarea);
//     alert('Transaction ID copied to clipboard!');
// }



//=============================================================================================================================================

// scriptAssetHistory.js

async function getAssetHistory() {
    const patientId = document.getElementById('patient-id').value;
    const authToken = document.getElementById('authorization-token').value;

    const apiUrl = `http://localhost:4000/channels/mychannel/chaincodes/fabcar?args=["${patientId}"]&peer=peer0.org1.example.com&fcn=getHistoryForAsset`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
        });

        const historyData = await response.json();

        if (historyData && historyData.length > 0) {
            const tableBody = document.getElementById('history-table-body');
            tableBody.innerHTML = '';

            historyData.forEach(entry => {
                const row = tableBody.insertRow();
                const patientNameCell = row.insertCell(0);
                const timestampCell = row.insertCell(1);
                const temperatureCell = row.insertCell(2);
                const heartRateCell = row.insertCell(3);
                const bloodPressureCell = row.insertCell(4);
                const spo2Cell = row.insertCell(5);
                const txIdCell = row.insertCell(6);

                patientNameCell.innerText = entry.Value.patient;
                timestampCell.innerText = entry.Timestamp;
                temperatureCell.innerText = entry.Value.temperature;
                heartRateCell.innerText = entry.Value.heartrate;
                bloodPressureCell.innerText = entry.Value.bp;
                spo2Cell.innerText = entry.Value.spo2;
                txIdCell.innerText = entry.TxId;
            });

            document.getElementById('history-table').style.display = 'table';
        } else {
            console.error('No history data available.');
            document.getElementById('history-table').style.display = 'none';
        }
    } catch (error) {
        console.error('Error during asset history retrieval:', error);
        document.getElementById('history-table').style.display = 'none';
    }
}


//=============================================================================================================================================