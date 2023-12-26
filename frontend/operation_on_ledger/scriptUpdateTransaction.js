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
