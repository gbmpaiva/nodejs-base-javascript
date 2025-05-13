'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Scheduling extends Model {
    static associate(models) {
      Scheduling.belongsTo(models.Client, { foreignKey: 'clientId' });
      Scheduling.belongsTo(models.User, { foreignKey: 'userId' });
      Scheduling.belongsTo(models.Project, { foreignKey: 'projectId' });
    }
  }

  Scheduling.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
     isPointed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    date: DataTypes.STRING,
    hoursPreview: DataTypes.INTEGER,
    hoursReal: DataTypes.INTEGER,
    break: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },    
    title: DataTypes.STRING,
    link: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Scheduling',
    tableName: 'Scheduling',
    timestamps: true
  });

  return Scheduling;
};
