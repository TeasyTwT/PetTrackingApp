const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const mediController = require('../controllers/medication.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validate');

// All routes use auth
router.use(authMiddleware);

// Validation rules
const medicationValidation = [
    body('medication_name').notEmpty().withMessage('Medication name is required'),
    body('dosage').optional().isString(),
    body('start_date').optional().isISO8601().toDate(),
];

// Routes
router.get('/:pet_id/medications', mediController.getMedsByPet);
router.post('/:pet_id/medications', medicationValidation, validateRequest, mediController.addMedication);
router.put('/medications/:medication_id', medicationValidation, validateRequest, mediController.updateMedication);
router.delete('/medications/:medication_id', mediController.deleteMedication);

module.exports = router;