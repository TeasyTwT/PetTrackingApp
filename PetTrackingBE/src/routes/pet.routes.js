const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const petController = require('../controllers/pet.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validate');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });

// Validation rules
const petValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('species').trim().notEmpty().withMessage('Species is required'),
  body('breed').trim().notEmpty().withMessage('Breed is required'),
  body('date_of_birth').optional().isISO8601().withMessage('Invalid date format'),
  body('Image_url').optional().isURL(),
];

// all routes use auth
router.use(authMiddleware);

// Routes
router.get('/', petController.getUserPets);
router.get('/:id', petController.getPet);
router.post('/', petValidation, [upload.single('pet_picture')], petController.addPet);
router.put('/:petId', petValidation, validateRequest, petController.updatePet);
router.delete('/:petId', petController.deletePet);

module.exports = router; 