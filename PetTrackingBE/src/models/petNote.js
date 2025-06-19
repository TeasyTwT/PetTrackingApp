'use strict';

module.exports = (sequelize, DataTypes) => {
  const PetNote = sequelize.define('PetNote', {
    note_id: {
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
    note_type: {
      type: DataTypes.ENUM('General', 'Feeding', 'Vet'),
      allowNull: false,
      defaultValue: 'General'
    },
    note_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    note_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    feeding_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    food_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    portion_size: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    vet_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    modelName: 'PetNote',
    tableName: 'pet_notes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  PetNote.associate = (models) => {
    PetNote.belongsTo(models.pet, {
      foreignKey: 'pet_id',
      as: 'pet'
    });
  };

  return PetNote;
};