"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRouter = express_1.default.Router();
UserRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Create a new user'
        #swagger.parameters['body'] = {
            description: 'User information',
            required: true,
            schema: { $ref: "#/definitions/UserCreateInputDtoDefinition" }
        }
        #swagger.responses[201] = {
            description: 'User created',
        }
    */
    try {
        //TODO
        res.status(201);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get user by id'
        #swagger.parameters['id'] = { description: 'User id', required: true }
        #swagger.responses[200] = {
            description: 'User found',
            schema: { $ref: "#/definitions/UserOutputDefinition" }
        }
     */
    try {
        //TODO
        res.status(200);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.get('/:id/public', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get public user by id'
        #swagger.parameters['id'] = { description: 'User id', required: true }
        #swagger.responses[200] = {
            description: 'User found',
            schema: { $ref: "#/definitions/UserPublicOutputDefinition" }
        }
     */
    try {
        //TODO
        res.status(200);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Update user by id'
        #swagger.parameters['id'] = { description: 'User id', required: true }
        #swagger.parameters['body'] = {
            description: 'User information',
            required: true,
            schema: { $ref: "#/definitions/UserUpdateInputDefinition" }
        }
        #swagger.responses[200] = {
            description: 'User updated',
            schema: { $ref: "#/definitions/UserOutputDefinition" }
        }
     */
    try {
        //TODO
        res.status(200);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = UserRouter;
