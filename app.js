const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const appointmentsRouter = require('./routes/appointments');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/appointmentDB';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/appointments', appointmentsRouter);

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/appointments/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new.html'));
});

app.get('/appointments/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit.html'));
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
