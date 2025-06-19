const db = require('../models');
const PetNote = db.petNote;

const noteController = {
    // Get all notes for a specific pet
    async getAllNotes(req, res) {
        try {
            const notes = await PetNote.findAll({
                where: { pet_id: req.params.pet_id },
                order: [['note_date', 'DESC']]
            });
            res.status(200).json(notes);
        } catch(err) {
            res.status(500).json({ error: 'Error getting notes.' });
        }
    },

    // Get a single note by ID
    async getSingleNote(req, res) {
        try {
            const note = await PetNote.findOne({
                where: {
                    note_id: req.params.note_id,
                    pet_id: req.params.pet_id
                }
            });
            
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            
            res.status(200).json(note);
        } catch(err) {
            res.status(500).json({ error: 'Error getting note.' });
        }
    },

    // Add a new note
    async addNote(req, res) {
        try {
            const {
                note_type,
                note_text,
                note_date,
                feeding_time,
                food_type,
                portion_size,
                appointment_date,
                vet_name,
                purpose
            } = req.body;

            const newNote = await PetNote.create({
                pet_id: req.params.pet_id,
                note_type: note_type || 'General',
                note_text,
                note_date: note_date || new Date(),
                feeding_time,
                food_type,
                portion_size,
                appointment_date,
                vet_name,
                purpose
            });
            res.status(201).json(newNote);
        } catch(err) {
            res.status(500).json({ error: 'Error creating note.' });
        }
    },

    // Edit an existing note
    async editNote(req, res) {
        try {
            const {
                note_type,
                note_text,
                note_date,
                feeding_time,
                food_type,
                portion_size,
                appointment_date,
                vet_name,
                purpose
            } = req.body;

            const note = await PetNote.findOne({
                where: {
                    note_id: req.params.note_id,
                    pet_id: req.params.pet_id
                }
            });

            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }

            await note.update({
                note_type: note_type || note.note_type,
                note_text: note_text || note.note_text,
                note_date: note_date || note.note_date,
                feeding_time: feeding_time || note.feeding_time,
                food_type: food_type || note.food_type,
                portion_size: portion_size || note.portion_size,
                appointment_date: appointment_date || note.appointment_date,
                vet_name: vet_name || note.vet_name,
                purpose: purpose || note.purpose
            });

            res.status(200).json(note);
        } catch(err) {
            res.status(500).json({ error: 'Error updating note.' });
        }
    },

    // Delete a note
    async deleteNote(req, res) {
        try {
            const note = await PetNote.findOne({
                where: {
                    note_id: req.params.note_id,
                    pet_id: req.params.pet_id
                }
            });

            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }

            await note.destroy();
            res.status(200).json({ message: 'Note deleted successfully' });
        } catch(err) {
            res.status(500).json({ error: 'Error deleting note.' });
        }
    }
};

module.exports = noteController;