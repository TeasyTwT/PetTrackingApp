const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const weightController = require('../controllers/weight.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validate');

// all routes use auth
router.use(authMiddleware);

// Validation rules
const weightValidation = [
    body('weight_value').isFloat({ min: 0.1 }).withMessage('Weight must be a positive number (e.g., 12.5)'),
    body('weight_date').isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
    body('notes').optional().isString().trim().escape()
];

// Routes
router.get('/:pet_id/weights', weightController.getWeightsByPet);
router.post('/:pet_id/weights', weightValidation, validateRequest, weightController.addWeight);
router.delete('/weights/:weight_id', weightController.deleteWeight);

module.exports = router;