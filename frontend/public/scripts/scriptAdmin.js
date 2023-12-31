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
                    <td><button onclick="copyPatientToken('${patientData.patient_token}')">Copy Token</button></td>
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

function copyPatientToken(token) {
    navigator.clipboard.writeText(token)
        .then(() => {
            alert('Token copied to clipboard!');
        })
        .catch((error) => {
            console.error('Error copying token to clipboard:', error);
        });
}












// function showPatients() {
//     var patientsResult = '<h3>View Patients</h3><p>This section will display a list of patients.</p>';
//     document.getElementById('patientsResult').innerHTML = patientsResult;
// }

// function showDoctors() {
//     var doctorsResult = '<h3>View Doctors</h3><p>This section will display a list of doctors.</p>';
//     document.getElementById('doctorsResult').innerHTML = doctorsResult;
// }

// function loadContent(htmlFile) {
//     fetch(htmlFile)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('mainContent').innerHTML = data;
//         })
//         .catch(error => console.error('Error loading content:', error));
// }

// function showRegisterPatient() {
//     loadContent('/registerPatient');
// }

// function showRegisterDoctor() {
//     // Your logic here
// }

// function showInvokeTransaction() {
//     document.getElementById('mainContent').innerHTML = '<h2>Invoke Transaction</h2><p>This section will allow the admin to invoke a transaction.</p>';
// }

// function showQueryTransaction() {
//     // Your logic here
// }

// function showUpdateTransaction() {
//     // Your logic here
// }

// function showAssetHistory() {
//     // Your logic here
// }




function loadContent(htmlFile) {
    fetch(htmlFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('mainContent').innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

function loadSideContent(htmlFile) {
    fetch(htmlFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('sideContent').innerHTML = data;
        })
       
        .catch(error => console.error('Error loading content:', error));
}

function showPatients() {
    // Logic to fetch and display patients
    // var patientsResult = '<h3>View Patients</h3><p>This section will display a list of patients.</p>';
    // document.getElementById('patientsResult').innerHTML = patientsResult;
    loadSideContent('/admin/showPatients');
}

function showDoctors() {
    // Logic to fetch and display doctors
    var doctorsResult = '<h3>View Doctors</h3><p>This section will display a list of doctors.</p>';
    document.getElementById('doctorsResult').innerHTML = doctorsResult;
}

function showRegisterUser() {
    loadContent('/admin/registerUser');
}


function showInvokeTransaction() {
    // document.getElementById('mainContent').innerHTML = '<h2>Invoke Transaction</h2><p>This section will allow the admin to invoke a transaction.</p>';
    loadContent('/admin/invokeTransaction');
}

function showQueryTransaction() {
    loadContent('/admin/queryTransaction');
}

function showUpdateTransaction() {
    loadContent('/admin/updateTransaction');
}

function showAssetHistory() {
    loadContent('/admin/assetHistory');
}

//------------------------------------------------------------------------------------
