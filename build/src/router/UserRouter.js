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
const JwtExceptions_1 = require("../exceptions/JwtExceptions");
const AuthentificationService_1 = __importDefault(require("../services/AuthentificationService"));
const UserService_1 = __importDefault(require("../services/UserService"));
const express_1 = __importDefault(require("express"));
const UserRouter = express_1.default.Router();
UserRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get the logged user'
        #swagger.responses[200] = {
            description: 'User found',
            schema: { $ref: "#/definitions/UserOutputDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new JwtExceptions_1.JwtNotInHeaderException();
        }
        const userId = AuthentificationService_1.default.getUserId(token);
        const user = yield UserService_1.default.getUserById(userId);
        res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.put('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Update the logged user'
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
        const token = req.headers.authorization;
        if (!token) {
            throw new JwtExceptions_1.JwtNotInHeaderException();
        }
        const userId = AuthentificationService_1.default.getUserId(token);
        const user = yield UserService_1.default.updateUserById(userId, req.body);
        res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.get('/personality', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get the personality of the logged user if he has one'
        #swagger.responses[200] = {
            description: 'User found',
            schema: { $ref: "#/definitions/UserOutputDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new JwtExceptions_1.JwtNotInHeaderException();
        }
        const userId = AuthentificationService_1.default.getUserId(token);
        const user = yield UserService_1.default.getUserPersonalityById(userId);
        res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.get('/party', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get the party of the logged user if he has one'
        #swagger.responses[200] = {
            description: 'User found',
            schema: { $ref: "#/definitions/UserOutputDefinition" }
        }
     */
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new JwtExceptions_1.JwtNotInHeaderException();
        }
        const userId = AuthentificationService_1.default.getUserId(token);
        const user = yield UserService_1.default.getUserPartyById(userId);
        res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.post('/opinion', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Pour poster son opinion par rapport à un topic
        #swagger.parameters['body'] = {
            description: 'Opinion information',
            required: true,
        }
        #swagger.responses[200] = {
            description: 'Opinion posted',
        }
     */
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new JwtExceptions_1.JwtNotInHeaderException();
        }
        const userId = AuthentificationService_1.default.getUserId(token);
        const { topicId, opinion } = req.body;
        yield UserService_1.default.postOpinion(userId, topicId, opinion);
        res.status(200).send(opinion);
    }
    catch (error) {
        console.log(error);
    }
}));
UserRouter.get('/opinions', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get the opinions of the logged user'
        #swagger.responses[200] = {
            description: 'User found
        }
    */
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new JwtExceptions_1.JwtNotInHeaderException();
        }
        const userId = AuthentificationService_1.default.getUserId(token);
        const opinions = yield UserService_1.default.getUserOpinions(userId);
        res.status(200).send(opinions);
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
