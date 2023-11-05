'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserFiles.init({
    userId: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    fileType: {
      type: DataTypes.ENUM('pdf', 'image', 'text'), 
      allowNull: false 
    },
    uploadDate: DataTypes.DATE,
    filePath: DataTypes.STRING,
    textContent: DataTypes.TEXT,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserFiles',
  });
  return UserFiles;
};
