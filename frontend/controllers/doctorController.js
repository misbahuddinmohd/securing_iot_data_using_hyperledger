const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/doctor/doctor.html'));
});

router.get('/queryTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/doctor/queryTransaction.html'));
});

router.get('/assetHistory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/doctor/assetHistory.html'));
});


module.exports = router;
