const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

function setupSwagger(app) {
  const yamlPath = path.join(__dirname, '../../../docs/api/openapi.yaml');
  const file = fs.readFileSync(yamlPath, 'utf8');
  const swaggerDocument = yaml.load(file);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger docs available at /api-docs');
}

module.exports = setupSwagger;