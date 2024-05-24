import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import UserService from '@/services/UserService';
import express, { NextFunction, Request, Response } from 'express'
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

UserRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
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
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const user = await UserService.updateUserById(userId, req.body);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
});

UserRouter.put(
    '/profile-picture',
    upload.single('profilePicture'),
    async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Update the profile picture of the logged user'
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
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const file = req.file;
        if (!file) {
            throw new Error('No file provided');
        }
        const user = await UserService.updateProfilePicture(userId, file);
        res.status(200).send(user);
    } catch (error) {
        next(error);
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

UserRouter.get('/partis', async (req: Request, res: Response, next: NextFunction) => {
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
        const user = await UserService.getUserPartisById(userId);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
});

UserRouter.post('/opinions', async (req: Request, res: Response, next: NextFunction) => {
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
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const { topicId, opinion } = req.body;
        await UserService.postOpinion(userId, topicId, opinion);
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
});

UserRouter.get('/opinions', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Get the opinions of the logged user'
        #swagger.responses[200] = {
            description: 'User found
        }
    */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const opinions = await UserService.getUserOpinions(userId);
        res.status(200).send(opinions);
    } catch (error) {
        console.log(error);
    }
});

UserRouter.delete('/opinions/:id', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Delete an opinion of the logged user'
        #swagger.parameters['id'] = { description: 'Opinion id', required: true }
        #swagger.responses[200] = {
            description: 'Opinion deleted'
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const opinionId = req.params.id;
        await UserService.deleteOpinion(userId, opinionId);
        res.status(200).send();
    } catch (error) {
        next(error);
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

UserRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['User']
        #swagger.description = 'Delete the logged user'
        #swagger.responses[200] = {
            description: 'User deleted'
        }
     */
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        await UserService.deleteUserById(userId);
        res.status(200).send('User deleted');
    } catch (error) {
        console.log(error);
    }
});

export default UserRouter;