// scriptPatient.js

// function submitFormPatient() {
//   const patientIdDis = document.getElementById('patientIdForm').value;
//   const patientNameDis = document.getElementById('patientNameForm').value;
//   const patientTokenDis = document.getElementById('patientTokenForm').value;

//   // Save patient data to CouchDB
//   savePatientData(patientIdDis, patientNameDis, patientTokenDis);

//   // Open patient.html in a new tab
//   window.open('http://localhost:5000/patient', '_blank');
// }

// function savePatientData(patientIdDis, patientNameDis, patientTokenDis) {
//   const data = {
//       _id: patientIdDis,
//       patient_name: patientNameDis,
//       patient_token: patientTokenDis,
//   };

//   // Make a request to store patient data in CouchDB
//   fetch('http://localhost:5984/patients', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//   })
//       .then(response => response.json())
//       .then(savedData => {
//           console.log('Patient data stored successfully:', savedData);
//       })
//       .catch(error => {
//           console.error('Error storing patient data:', error);
//       });
// }

function getPatientDetails() {
  // Display patient details in patient.html
  const patientID = document.getElementById('patientID').value;
  retrievePatientData(patientID);
}

function retrievePatientData(patientId) {
  // Make a request to retrieve patient data from CouchDB
  fetch(`http://localhost:5984/patients/${patientId}`, {
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
      .then(patientData => {
          console.log('Patient data retrieved successfully:', patientData);
          // Display patient details
          displayPatientDetails(patientData);
      })
      .catch(error => {
          console.error('Error retrieving patient data:', error);
      });
}


function displayPatientDetails(patientData) {
  // Display patient details in patient.html
  document.getElementById('patientIdDisplay').innerText = `Patient ID: ${patientData._id}`;
  document.getElementById('patientNameDisplay').innerText = `Name: ${patientData.patient_name}`;
  document.getElementById('patientTokenDisplay').innerText = `Authorization Token: ${patientData.patient_token}`;
}


function loadContent(htmlFile) {
  fetch(htmlFile)
    .then(response => response.text())
    .then(data => {
      document.getElementById('mainContent').innerHTML = data;
    })
    .catch(error => console.error('Error loading content:', error));
}

function showInvokeTransaction() {
  // document.getElementById('mainContent').innerHTML = '<h2>Invoke Transaction</h2><p>This section will allow the admin to invoke a transaction.</p>';
  loadContent('/patient/invokeTransaction');
}

function showQueryTransaction() {
  loadContent('/patient/queryTransaction');
}

function showUpdateTransaction() {
  loadContent('/patient/updateTransaction');
}

function showAssetHistory() {
  loadContent('/patient/assetHistory');
}
