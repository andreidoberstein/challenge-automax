"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
const health_routes_1 = require("./routes/health.routes");
const carts_routes_1 = require("./routes/carts.routes");
const sync_routes_1 = require("./routes/sync.routes");
const error_middleware_1 = require("./middlewares/error.middleware");
const client_1 = require("@prisma/client");
const carts_repository_1 = require("./repositories/carts.repository");
const sync_service_1 = require("./services/sync.service");
const carts_service_1 = require("./services/carts.service");
const carts_controller_1 = require("./controllers/carts.controller");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // DI simples
    const prisma = new client_1.PrismaClient();
    const cartsRepo = new carts_repository_1.CartsRepository(prisma);
    const syncService = new sync_service_1.SyncService(cartsRepo);
    const cartsService = new carts_service_1.CartsService(cartsRepo);
    const cartsController = new carts_controller_1.CartsController(cartsService, syncService);
    // Swagger
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    // Routes
    app.use(health_routes_1.healthRoutes);
    app.use("/carts", (0, carts_routes_1.cartsRoutes)(cartsController));
    app.use((0, sync_routes_1.syncRoutes)(cartsController)); // /sync
    // Error handler (sempre por último)
    app.use(error_middleware_1.errorHandler);
    return { app, prisma, syncService };
}
