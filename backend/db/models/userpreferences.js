'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPreferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserPreferences.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      })
      UserPreferences.belongsTo(models.Themes, {
        foreignKey: 'activeThemeId',
        as: 'activeTheme',
        onDelete: 'SET NULL'
      })
    }
  }
  UserPreferences.init({
    userId: DataTypes.INTEGER,
    activeThemeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserPreferences',
  });
  return UserPreferences;
};
