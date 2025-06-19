const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validate');
const userController = require('../controllers/user.controller');

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('6+ characters required'),
    body('first_name').trim().notEmpty().withMessage('First name required'),
    body('last_name').trim().notEmpty().withMessage('Last name required')
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
];

const profileValidation = [
    body('first_name').optional().trim().isLength({ min: 2 }),
    body('last_name').optional().trim().isLength({ min: 2 })
];

const passwordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('6+ characters required')
];

// Routes
router.post('/register', registerValidation, validateRequest, userController.register);
router.post('/login', loginValidation, validateRequest, userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, profileValidation, validateRequest, userController.updateProfile);
router.put('/password', authMiddleware, passwordValidation, validateRequest, userController.updatePassword);
router.delete('/account', authMiddleware, userController.deleteAccount);

module.exports = router;