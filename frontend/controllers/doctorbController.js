const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/org2/doctor.html'));
});

// router.get('/showPatients', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/doctor/showPatients.html'));
// });

// router.get('/showPatientsAlerts', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/doctor/showPatientsAlerts.html'));
// });

// router.get('/queryTransaction', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/doctor/queryTransaction.html'));
// });

router.get('/assetHistory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/org2/assetHistory.html'));
});

router.get('/requestDataAccess', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/org2/requestDataAccess.html'));
});

router.get('/registerUser', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/org2/registerUser.html'));
});

router.get('/requestStatus', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/org2/requestStatus.html'));
});


module.exports = router;
