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
let doctorGlobalData;
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

function showPatientReport() {
    loadContent('/org2/showPatientReport');
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
            doctorGlobalData = doctorData;
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
    const doctorId = document.getElementById('doctorID').value;
    const patientId = document.getElementById('patient-id').value;
    // const authToken = document.getElementById('authorization-token').value;
    const authToken = doctorGlobalData.doctor_token;
    
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
    const doctorId = document.getElementById('doctorLocalId').value;
    // const doctoraId = document.getElementById('doctoraId').value;
    // const docbAuthToken = doctorGlobalData.doctor_token;
    const docbAuthToken = document.getElementById('docbLocalAuthToken').value;

    const isVerified = "false";
    const data = {
        _id: doctorId,
        doctora_id: "DOCTOR1",
        patient_id: patientId,
        docb_auth_token: docbAuthToken,
        remark: "not authenticated",
        is_verified: "false",
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


// function saveAccessRequest() {
//     const patientId = document.getElementById('patientId').value;
//     const doctorId = document.getElementById('doctorID').value;
//     const doctoraId = document.getElementById('doctoraId').value;
//     // const docbAuthToken = document.getElementById('docbAuthToken').value;
//     const docbAuthToken = doctorGlobalData.doctor_token;

//     const prime = document.getElementById('prime').value;
//     const generator = document.getElementById('generator').value;
//     const remark = document.getElementById('remark').value;
//     const isVerified = "false";
//     const data = {
//         _id: doctorId,
//         doctora_id: doctoraId,
//         patient_id: patientId,
//         docb_auth_token: docbAuthToken,
//         prime_val: prime,
//         generator_val: generator,
//         remark: remark,
//         is_verified: isVerified,
//     };
  
//     // Make a request to store doctor data in CouchDB
//     fetch('http://localhost:5984/dataaccessrequests', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//         .then(response => response.json())
//         .then(savedData => {
//             document.getElementById('msg').innerText = 'Request sent';
//             console.log('Doctor Access Request stored successfully:', savedData);
//         })
//         .catch(error => {
//             document.getElementById('msg').innerText = 'Error sending request';
//             console.error('Error storing doctor Access Request:', error);
//         });
// }


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
                if (requestsData._id == document.getElementById('doctorID').value) {
                    const rowElement = document.createElement('tr');
                    rowElement.innerHTML = `
                        <td>${requestsData._id}</td>
                        <td>${requestsData.patient_id}</td>
                        <td>${requestsData.remark}</td>
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
// async function getRequests() {
//     const couchdbUrl = 'http://localhost:5984';
//     const databaseName = 'dataaccessrequests';
//     const retrieveAllUrl = `${couchdbUrl}/${databaseName}/_all_docs`;

//     try {
//         const response = await fetch(retrieveAllUrl);
//         const result = await response.json();

//         if (response.ok) {
//             const requestsTableBody = document.getElementById('requestsTableBody');
//             requestsTableBody.innerHTML = '';

//             result.rows.forEach(async (row) => {
//                 const doctorId = row.id;
//                 const requestsData = await retrieveDocbData(doctorId);
                
//                 // Check if is_verified is "false" before creating the row element
//                 if (requestsData.is_verified == "false" && requestsData._id == document.getElementById('doctorID').value) {
//                     const rowElement = document.createElement('tr');
//                     rowElement.innerHTML = `
//                         <td>${requestsData._id}</td>
//                         <td>${requestsData.patient_id}</td>
//                         <td>${requestsData.doctora_id}</td>
//                         <td>${requestsData.prime_val}</td>
//                         <td>${requestsData.generator_val}</td>
//                         <td>${requestsData.remark}</td>
//                     `;
                    
//                     requestsTableBody.appendChild(rowElement);
//                 }
//             });
//         } else {
//             console.error(`Error retrieving all patients: ${result}`);
//         }
//     } catch (error) {
//         console.error(`Error retrieving all patients: ${error.message}`);
//     }
// }

// async function retrieveDocbData(doctorId) {
//     const couchdbUrl = 'http://localhost:5984';
//     const databaseName = 'dataaccessrequests';
//     const retrieveUrl = `${couchdbUrl}/${databaseName}/${doctorId}`;

//     try {
//         const response = await fetch(retrieveUrl);
//         const result = await response.json();

//         if (response.ok) {
//             return result;
//         } else {
//             console.error(`Error retrieving data for ID ${doctorId}: ${result}`);
//             return {};
//         }
//     } catch (error) {
//         console.error(`Error retrieving data for ID ${doctorId}: ${error.message}`);
//         return {};
//     }
// }

//#########################################################################################################################################
//#########################################################################################################################################

async function getPatientReport() {
    const patientId = document.getElementById('patient-id').value;
    const doctorId = document.getElementById('doctorID').value;
    // const authToken = document.getElementById('authorization-token').value;
    const authToken = doctorGlobalData.doctor_token;
    

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
        console.log("The Asset History is:", JSON.stringify(historyData, null, 2));

        // Store historyData in localStorage
        localStorage.setItem('patientReportData', JSON.stringify(historyData));

        // URL of the webpage you want to open
        const reportUrl = "http://localhost:5000/org2/patientReport";
        // Open the URL in a new tab
        window.open(reportUrl, "_blank");


        // Update dashboard with fetched data
        // updateReport(historyData);
    } catch (error) {
        console.error('Error during asset history retrieval:', error);
        // Handle error, maybe show a message to the user
    }

    } else {
        document.getElementById('history-table').style.display = 'none';
    } 
}

//#########################################################################################################################################
//#########################################################################################################################################

