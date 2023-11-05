'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLayout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserLayout.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'user', 
        onDelete: 'CASCADE'
      })
    }
  }
  UserLayout.init({
    userId: DataTypes.INTEGER,
    layoutName: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    widgetConfig: DataTypes.JSON,
    creationDate: DataTypes.DATE,
    lastModified: DataTypes.DATE,
    isSystemDefault: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserLayout',
  });
  return UserLayout;
};
