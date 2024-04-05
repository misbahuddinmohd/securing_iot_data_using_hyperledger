// Sample patient data
const patientData = [
  {
    "Value": {
      "temperature": "37.2",
      "heartrate": "75",
      "bp": "125/82",
      "spo2": "96",
      "patient": "pat1"
    },
    "Timestamp": "2024-04-04 18:48:16.139 +0000 UTC"
  },
  {
    "Value": {
      "temperature": "36.8",
      "heartrate": "68",
      "bp": "118/76",
      "spo2": "99",
      "patient": "pat1"
    },
    "Timestamp": "2024-04-04 18:48:05.67 +0000 UTC",
  },
  {
    "Value": {
      "temperature": "37",
      "heartrate": "72",
      "bp": "130/85",
      "spo2": "97",
      "patient": "pat1"
    },
    "Timestamp": "2024-04-04 18:47:55.684 +0000 UTC",
  },
  {
    "Value": {
      "temperature": "36.5",
      "heartrate": "70",
      "bp": "120/80",
      "spo2": "98",
      "patient": "pat1"
    },
    "Timestamp": "2024-04-04 18:47:45.75 +0000 UTC",
  },
  {
    "Value": {
      "temperature": "98",
      "heartrate": "175",
      "bp": "185/85",
      "spo2": "98",
      "patient": "test2"
    },
    "Timestamp": "2024-04-04 14:09:08.201757863 +0000 UTC",
  }
];

// Function to calculate average value of an array
const calculateAverage = arr => arr.reduce((acc, val) => acc + parseFloat(val), 0) / arr.length;

// Function to parse patient data and update dashboard
const updateDashboard = data => {
  const temperatures = [];
  const heartRates = [];
  const bps = [];
  const spo2s = [];
  const timestamps = [];

  data.forEach(entry => {
    const value = entry.Value;
    temperatures.push(parseFloat(value.temperature));
    heartRates.push(parseFloat(value.heartrate));
    const bpValues = value.bp.split('/');
    bps.push({
      systolic: parseFloat(bpValues[0]),
      diastolic: parseFloat(bpValues[1])
    });
    spo2s.push(parseFloat(value.spo2));
    timestamps.push(new Date(entry.Timestamp).toLocaleTimeString());
  });

  // Update average values
  document.getElementById('avgTemperature').textContent = calculateAverage(temperatures).toFixed(1);
  document.getElementById('avgHeartRate').textContent = calculateAverage(heartRates).toFixed(1);
  const avgBP = {
    systolic: calculateAverage(bps.map(bp => bp.systolic)).toFixed(1),
    diastolic: calculateAverage(bps.map(bp => bp.diastolic)).toFixed(1)
  };
  document.getElementById('avgBP').textContent = `${avgBP.systolic}/${avgBP.diastolic}`;
  document.getElementById('avgSpO2').textContent = calculateAverage(spo2s).toFixed(1);

  // Temperature Chart
  new Chart(document.getElementById('temperatureChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'Temperature',
        data: temperatures,
        borderColor: 'red',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });

  // Heart Rate Chart
  new Chart(document.getElementById('heartRateChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'Heart Rate',
        data: heartRates,
        borderColor: 'blue',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });

  // Blood Pressure Chart
  new Chart(document.getElementById('bpChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'Systolic',
        data: bps.map(bp => bp.systolic),
        borderColor: 'green',
        borderWidth: 1
      }, {
        label: 'Diastolic',
        data: bps.map(bp => bp.diastolic),
        borderColor: 'orange',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });

  // SpO2 Chart
  new Chart(document.getElementById('spo2Chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'SpO2',
        data: spo2s,
        borderColor: 'purple',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });

  // Combined Chart
  new Chart(document.getElementById('combinedChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [
        {
          label: 'Temperature',
          data: temperatures,
          borderColor: 'red',
          borderWidth: 1,
          yAxisID: 'temp-y-axis'
        },
        {
          label: 'Heart Rate',
          data: heartRates,
          borderColor: 'blue',
          borderWidth: 1,
          yAxisID: 'hr-y-axis'
        },
        {
          label: 'Systolic',
          data: bps.map(bp => bp.systolic),
          borderColor: 'green',
          borderWidth: 1,
          yAxisID: 'bp-y-axis'
        },
        {
          label: 'Diastolic',
          data: bps.map(bp => bp.diastolic),
          borderColor: 'orange',
          borderWidth: 1,
          yAxisID: 'bp-y-axis'
        },
        {
          label: 'SpO2',
          data: spo2s,
          borderColor: 'purple',
          borderWidth: 1,
          yAxisID: 'spo2-y-axis'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [
          {
            id: 'temp-y-axis',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Temperature (°C)'
            }
          },
          {
            id: 'hr-y-axis',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Heart Rate (bpm)'
            }
          },
          {
            id: 'bp-y-axis',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Blood Pressure (mmHg)'
            }
          },
          {
            id: 'spo2-y-axis',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'SpO2 (%)'
            }
          }
        ]
      }
    }
  });
};

// Update dashboard with sample data
updateDashboard(patientData);
