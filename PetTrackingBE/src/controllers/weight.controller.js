const db = require('../models')
const weight = db.petWeight;

const weightController = {
async getWeightsByPet(req, res) {
    try {
        const weights = await weight.findAll({
            where: { pet_id: req.params.pet_id },
            order: [['weight_date', 'ASC']]
        });
        res.json(weights);
    } catch (err) {
        res.status(500).json({ error: "Server error fetching weights" });
    }
},
// POST a new weight entry
async addWeight (req, res) {
    const { weight_date, weight_value, notes } = req.body;
    try {
        const newWeight = await weight.create({
            pet_id: req.params.pet_id,
            weight_date,
            weight_value,
            notes
        });
        res.status(201).json(newWeight);
    } catch (err) {
        res.status(500).json({ error: "Failed to add weight" });
    }
},

// DELETE a weight entry
async deleteWeight(req, res) {
    try {
        await weight.destroy({
            where: {weight_id: req.params.weight_id}
        });
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: "Failed to delete entry"});
    }
}
}

module.exports = weightController;