// function showPatients() {
//     // Logic to fetch and display patients
//     // var patientsResult = '<h3>View Patients</h3><p>This section will display a list of patients.</p>';
//     // document.getElementById('patientsResult').innerHTML = patientsResult;
//     loadSideContent('/doctor/showPatients');
// }

// function showPatientsAlerts() {
//     // Logic to fetch and display patients
//     // var patientsResult = '<h3>View Patients</h3><p>This section will display a list of patients.</p>';
//     // document.getElementById('patientsResult').innerHTML = patientsResult;
//     loadSideContent2('/doctor/showPatientsAlerts');
// }

// function showQueryTransaction() {
//     loadContent('/doctor/queryTransaction');
// }

function showAssetHistory() {
    loadContent('/org2/assetHistory');
}

function requestDataAccess() {
    loadContent('/org2/requestDataAccess');
}

function showRegisterUser() {
    loadContent('/org2/registerUser');
}

function requestStatus() {
    loadContent('/org2/requestStatus');
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

function registerUser() {
    const username = document.getElementById('username').value;
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
            role: 'doctor',
        }),
    })
    .then(response => response.json())
    .then(data => {
        displayToken(data.message, data.token);
        saveDoctorData(userID, username, data.token);
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


function saveDoctorData(doctorIdDis, doctorNameDis, doctorTokenDis) {
    const data = {
        _id: doctorIdDis,
        doctor_name: doctorNameDis,
        doctor_token: doctorTokenDis,
    };
  
    // Make a request to store doctor data in CouchDB
    fetch('http://localhost:5984/doctorsb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(savedData => {
            console.log('Doctor data stored successfully:', savedData);
        })
        .catch(error => {
            console.error('Error storing doctor data:', error);
        });
}


//#########################################################################################################################################

let authToken;

function getDoctorDetails() {
    // Display doctor details in doctor.html
    const doctorID = document.getElementById('doctorID').value;
    retrieveDoctorData(doctorID);
}

function retrieveDoctorData(doctorId) {
    // Make a request to retrieve doctor data from CouchDB
    fetch(`http://localhost:5984/doctorsb/${doctorId}`, {
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

//#########################################################################################################################################


async function getAssetHistory() {
    const doctorId = document.getElementById('doctor-id').value;
    const patientId = document.getElementById('patient-id').value;
    const authToken = document.getElementById('authorization-token').value;

    const isVerified = await getRequestStatus(patientId, doctorId);

    if (isVerified) {
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

    } else {
        document.getElementById('history-table').style.display = 'none';
    }

}

async function getRequestStatus(patientId, doctorId) {
    try {
        const response = await fetch(`http://localhost:5984/dataaccessrequests/${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const requestData = await response.json();
        console.log('Patient data retrieved successfully:', requestData);
        if(requestData.is_verified == "true" && patientId == requestData.patient_id){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.error('Error retrieving patient data:', error);
        return false;
    }
}


//#########################################################################################################################################

//########################################################################################################################################

function saveAccessRequest() {
    const patientId = document.getElementById('patientId').value;
    const doctorId = document.getElementById('doctorId').value;
    const docbAuthToken = document.getElementById('docbAuthToken').value;
    const prime = document.getElementById('prime').value;
    const generator = document.getElementById('generator').value;
    const remark = document.getElementById('remark').value;
    const isVerified = "false";
    const data = {
        _id: doctorId,
        patient_id: patientId,
        docb_auth_token: docbAuthToken,
        prime_val: prime,
        generator_val: generator,
        remark: remark,
        is_verified: isVerified,
    };
  
    // Make a request to store doctor data in CouchDB
    fetch('http://localhost:5984/dataaccessrequests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(savedData => {
            document.getElementById('msg').innerText = 'Request sent';
            console.log('Doctor Access Request stored successfully:', savedData);
        })
        .catch(error => {
            document.getElementById('msg').innerText = 'Error sending request';
            console.error('Error storing doctor Access Request:', error);
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
                    const rowElement = document.createElement('tr');
                    rowElement.innerHTML = `
                        <td>${requestsData._id}</td>
                        <td>${requestsData.patient_id}</td>
                        <td>${requestsData.prime_val}</td>
                        <td>${requestsData.generator_val}</td>
                        <td>${requestsData.remark}</td>
                    `;
                    
                    requestsTableBody.appendChild(rowElement);
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

// function startVerification(prime, generator, docbId, docbToken){
//     const port = 7777; 
//     const url = `http://localhost:${port}/fs_agreed_params?prime=${prime}&generator=${generator}&docbToken=${docbToken}`; // Construct the URL with the specified port
//     fetch(url)
//         .then(response => response.text())
//         .then(data => {
//             console.log(data); // Output: "Hello from Python!"
//             if(data.toString() == "1"){
//                 alert("Authentication Successful");
//                 updateStatus(docbId);
//             } else {
//                 alert("Authentication Not Successful");
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
    
//     //set isVerified to true;
// }

// function discardRequest(docbId){
//     const couchdbUrl = 'http://localhost:5984';
//     const databaseName = 'dataaccessrequests';
//     const updateUrl = `${couchdbUrl}/${databaseName}/${docbId}`;

//     // First, fetch the current document to get the _rev value
//     fetch(updateUrl)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Error fetching document for ID ${docbId}: ${response.statusText}`);
//         }
//         return response.json();
//     })
//     .then(doc => {
//         // Include the _rev value from the fetched document in the update request
//         return fetch(updateUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 _id: docbId,
//                 _rev: doc._rev, // Include the _rev value here
//                 patient_id: doc.patient_id,
//                 docb_auth_token: doc.docb_auth_token,
//                 prime_val: doc.prime_val,
//                 generator_val: doc.generator_val,
//                 remark: "Not agreed on variables",
//                 is_verified: "false"
//                 // Include other fields of the document if needed
//             })
//         });
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Error updating is_verified status for ID ${docbId}: ${response.statusText}`);
//         }
//     })
//     .catch(error => {
//         console.error(`Error updating is_verified status for ID ${docbId}: ${error}`);
//     });
// }


// function updateStatus(docbId) {
//     const couchdbUrl = 'http://localhost:5984';
//     const databaseName = 'dataaccessrequests';
//     const updateUrl = `${couchdbUrl}/${databaseName}/${docbId}`;

//     // First, fetch the current document to get the _rev value
//     fetch(updateUrl)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Error fetching document for ID ${docbId}: ${response.statusText}`);
//         }
//         return response.json();
//     })
//     .then(doc => {
//         // Include the _rev value from the fetched document in the update request
//         return fetch(updateUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 _id: docbId,
//                 _rev: doc._rev, // Include the _rev value here
//                 patient_id: doc.patient_id,
//                 docb_auth_token: doc.docb_auth_token,
//                 prime_val: doc.prime_val,
//                 generator_val: doc.generator_val,
//                 remark: doc.remark,
//                 is_verified: "false"
//                 // Include other fields of the document if needed
//             })
//         });
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Error updating is_verified status for ID ${docbId}: ${response.statusText}`);
//         }
//     })
//     .catch(error => {
//         console.error(`Error updating is_verified status for ID ${docbId}: ${error}`);
//     });
// }


//#########################################################################################################################################

//#########################################################################################################################################
