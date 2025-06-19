const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notes.controller');

// Get all notes for a specific pet
router.get('/:pet_id/notes', noteController.getAllNotes);

// Get a single note
router.get('/:pet_id/notes/:note_id', noteController.getSingleNote);

// Create a new note
router.post('/:pet_id/notes', noteController.addNote);

// Update a note
router.put('/:pet_id/notes/:note_id', noteController.editNote);

// Delete a note
router.delete('/:pet_id/notes/:note_id', noteController.deleteNote);

module.exports = router;