'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.Client, { foreignKey: 'clientId' });
    }
  }

  Project.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    totalHours: DataTypes.INTEGER,
    hoursSpent: DataTypes.INTEGER,
    hoursOver: DataTypes.INTEGER
  },
   {
    sequelize,
    modelName: 'Project',
    tableName: 'Project',
    timestamps: true
  });

  return Project;
};
