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
function showPatients() {
    // Logic to fetch and display patients
    var patientsResult = '<h3>View Patients</h3><p>This section will display a list of patients.</p>';
    document.getElementById('patientsResult').innerHTML = patientsResult;
}

function showDoctors() {
    // Logic to fetch and display doctors
    var doctorsResult = '<h3>View Doctors</h3><p>This section will display a list of doctors.</p>';
    document.getElementById('doctorsResult').innerHTML = doctorsResult;
}

function loadContent(htmlFile) {
    fetch(htmlFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('mainContent').innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

function showRegisterPatient() {
    loadContent('/admin/registerPatient');
}

function showRegisterDoctor() {
    loadContent('/admin/registerDoctor');
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
