'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define('Pet', {
    pet_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'Pets',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Pet.associate = (models) => {
    Pet.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'owner'
    });
    Pet.hasMany(models.petWeight, {
      foreignKey: 'pet_id',
      as: 'weights'
    });
  };

  return Pet;
}; 