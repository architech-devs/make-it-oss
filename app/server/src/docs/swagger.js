import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import yaml from 'js-yaml';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupSwagger(app) {
  // compute absolute path to openapi file
  const yamlPath = path.resolve(__dirname, '../../../docs/api/openapi.yaml');

  // read YAML file asynchronously
  const fileContents = await readFile(yamlPath, 'utf8');
  const swaggerDocument = yaml.load(fileContents);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger UI available at /api-docs');
}