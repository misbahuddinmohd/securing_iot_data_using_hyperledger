var isFetching = false; // Variable to track whether data fetching is in progress

function startFetching() {
  if (!isFetching) {
    // Set flag to true to indicate that data fetching is in progress
    isFetching = true;

    // Hide the start button
    document.getElementById("startButton").style.display = "none";

    // Start fetching data
    fetchData();
  }
}

function fetchData() {
  // Fetch sensor data from local server using AJAX
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Update the sensor data on the webpage
      updateSensorData(JSON.parse(xhr.responseText));
    }
  };
  xhr.open("GET", "http://localhost:8000/sensorData", true);
  xhr.send();
}

function updateSensorData(data) {
  // Display the sensor data on the webpage
  document.getElementById("sensorData").innerHTML =
    "Heart Rate: " + data.heartRate + "<br>" +
    "Temperature: " + data.temperature + " &deg;C";

  // Schedule the next update after 10 seconds
  setTimeout(fetchData, 10000);
}

// Initial fetch and update
// This can be triggered automatically or manually after clicking the "Start Viewing" button
// fetchData();
