'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.RepaymentCalculator, {
        foreignKey: 'userId',
        as: 'calc',
        onDelete: 'CASCADE',
        hooks: true 
      })
      User.hasMany(models.UserFiles,{
        foreignKey: 'userId',
        as: 'files',
        onDelete: 'CASCADE',
        hooks: true 
      })
      User.hasMany(models.UserPreferences,{
        foreignKey: 'userId',
        as: 'prefs',
        onDelete: 'CASCADE',
        hooks: true
      })
      User.hasMany(models.UserLayout,{
        foreignKey: 'userId',
        as: 'layout', 
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
