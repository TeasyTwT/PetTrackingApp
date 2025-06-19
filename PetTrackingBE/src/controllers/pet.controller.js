const db = require('../models');
const Pet = db.pet;

const petController = {
  // Get all pets for the logged-in user
  async getUserPets(req, res) {
    try {
      const pets = await Pet.findAll({
        where: { user_id: req.user.user_id },
        order: [['created_at', 'DESC']]
      });
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch pets', error: error.message });
    }
  },

  // Get a single pet by ID
  async getPet(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.findOne({
        where: {
          pet_id: id,
          user_id: req.user.user_id
        }
      });

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      res.json(pet);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch pet', error: error.message });
    }
  },

  // Add a new pet
  async addPet(req, res) {
    try {
      const { name, species, breed, date_of_birth } = req.body;

      // File handling
      const imageUrl = req.file
          ? `${req.file.filename}`
          : null;

      const pet = await Pet.create({
        user_id: req.user.user_id,
        name,
        species,
        breed,
        date_of_birth,
        Image_url: imageUrl
      });

      res.status(201).json(pet);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add pet', error: error.message });
    }
  },

  // Update a pet
  async updatePet(req, res) {
    try {
      const { petId } = req.params;
      const pet = await Pet.findOne({
        where: {
          pet_id: petId,
          user_id: req.user.user_id
        }
      });

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      // Handle image update
      if (req.file) {
        // Delete old image if it exists
        if (pet.Image_url) {
          const oldImagePath = path.join(__dirname, '..', '..', pet.Image_url);
          fs.unlink(oldImagePath, (err) => {
            if (err && err.code !== 'ENOENT') console.error('Error deleting old image:', err);
          });
        }
        req.body.Image_url = `/uploads/${req.file.filename}`;
      }

      await pet.update(req.body);
      res.json(pet);
    } catch (error) {
      // If there was an error and a file was uploaded, delete it
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      res.status(500).json({ message: 'Failed to update pet', error: error.message });
    }
  },

  // Delete a pet
  async deletePet(req, res) {
    try {
      const { petId } = req.params;
      const pet = await Pet.findOne({
        where: {
          pet_id: petId,
          user_id: req.user.user_id
        }
      });

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      await pet.destroy();
      res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete pet', error: error.message });
    }
  }
};

module.exports = petController; 