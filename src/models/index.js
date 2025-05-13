'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/database');
const db = {};

// Inicializa a conexão com o Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging || false,
});

// Lê e importa todos os modelos da pasta atual (exceto este arquivo)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      !file.includes('.test.js')
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Executa associações se definidas nos modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Definindo os relacionamentos diretamente aqui
const { User, Client, Project, Scheduling } = db;

if (User && Scheduling) {
  User.hasMany(Scheduling, { foreignKey: 'userId', as: 'schedulings' });
  Scheduling.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}

if (Client && Scheduling) {
  Client.hasMany(Scheduling, { foreignKey: 'clientId', as: 'schedulings' });
  Scheduling.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
}

if (Project && Scheduling) {
  Project.hasMany(Scheduling, { foreignKey: 'projectId', as: 'schedulings' });
  Scheduling.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
}

// Exporta o Sequelize e os modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
