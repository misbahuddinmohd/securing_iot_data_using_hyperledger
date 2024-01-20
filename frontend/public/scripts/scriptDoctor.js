function showPatients() {
    // Logic to fetch and display patients
    // var patientsResult = '<h3>View Patients</h3><p>This section will display a list of patients.</p>';
    // document.getElementById('patientsResult').innerHTML = patientsResult;
    loadSideContent('/doctor/showPatients');
}

function showPatientsAlerts() {
    // Logic to fetch and display patients
    // var patientsResult = '<h3>View Patients</h3><p>This section will display a list of patients.</p>';
    // document.getElementById('patientsResult').innerHTML = patientsResult;
    loadSideContent2('/doctor/showPatientsAlerts');
}

function showQueryTransaction() {
    loadContent('/doctor/queryTransaction');
}

function showAssetHistory() {
    loadContent('/doctor/assetHistory');
}



function loadSideContent(htmlFile) {
    fetch(htmlFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('sideContent').innerHTML = data;
        })

        .catch(error => console.error('Error loading content:', error));
}

function loadSideContent2(htmlFile) {
    fetch(htmlFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('sideContent2').innerHTML = data;
        })

        .catch(error => console.error('Error loading content:', error));
}

function loadContent(htmlFile) {
    fetch(htmlFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('mainContent').innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}



function copyPDToken(token) {
    navigator.clipboard.writeText(token)
        .then(() => {
            alert('Token copied to clipboard!');
        })
        .catch((error) => {
            console.error('Error copying token to clipboard:', error);
        });
}

//#########################################################################################################################################

//########################################################################################################################################
let authToken;

function getDoctorDetails() {
    // Display doctor details in doctor.html
    const doctorID = document.getElementById('doctorID').value;
    retrieveDoctorData(doctorID);
}

function retrieveDoctorData(doctorId) {
    // Make a request to retrieve doctor data from CouchDB
    fetch(`http://localhost:5984/doctors/${doctorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(doctorData => {
            console.log('doctor data retrieved successfully:', doctorData);
            // Display doctor details and make auth token global
            authToken = doctorData.doctor_token;
            displayDoctorDetails(doctorData);
        })
        .catch(error => {
            console.error('Error retrieving doctor data:', error);
        });
}


function displayDoctorDetails(doctorData) {
    // Display doctor details in doctor.html
    document.getElementById('doctorIdDisplay').innerText = `doctor ID: ${doctorData._id}`;
    document.getElementById('doctorNameDisplay').innerText = `Name: ${doctorData.doctor_name}`;
    document.getElementById('doctorTokenDisplay').innerText = `Authorization Token: ${doctorData.doctor_token}`;
}

//#########################################################################################################################################

//########################################################################################################################################

async function retrieveAllPatients() {
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'patients';
    const retrieveAllUrl = `${couchdbUrl}/${databaseName}/_all_docs`;

    try {
        const response = await fetch(retrieveAllUrl);
        const result = await response.json();

        if (response.ok) {
            const patientTableBody = document.getElementById('patientTableBody');
            patientTableBody.innerHTML = '';

            result.rows.forEach(async (row) => {
                const patientId = row.id;
                const patientData = await retrievePatientData(patientId);

                const rowElement = document.createElement('tr');
                rowElement.innerHTML = `
                    <td>${patientData._id}</td>
                    <td>${patientData.patient_name}</td>
                    <td>${patientData.patient_token.slice(0, 5)}...${patientData.patient_token.slice(-5)}</td>
                    <td><button onclick="copyPDToken('${patientData.patient_token}')">Copy Token</button></td>
                `;

                patientTableBody.appendChild(rowElement);
            });
        } else {
            console.error(`Error retrieving all patients: ${result}`);
        }
    } catch (error) {
        console.error(`Error retrieving all patients: ${error.message}`);
    }
}

async function retrievePatientData(patientId) {
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'patients';
    const retrieveUrl = `${couchdbUrl}/${databaseName}/${patientId}`;

    try {
        const response = await fetch(retrieveUrl);
        const result = await response.json();

        if (response.ok) {
            return result;
        } else {
            console.error(`Error retrieving patient data for ID ${patientId}: ${result}`);
            return {};
        }
    } catch (error) {
        console.error(`Error retrieving patient data for ID ${patientId}: ${error.message}`);
        return {};
    }
}

//#########################################################################################################################################

//#########################################################################################################################################


async function retrieveAllPatientsAlerts() {
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'patientsalerts';
    const retrieveAllUrl = `${couchdbUrl}/${databaseName}/_all_docs`;

    try {
        const response = await fetch(retrieveAllUrl);
        const result = await response.json();

        if (response.ok) {
            const patientTableBody = document.getElementById('pending-approvals');
            patientTableBody.innerHTML = '';

            result.rows.forEach(async (row) => {
                const patientId = row.id;
                const patientData = await retrievePatientAlertData(patientId);
                console.log(patientData);

                let params = patientData.params;
                params = params[params.length-1];
                console.log(params);

                const rowElement = document.createElement('tr');
                rowElement.innerHTML = `
                    <td>${patientData._id}</td>
                    <td>${patientData.patient_name}</td>
                    <td>Temperature<br>Heartrate<br>BP<br>SPO2</td>
                    <td>
                    ${patientData.params.map(param => `
                      <p>${param.temperature}<br>
                      ${param.heart_rate}<br>
                      ${param.blood_pressure}<br>
                      ${param.spo2}</p>
                      <hr>
                    `).join('')}
                  </td>
                  <td><button onclick="approveUpdateTransaction('${patientData._id}', '${patientData.patient_name}', '${params.temperature}', '${params.heart_rate}', '${params.blood_pressure}', '${params.spo2}')">Approve</button></td>
                `;

                patientTableBody.appendChild(rowElement);
            });
        } else {
            console.error(`Error retrieving all patients: ${result}`);
        }
    } catch (error) {
        console.error(`Error retrieving all patients: ${error.message}`);
    }
}

async function retrievePatientAlertData(patientId) {
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'patientsalerts';
    const retrieveUrl = `${couchdbUrl}/${databaseName}/${patientId}`;

    try {
        const response = await fetch(retrieveUrl);
        const result = await response.json();

        if (response.ok) {
            return result;
        } else {
            console.error(`Error retrieving patient alert data for ID ${patientId}: ${result}`);
            return {};
        }
    } catch (error) {
        console.error(`Error retrieving patient alert data for ID ${patientId}: ${error.message}`);
        return {};
    }
}

async function approveUpdateTransaction(patientId, patientName, temperature, heartRate, bloodPressure, spo2) {

    console.log(patientId);
    console.log(patientName);
    console.log(temperature, heartRate, bloodPressure, spo2);
    console.log(authToken);

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
            alert('Transaction has been approved by the doctor');
        } else {
            console.error('Error during update transaction:', result.errorData);
        }
    } catch (error) {
        console.error('Error during update transaction:', error);
    }

    
}
//#########################################################################################################################################

//#########################################################################################################################################





//#########################################################################################################################################

//################################### temp data ###########################################################################################

// // Function to update ledger after doctor approval
// async function attendTransaction(patientId, parameter, value) {
//     // Add logic to update the ledger with doctor's approval
//     // Call your updateTransaction function with the required data
// }

// // Sample function to add pending approvals to the doctor's page
// function addPendingApproval(patientId, patientName, parameter, value) {
//     const tableBody = document.getElementById('pending-approvals').getElementsByTagName('tbody')[0];
//     const newRow = tableBody.insertRow();
//     newRow.innerHTML = `
//         <td>${patientId}</td>
//         <td>${patientName}</td>
//         <td>${parameter}</td>
//         <td>${value}</td>
//         <td><button onclick="attendTransaction('${patientId}', '${parameter}', '${value}')">Attend</button></td>
//     `;
// }

// // Sample usage: Call this function when a patient's health parameter exceeds the threshold
// addPendingApproval('123', 'John Doe', 'Temperature', '99');
