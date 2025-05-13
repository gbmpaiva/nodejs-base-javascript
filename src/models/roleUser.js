'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoleUser extends Model {
    static associate(models) {
      // Correção 1: Alterar para roleId (nome lógico para relação com Role)
      RoleUser.belongsTo(models.User, { foreignKey: 'userId' });
      RoleUser.belongsTo(models.Role, { foreignKey: 'roleId' }); // ← Aqui é a mudança crucial
    }
  }

  RoleUser.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    roleId: { // Correção 2: Renomear profileId para roleId
      type: DataTypes.UUID,
      allowNull: false
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'RoleUser',
    tableName: 'RoleUser',
    timestamps: true
  });

  return RoleUser;
};