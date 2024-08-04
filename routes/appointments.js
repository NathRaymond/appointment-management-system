const express = require('express');
const path = require('path');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Serve static files
router.use(express.static(path.join(__dirname, 'public')));

// Route to serve new.html
router.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/new.html'));
});

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments); 
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointments', error: err });
    }
});

// Create a new appointment
router.post('/new', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.json({ message: 'Appointment created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating appointment', error: err });
    }
});

// Get a specific appointment by ID
router.get('/:id', async (req, res) => {
    try {
        if (req.params.id === 'new') {
            return res.status(400).json({ message: 'Invalid appointment ID' });
        }
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointment', error: err });
    }
});

// Edit an appointment
router.put('/edit/:id', async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating appointment', error: err });
    }
});

// Delete an appointment
router.delete('/delete/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting appointment', error: err });
    }
});

module.exports = router;
