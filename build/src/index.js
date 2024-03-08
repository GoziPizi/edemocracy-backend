"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const Router_1 = __importDefault(require("./router/Router"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger-output.json"));
const PORT = 8080;
const app = (0, express_1.default)();
const httpsServer = http_1.default.createServer(app);
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.use('', Router_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
