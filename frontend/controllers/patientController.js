const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/patient/patient.html'));
});

// router.get('/registerPatient', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin/registerPatient.html'));
// });

// router.get('/invokeTransaction', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin/invokeTransaction.html'));
// });

// router.get('/queryTransaction', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin/queryTransaction.html'));
// });

// router.get('/updateTransaction', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin/updateTransaction.html'));
// });

// router.get('/assetHistory', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin/assetHistory.html'));
// });

module.exports = router;
