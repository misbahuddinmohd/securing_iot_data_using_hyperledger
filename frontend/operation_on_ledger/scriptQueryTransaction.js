// scriptQueryTransaction.js

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
