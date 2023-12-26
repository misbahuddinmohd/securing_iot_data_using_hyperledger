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
