const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const petRoutes = require('./pet.routes');
const weightRoutes = require('./weight.routes');
const medicationRoutes = require('./medication.routes');
const petNoteRoutes = require('./petnote.routes');

// User routes (/api/users/...)
router.use('/users', userRoutes);

// Pet routes (/api/pets/...)
router.use('/pets', petRoutes);

//weight routes (api/pets/pets:id/weights)
router.use('/pets', weightRoutes);

// Medication routes (/api/pets/pet:id/medication)
router.use('/pets',  medicationRoutes);

// Pet Note routes (/api/pets/pet:id/notes)
router.use('/pets', petNoteRoutes);

module.exports = router;