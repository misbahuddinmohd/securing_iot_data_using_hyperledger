// const express = require('express');
// const path = require('path');
// const router = express.Router();

// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin/admin.html'));
// });

// router.get('/registerPatient', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/admin/registerPatient.html'));
// });

// module.exports = router;
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/admin.html'));``
});

router.get('/showPatients', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/showPatients.html'));
});

router.get('/showDoctors', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/showDoctors.html'));
});


router.get('/registerUser', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/registerUser.html'));
});


router.get('/invokeTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/invokeTransaction.html'));
});

router.get('/queryTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/queryTransaction.html'));
});

router.get('/updateTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/updateTransaction.html'));
});

router.get('/assetHistory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/assetHistory.html'));
});


module.exports = router;
