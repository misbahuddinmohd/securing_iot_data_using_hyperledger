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

function verifyAccessRequests() {
    loadContent('/doctor/verifyAccessRequests');
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
            deletePendingApproval(patientId);
        } else {
            console.error('Error during update transaction:', result.errorData);
        }
    } catch (error) {
        console.error('Error during update transaction:', error);
    }

    
    
}

function deletePendingApproval(docId) {
    // const docId = alertData.pId;

    // Retrieve the current revision of the document
    fetch(`http://localhost:5984/patientsalerts/${docId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(doc => {
            if (doc._rev) {
                // If _rev is available, proceed with the deletion
                const docRev = doc._rev;

                // Make a request to delete the document from CouchDB
                return fetch(`http://localhost:5984/patientsalerts/${docId}?rev=${docRev}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                throw new Error('Unable to retrieve _rev for deletion.');
            }
        })
        .then(response => response.json())
        .then(deletedData => {
            console.log('Patient alert data deleted successfully:', deletedData);
        })
        .catch(error => {
            console.error('Error deleting patient alert data:', error);
        });
}

//#########################################################################################################################################

//#########################################################################################################################################


async function getRequests() {
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'dataaccessrequests';
    const retrieveAllUrl = `${couchdbUrl}/${databaseName}/_all_docs`;

    try {
        const response = await fetch(retrieveAllUrl);
        const result = await response.json();

        if (response.ok) {
            const requestsTableBody = document.getElementById('requestsTableBody');
            requestsTableBody.innerHTML = '';

            result.rows.forEach(async (row) => {
                const doctorId = row.id;
                const requestsData = await retrieveDocbData(doctorId);
                
                // Check if is_verified is "false" before creating the row element
                if (requestsData.is_verified == "false") {
                    const rowElement = document.createElement('tr');
                    rowElement.innerHTML = `
                        <td>${requestsData._id}</td>
                        <td>${requestsData.patient_id}</td>
                        <td>${requestsData.prime_val}</td>
                        <td>${requestsData.generator_val}</td>
                        <td>${requestsData.remark}</td>
                        <td><button onclick="discardRequest('${requestsData._id}')">Discard</button></td>
                        <td><button onclick="startVerification('${requestsData.prime_val}', '${requestsData.generator_val}', '${requestsData._id}', '${requestsData.docb_auth_token}')">Start Auth</button></td>
                    `;
                    
                    requestsTableBody.appendChild(rowElement);
                }
            });
        } else {
            console.error(`Error retrieving all patients: ${result}`);
        }
    } catch (error) {
        console.error(`Error retrieving all patients: ${error.message}`);
    }
}

async function retrieveDocbData(doctorId) {
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'dataaccessrequests';
    const retrieveUrl = `${couchdbUrl}/${databaseName}/${doctorId}`;

    try {
        const response = await fetch(retrieveUrl);
        const result = await response.json();

        if (response.ok) {
            return result;
        } else {
            console.error(`Error retrieving data for ID ${doctorId}: ${result}`);
            return {};
        }
    } catch (error) {
        console.error(`Error retrieving data for ID ${doctorId}: ${error.message}`);
        return {};
    }
}

function startVerification(prime, generator, docbId, docbToken){
    const port = 7777; 
    const url = `http://localhost:${port}/fs_agreed_params?prime=${prime}&generator=${generator}&docbToken=${docbToken}`; // Construct the URL with the specified port
    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log(data); // Output: "Hello from Python!"
            if(data.toString() == "1"){
                alert("Authentication Successful");
                updateStatus(docbId);
            } else {
                alert("Authentication Not Successful");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    //set isVerified to true;
}

function discardRequest(docbId){
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'dataaccessrequests';
    const updateUrl = `${couchdbUrl}/${databaseName}/${docbId}`;

    // First, fetch the current document to get the _rev value
    fetch(updateUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching document for ID ${docbId}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(doc => {
        // Include the _rev value from the fetched document in the update request
        return fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: docbId,
                _rev: doc._rev, // Include the _rev value here
                patient_id: doc.patient_id,
                docb_auth_token: doc.docb_auth_token,
                prime_val: doc.prime_val,
                generator_val: doc.generator_val,
                remark: "Not agreed on variables",
                is_verified: "false"
                // Include other fields of the document if needed
            })
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error updating is_verified status for ID ${docbId}: ${response.statusText}`);
        }
    })
    .catch(error => {
        console.error(`Error updating is_verified status for ID ${docbId}: ${error}`);
    });
}


function updateStatus(docbId) {
    const couchdbUrl = 'http://localhost:5984';
    const databaseName = 'dataaccessrequests';
    const updateUrl = `${couchdbUrl}/${databaseName}/${docbId}`;

    // First, fetch the current document to get the _rev value
    fetch(updateUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching document for ID ${docbId}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(doc => {
        // Include the _rev value from the fetched document in the update request
        return fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: docbId,
                _rev: doc._rev, // Include the _rev value here
                patient_id: doc.patient_id,
                docb_auth_token: doc.docb_auth_token,
                prime_val: doc.prime_val,
                generator_val: doc.generator_val,
                remark: doc.remark,
                is_verified: "false"
                // Include other fields of the document if needed
            })
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error updating is_verified status for ID ${docbId}: ${response.statusText}`);
        }
    })
    .catch(error => {
        console.error(`Error updating is_verified status for ID ${docbId}: ${error}`);
    });
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
