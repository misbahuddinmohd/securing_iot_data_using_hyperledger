// Calculate averages
const temperatures = patientData.map(data => parseFloat(data.Value.temperature));
const avgTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
document.getElementById('avgTemperature').innerText = avgTemperature.toFixed(1);

const heartRates = patientData.map(data => parseFloat(data.Value.heartrate));
const avgHeartRate = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;
document.getElementById('avgHeartRate').innerText = avgHeartRate.toFixed(1);

const spo2Values = patientData.map(data => parseFloat(data.Value.spo2));
const avgSpO2 = spo2Values.reduce((a, b) => a + b, 0) / spo2Values.length;
document.getElementById('avgSpO2').innerText = avgSpO2.toFixed(1);

// Split bp into systolic and diastolic values
const bpValues = patientData.map(data => {
  const [systolic, diastolic] = data.Value.bp.split('/');
  return { systolic: parseInt(systolic), diastolic: parseInt(diastolic) };
});

const avgSystolicBP = bpValues.reduce((a, b) => a + b.systolic, 0) / bpValues.length;
const avgDiastolicBP = bpValues.reduce((a, b) => a + b.diastolic, 0) / bpValues.length;
document.getElementById('avgBP').innerText = `${avgSystolicBP.toFixed(1)}/${avgDiastolicBP.toFixed(1)}`;

// Create chart for temperature
const temperatureLabels = patientData.map(data => data.Timestamp);
const temperatureData = temperatures;
createLineChart('temperatureChart', 'Temperature', temperatureLabels, temperatureData);

// Create chart for heart rate
const heartRateData = heartRates;
createLineChart('heartRateChart', 'Heart Rate', temperatureLabels, heartRateData);

// Create chart for blood pressure (systolic and diastolic)
const systolicBPData = bpValues.map(bp => bp.systolic);
const diastolicBPData = bpValues.map(bp => bp.diastolic);
createLineChart('bpChart', 'Blood Pressure', temperatureLabels, systolicBPData, diastolicBPData);

// Create chart for SpO2
const spo2Data = spo2Values;
createLineChart('spo2Chart', 'SpO2', temperatureLabels, spo2Data);

// Function to create a line chart
function createLineChart(canvasId, label, labels, ...dataSets) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: dataSets.map((data, index) => ({
        label: index === 0 ? label : `Data ${index + 1}`,
        data: data,
        fill: false,
        borderColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        tension: 0.4
      }))
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour'
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
