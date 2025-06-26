import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Laundry Backend API',
      version: '1.0.0',
    },
  },
  apis: ['./src/index.ts'], // endpoint açıklamaları buradan alınır
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
