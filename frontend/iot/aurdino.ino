// // 1st 
// #include <OneWire.h>
// #include <DallasTemperature.h>

// #define PULSE_SENSOR_PIN A0
// #define ONE_WIRE_BUS 2

// // Pulse Sensor variables
// int pulseValue;
// int heartRate;

// // Temperature Sensor variables
// OneWire oneWire(ONE_WIRE_BUS);
// DallasTemperature sensors(&oneWire);
// float Celsius = 0;
// float Fahrenheit = 0;

// void setup() {
//   sensors.begin();
//   Serial.begin(9600);
// }

// void loop() {
//   // Read the raw pulse sensor value
//   pulseValue = analogRead(PULSE_SENSOR_PIN);

//   // sensors.requestTemperature();
//   Celsius = sensors.getTempCByIndex(0);

//   // Calculate heart rate based on the pulse sensor value
//   if (pulseValue > 0) {
//     heartRate = mapHeartRate(pulseValue);

//     // Send sensor data as JSON to the serial port
//     Serial.print("{\"heartRate\":");
//     Serial.print(heartRate);
//     Serial.print(",\"temperature\":");
//     Serial.print(Celsius);
//     Serial.println("}");

//     // Delay for 0.5 seconds
//     delay(500);
//   }
// }

// // Function to manually map the pulse sensor value to heart rate
// int mapHeartRate(int sensorValue) {
//   // Define the sensor value range and corresponding heart rate range
//   int sensorMin = 200;
//   int sensorMax = 600;
//   int heartRateMin = 60;
//   int heartRateMax = 200;

//   // Scale the sensor value to the heart rate range
//   return ((sensorValue - sensorMin) * (heartRateMax - heartRateMin) / (sensorMax - sensorMin)) + heartRateMin;
// }


// // 2nd 
// #include <OneWire.h>
// #include <DallasTemperature.h>

// #define PULSE_SENSOR_PIN A0
// #define ONE_WIRE_BUS 2

// // Pulse Sensor variables
// int pulseValue;
// int heartRate;

// // Temperature Sensor variables
// OneWire oneWire(ONE_WIRE_BUS);
// DallasTemperature sensors(&oneWire);
// float Celsius = 0;
// float Fahrenheit = 0;

// void setup() {
//   Serial.begin(9600);
//   sensors.begin();
// }

// void loop() {
//   // Read the raw pulse sensor value
//   pulseValue = analogRead(PULSE_SENSOR_PIN);

//   // Calculate heart rate based on the pulse sensor value
//   if (pulseValue > 0) {
//     heartRate = mapHeartRate(pulseValue);

//     // Read temperature in Celsius
//     Celsius = sensors.getTempCByIndex(0);

//     // Convert Celsius to Fahrenheit
//     Fahrenheit = (Celsius * 9.0/5.0) + 32.0;

//     // Send sensor data as JSON to the serial port
//     Serial.print("{\"heartRate\":");
//     Serial.print(heartRate);
//     Serial.print(",\"temperature\":");
//     Serial.print(Fahrenheit);  // Print temperature in Fahrenheit
//     Serial.println("}");

//     // Delay for 0.5 seconds
//     delay(500);
//   }
// }

// // Function to manually map the pulse sensor value to heart rate
// int mapHeartRate(int sensorValue) {
//   // Define the sensor value range and corresponding heart rate range
//   int sensorMin = 200;
//   int sensorMax = 600;
//   int heartRateMin = 60;
//   int heartRateMax = 200;

//   // Scale the sensor value to the heart rate range
//   return ((sensorValue - sensorMin) * (heartRateMax - heartRateMin) / (sensorMax - sensorMin)) + heartRateMin;
// }


// // 3rd
#include <OneWire.h>
#include <DallasTemperature.h>

#define PULSE_SENSOR_PIN A0
#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Pulse Sensor variables
int pulseValue;
int heartRate;

// Temperature Sensor variables
float Celsius = 0;
float Fahrenheit = 0;

void setup() {
  sensors.begin();
  Serial.begin(9600);
}

void loop() {
  // Read the raw pulse sensor value
  pulseValue = analogRead(PULSE_SENSOR_PIN);

  // Request temperature from DS18B20
  sensors.requestTemperatures();
  Celsius = sensors.getTempCByIndex(0);
  Fahrenheit = sensors.toFahrenheit(Celsius);

  // Calculate heart rate based on the pulse sensor value
  if (pulseValue > 0) {
    heartRate = mapHeartRate(pulseValue);

    // Send sensor data as JSON to the serial port
    Serial.print("{\"heartRate\":");
    Serial.print(round(heartRate * 100.0) / 100.0);
    Serial.print(",\"temperature\":");
    Serial.print(round(Fahrenheit * 100.0) / 100.0);
    Serial.println("}");

    // Delay for 0.5 seconds
    delay(500);
  }
}

// Function to manually map the pulse sensor value to heart rate
int mapHeartRate(int sensorValue) {
  // Define the sensor value range and corresponding heart rate range
  int sensorMin = 200;
  int sensorMax = 600;
  int heartRateMin = 65;
  int heartRateMax = 200;

  // Scale the sensor value to the heart rate range
  return ((sensorValue - sensorMin) * (heartRateMax - heartRateMin) / (sensorMax - sensorMin)) + heartRateMin;
}
