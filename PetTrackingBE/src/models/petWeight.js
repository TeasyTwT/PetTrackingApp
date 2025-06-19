'use strict';

module.exports = (sequelize, DataTypes) => {
  const PetWeight = sequelize.define('Pet_weights', {
    weight_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pets',
        key: 'pet_id'
      }
    },
    weight_value: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    weight_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Pet_weights',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PetWeight.associate = (models) => {
    PetWeight.belongsTo(models.pet, {
      foreignKey: 'pet_id',
      as: 'pet'
    });
  };

  return PetWeight;
}; 