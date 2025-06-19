const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;

const userController = {
  async register(req, res) {
    try {
      const { email, password, first_name, last_name } = req.body;

      // Check existing user
      if (await User.findOne({ where: { email } })) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create user
      const user = await User.create({
        email,
        password_hash: await bcrypt.hash(password, 12),
        first_name,
        last_name
      });

      // Generate JWT
      const token = jwt.sign(
          { user_id: user.user_id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: { user_id: user.user_id, email, first_name, last_name }
      });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });


      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
          { user_id: user.user_id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Login.js failed', error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.user_id, {
        attributes: ['user_id', 'email', 'first_name', 'last_name']
      });
      res.json(user || {});
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await user.update({
        first_name: req.body.first_name || user.first_name,
        last_name: req.body.last_name || user.last_name
      });

      res.json({
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      });
    } catch (error) {
      res.status(500).json({ message: 'Profile update failed', error: error.message });
    }
  },

  async updatePassword(req, res) {
    try {
      const user = await User.findByPk(req.user.user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (!(await bcrypt.compare(req.body.currentPassword, user.password_hash))) {
        return res.status(401).json({ message: 'Current password incorrect' });
      }

      await user.update({
        password_hash: await bcrypt.hash(req.body.newPassword, 12)
      });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Password update failed', error: error.message });
    }
  },

  async deleteAccount(req, res) {
    try {
      const user = await User.findByPk(req.user.user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await user.destroy();
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Account deletion failed', error: error.message });
    }
  }
};

module.exports = userController;