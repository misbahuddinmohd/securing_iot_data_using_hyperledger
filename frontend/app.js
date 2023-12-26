const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

const adminController = require('./controllers/adminController');
app.use('/admin', adminController);

const patientController = require('./controllers/patientController');
app.use('/patient', patientController);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
