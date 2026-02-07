import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Automax Carts API",
      version: "1.0.0",
      description: "API para sincronizar e consultar carrinhos armazenados localmente."
    }
  },
  apis: ["./src/routes/*.ts"]
});
