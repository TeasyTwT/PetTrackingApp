const db = require('../models')
const medication = db.medication;

const mediController = {
    async getMedsByPet(req, res) {
        try {
            const medications = await medication.findAll({
                where: { pet_id: req.params.pet_id },
                order: [['medication_name', 'ASC']]
            });
            res.json(medications);
        } catch (err) {
            res.status(500).json({ error: "Server error fetching meds" });
        }
    },
// POST a new medication entry
    async addMedication (req, res) {
        const { medication_name, dosage, frequency, start_date} = req.body;
        try {
            const newMed = await medication.create({
                pet_id: req.params.pet_id,
                medication_name,
                dosage,
                frequency,
                start_date
            });
            res.status(201).json(newMed);
        } catch (err) {
            res.status(500).json({ error: "Failed to add Medication" });
        }
    },
// POST a medication update

    async updateMedication(req, res) {},


// DELETE a medication entry
    async deleteMedication(req, res) {
        try {
            await medication.destroy({
                where: {medication_id: req.params.medication_id}
            });
            res.json({success: true});
        } catch (err) {
            res.status(500).json({error: "Failed to delete entry"});
        }
    }
}

module.exports = mediController;