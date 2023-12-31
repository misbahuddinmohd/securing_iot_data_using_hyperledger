const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/patient/patient.html'));
});

router.get('/invokeTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/patient/invokeTransaction.html'));
});

router.get('/queryTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/patient/queryTransaction.html'));
});

router.get('/updateTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/patient/updateTransaction.html'));
});

router.get('/assetHistory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/patient/assetHistory.html'));
});

module.exports = router;
