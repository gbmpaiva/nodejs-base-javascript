const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Portal Gestão Agenda',
    version: '1.0.0',
    description: 'Documentação da API com Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3331',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/auth.js', './src/router.js'], // <-- caminhos corretos agora
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
