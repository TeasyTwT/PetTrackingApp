'use strict';

module.exports = (sequelize, DataTypes) => {
  const Medication = sequelize.define('Medication', {
    medication_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pets',
        key: 'pet_id'
      }
    },
    medication_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dosage: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    frequency: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    modelName: 'Medication',
    tableName: 'medications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Medication.associate = (models) => {
    Medication.belongsTo(models.pet, {
      foreignKey: 'pet_id',
      as: 'pet'
    });
  };

  return Medication;
};