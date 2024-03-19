import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import UserService from '@/services/UserService';
import express, { NextFunction, Request, Response } from 'express'

const UserRouter = express.Router();

UserRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
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
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const user = await UserService.getUserById(userId);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
});

UserRouter.get('/personality', async (req: Request, res: Response, next: NextFunction) => {
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
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const user = await UserService.getUserPersonalityById(userId);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
});

UserRouter.get('/party', async (req: Request, res: Response, next: NextFunction) => {
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
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const user = await UserService.getUserPartyById(userId);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
});

UserRouter.get('/:id/public', async (req, res) => {
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
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

UserRouter.put('/:id', async (req, res) => {
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
        res.status(200)
    } catch (error) {
        console.log(error);
    }
});

export default UserRouter;