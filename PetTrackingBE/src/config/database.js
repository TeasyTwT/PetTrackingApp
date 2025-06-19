const { sequelize } = require('../models');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Force sync in development (this will drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to initialize database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 