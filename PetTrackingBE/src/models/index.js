'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import models
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Pet = require('./pet')(sequelize, Sequelize.DataTypes);
const PetWeight = require('./petWeight')(sequelize, Sequelize.DataTypes);
const medication = require('./medication')(sequelize, Sequelize.DataTypes);
const petNote = require ('./petNote')(sequelize, Sequelize.DataTypes);

// Add models to db object
db.user = User;
db.pet = Pet;
db.petWeight = PetWeight;
db.medication = medication;
db.petNote = petNote
// Run associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
