import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LoppisApp API",
      version: "1.0.0",
      description: "API documentation for LoppisApp project",
    },
    servers: [
      {
        url: "http://localhost:8080", // your dev server
      },
    ],
  },
  apis: ["./routes/*.js"], // look for docs inside your route files
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app, port) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📄 Swagger docs available at http://localhost:${port}/api-docs`);
}