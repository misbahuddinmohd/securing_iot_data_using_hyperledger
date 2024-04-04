const express = require('express');
const path = require('path');
const app = express();

// const axios = require('axios').default; // Import Axios using CommonJS syntax

const port = 5000;

// async function createDatabaseIfNotExists(dbName) {
//     try {
//         await axios.head(`http://localhost:5984/${dbName}`);
//         console.log(`Database '${dbName}' already exists`);
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
//             try {
//                 await axios.put(`http://localhost:5984/${dbName}`);
//                 console.log(`Database '${dbName}' created successfully`);
//             } catch (error) {
//                 console.error(`Error creating database '${dbName}':`, error.message);
//             }
//         } else {
//             console.error(`Error checking database '${dbName}':`, error.message);
//         }
//     }
// }

// async function createDatabases() {
//     const databases = ['patients', 'doctors', 'doctorsb', 'patientsalerts', 'dataaccessrequests'];

//     try {
//         for (const dbName of databases) {
//             await createDatabaseIfNotExists(dbName);
//         }
//     } catch (error) {
//         console.error(`Error creating databases:`, error.message);
//     }
// }

// // Create databases before starting the server
// createDatabases();

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

const adminController = require('./controllers/adminController');
app.use('/admin', adminController);

const patientController = require('./controllers/patientController');
app.use('/patient', patientController);

const doctorController = require('./controllers/doctorController');
app.use('/doctor', doctorController);

const doctorbController = require('./controllers/doctorbController');
app.use('/org2', doctorbController);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
